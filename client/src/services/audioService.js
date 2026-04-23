// Audio processing service using Web Audio API
// Exports createAudioProcessor(audioContext, mediaStream, onFeatures) -> { stop }

export function createAudioProcessor(audioContext, mediaStream, onFeatures) {
  const source = audioContext.createMediaStreamSource(mediaStream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);
  let raf = null;
  let running = true;

  function step() {
    if (!running) return;
    analyser.getByteFrequencyData(data);
    // Simple feature extraction: spectral centroid-like estimate and RMS
    let sum = 0, weighted = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      sum += v;
      weighted += i * v;
    }
    const rms = Math.sqrt(data.reduce((s, v) => s + (v*v), 0) / data.length) / 255;
    const centroid = sum ? (weighted / sum) / data.length : 0;

    onFeatures && onFeatures({ rms, centroid, raw: data.slice(0) });
    raf = requestAnimationFrame(step);
  }

  raf = requestAnimationFrame(step);

  return {
    stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      try {
        source.disconnect();
        analyser.disconnect();
      } catch (e) {}
    }
  };
}

export default { createAudioProcessor };
