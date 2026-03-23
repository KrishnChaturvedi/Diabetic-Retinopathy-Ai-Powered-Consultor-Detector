import React, { useEffect, useRef, useState } from 'react';
import './CameraCapture.css';

export default function CameraCapture({ onCancel, onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [error, setError] = useState('');
  const [facingMode, setFacingMode] = useState('environment');

  // Auto start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  async function startCamera() {
    try {
      setError('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error(err);
      setError('Camera blocked. Tap anywhere to allow access.');
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  function handleCapture() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        onCapture?.(file, URL.createObjectURL(blob));
      }
    }, 'image/jpeg');

    stopCamera();
  }

  function handleFlip() {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
  }

  return (
    <div
      className="camera-overlay"
      onClick={() => {
        // Retry camera if blocked (mobile fix)
        if (error) startCamera();
      }}
    >
      <div className="camera-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close */}
        <button className="camera-close" onClick={() => {
          stopCamera();
          onCancel?.();
        }}>
          ✕
        </button>

        {/* Camera View */}
        <div className="camera-view">
          {error ? (
            <div className="camera-error">{error}</div>
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="camera-video"
            />
          )}
        </div>

        {/* Controls */}
       <div className="camera-controls">
  <div className="camera-controls">
  <button className="flip-btn" onClick={handleFlip}>
    🔄
  </button>

  <button className="capture-btn" onClick={handleCapture}>
    <span className="capture-inner"></span>
  </button>
</div>
</div>
      </div>
    </div>
  );
}