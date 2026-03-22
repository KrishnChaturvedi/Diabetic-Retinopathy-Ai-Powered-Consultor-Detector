import React, { useEffect, useRef, useState } from 'react';
import './CameraCapture.css';

export default function CameraCapture({ onCancel, onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState('');
  const [facingMode, setFacingMode] = useState('environment');

  // close on Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        stopCamera();
        if (onCancel) onCancel();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  async function startCamera() {
    setError('');
    try {
      const constraints = { video: { facingMode }, audio: false };
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch (e) {
      console.error('camera start error', e);
      setError('Unable to access camera. Check permissions and try again.');
    }
  }

  function stopCamera() {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    } catch (e) {
      // ignore
    }
  }

  async function handleCapture() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: blob.type });
        onCapture(file, URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.92);
    stopCamera();
  }

  function handleOverlayClick(e) {
    // close only when clicking the overlay (not the card)
    if (e.target === e.currentTarget) {
      stopCamera();
      if (onCancel) onCancel();
    }
  }

  return (
    <div className="camera-overlay" onMouseDown={handleOverlayClick} onClick={handleOverlayClick}>
      <div className="camera-card" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="camera-close" onClick={() => { stopCamera(); if (onCancel) onCancel(); }} aria-label="Close">✕</button>
        <div className="camera-view">
          {error ? (
            <div className="camera-error">{error}</div>
          ) : (
            <video ref={videoRef} playsInline muted />
          )}
        </div>
        <div className="camera-actions">
          <button type="button" className="btn-ghost" onClick={() => setFacingMode((f) => f === 'user' ? 'environment' : 'user')}>Flip</button>
          <button type="button" className="btn-primary" onClick={handleCapture}>Capture</button>
        </div>
      </div>
    </div>
  );
}
