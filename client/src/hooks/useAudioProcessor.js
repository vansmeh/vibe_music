import { useEffect, useRef } from 'react';

// Hook wrapper if needed for higher-level audio processing lifecycles
export default function useAudioProcessor(createProcessor, audioContext, mediaStream, onFeatures) {
  const ref = useRef(null);
  useEffect(() => {
    if (!createProcessor || !audioContext || !mediaStream) return;
    ref.current = createProcessor(audioContext, mediaStream, onFeatures);
    return () => {
      if (ref.current && ref.current.stop) ref.current.stop();
    };
  }, [createProcessor, audioContext, mediaStream, onFeatures]);
}
