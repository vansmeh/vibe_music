import { useState, useEffect } from 'react';

export default function useMicrophone() {
  const [mediaStream, setMediaStream] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!mounted) return;
        setMediaStream(stream);
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(ctx);
      } catch (err) {
        setError(err.message || 'Microphone access denied');
      }
    }
    init();

    return () => {
      mounted = false;
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }
      if (audioContext && audioContext.close) audioContext.close();
    };
  }, []);

  return { mediaStream, audioContext, error };
}
