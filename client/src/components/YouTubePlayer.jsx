import React, { useEffect, useRef } from 'react';

// Simple YouTube iframe player that supports start time (seconds)
export default function YouTubePlayer({ videoId, start = 0, width = 560, height = 315 }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!videoId) return;
    const src = `https://www.youtube.com/embed/${videoId}?start=${Math.floor(start)}&enablejsapi=1`;
    if (iframeRef.current) iframeRef.current.src = src;
  }, [videoId, start]);

  return (
    <div className="youtube-player">
      <iframe
        ref={iframeRef}
        title="YouTube Player"
        width={width}
        height={height}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
