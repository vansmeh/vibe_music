import React, { useEffect, useRef } from 'react';
import useMicrophone from '../hooks/useMicrophone';

// MicInput component: obtains mic via useMicrophone and wires to a processor factory
export default function MicInput({ onFeatures, createProcessor }) {
  const { audioContext, mediaStream, error } = useMicrophone();
  const processorRef = useRef(null);

  useEffect(() => {
    if (!mediaStream || !audioContext || !createProcessor) return;
    processorRef.current = createProcessor(audioContext, mediaStream, (features) => {
      onFeatures && onFeatures(features);
    });

    return () => {
      if (processorRef.current && processorRef.current.stop) processorRef.current.stop();
    };
  }, [audioContext, mediaStream, createProcessor, onFeatures]);

  if (error) return <div className="mic-error">Microphone error: {error}</div>;
  return <div className="mic-status">Microphone: {mediaStream ? 'capturing' : 'inactive'}</div>;
}
