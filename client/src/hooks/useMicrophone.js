import { useState, useEffect, useRef, useCallback } from 'react';

// useMicrophone
// - requests microphone permission
// - captures audio stream via Web Audio API
// - records a fixed duration (default 4s, range 3-5s)
// - returns raw audio as Float32Array
// - provides clean error handling

export default function useMicrophone() {
  const [isSupported, setIsSupported] = useState(true);
  const [recording, setRecording] = useState(false);
  const [audioData, setAudioData] = useState(null); // Float32Array
  const [error, setError] = useState(null);

  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const recordingRef = useRef(false);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !(window.AudioContext || window.webkitAudioContext)) {
      setIsSupported(false);
      setError('Web Audio API or getUserMedia not supported in this browser');
    }
    return () => {
      // cleanup on unmount
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopRecording = useCallback(() => {
    recordingRef.current = false;
    setRecording(false);

    try {
      if (processorRef.current) {
        const { node, source, timeoutId } = processorRef.current;
        if (node) {
          node.onaudioprocess = null;
          try { node.disconnect(); } catch (e) {}
        }
        if (source) {
          try { source.disconnect(); } catch (e) {}
        }
        if (timeoutId) clearTimeout(timeoutId);
        processorRef.current = null;
      }

      if (mediaStreamRef.current) {
        try { mediaStreamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) {}
        mediaStreamRef.current = null;
      }

      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch (e) {}
        audioContextRef.current = null;
      }
    } catch (e) {
      // swallow cleanup errors
    }
  }, []);

  const startRecording = useCallback(async (durationSeconds = 4) => {
    setError(null);
    setAudioData(null);
    if (!isSupported) {
      setError('Microphone not supported');
      return null;
    }
    if (recordingRef.current) return null;

    // clamp duration to 3-5 seconds
    const duration = Math.max(3, Math.min(5, Math.floor(durationSeconds)));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const bufferSize = 4096;
      const processor = ctx.createScriptProcessor(bufferSize, 1, 1);

      const sampleRate = ctx.sampleRate || 44100;
      const requiredSamples = Math.floor(duration * sampleRate);
      let collected = 0;
      const buffers = [];

      recordingRef.current = true;
      setRecording(true);

      processor.onaudioprocess = (e) => {
        if (!recordingRef.current) return;
        const input = e.inputBuffer.getChannelData(0);
        buffers.push(new Float32Array(input));
        collected += input.length;

        if (collected >= requiredSamples) {
          const out = new Float32Array(requiredSamples);
          let offset = 0;
          for (const buf of buffers) {
            const need = Math.min(buf.length, requiredSamples - offset);
            out.set(buf.subarray(0, need), offset);
            offset += need;
            if (offset >= requiredSamples) break;
          }
          setAudioData(out);
          stopRecording();
        }
      };

      source.connect(processor);
      // connecting to destination is required in some browsers to keep the processor running
      processor.connect(ctx.destination);

      // safety timeout in case onaudioprocess doesn't fill buffers exactly
      const timeoutId = setTimeout(() => {
        if (!recordingRef.current) return;
        // assemble whatever we have (may be shorter than requiredSamples)
        const totalSamples = buffers.reduce((s, b) => s + b.length, 0);
        const len = Math.min(totalSamples, requiredSamples);
        const out = new Float32Array(len);
        let off = 0;
        for (const buf of buffers) {
          const need = Math.min(buf.length, len - off);
          out.set(buf.subarray(0, need), off);
          off += need;
          if (off >= len) break;
        }
        setAudioData(out);
        stopRecording();
      }, (duration + 0.6) * 1000);

      processorRef.current = { node: processor, source, timeoutId };

      return true;
    } catch (err) {
      // handle permission errors cleanly
      const name = err && err.name ? err.name : null;
      if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') {
        setError('Microphone permission denied');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setError('No microphone found');
      } else {
        setError(err && err.message ? err.message : String(err));
      }
      stopRecording();
      return null;
    }
  }, [isSupported, stopRecording]);

  return { isSupported, recording, audioData, error, startRecording, stopRecording };
}
