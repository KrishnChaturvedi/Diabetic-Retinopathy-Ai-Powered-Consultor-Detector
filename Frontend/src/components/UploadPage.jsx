import React, { useRef } from 'react';
import SymptomQuiz from './SymptomQuiz';
import CameraCapture from './CameraCapture';
import './UploadPage.css';

export default function UploadPage({ onAnalyze, onAskChat }) {
  const fileRef = useRef();
  const [file, setFile]     = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [patient, setPatient] = React.useState({ name: '', age: '', dia: '' });
  const [showCamera, setShowCamera] = React.useState(false);

  function handleFile(f) {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }

  function handleAnalyze() {
    if (!file) return;
    onAnalyze(file, preview, patient);
  }

  return (
    <div className="card">
      <div className="card-body">
        <p className="upload-title">Upload or Capture Retinal Image</p>
        <p className="upload-sub">Use a fundus camera image, smartphone attachment, or capture live</p>

        {/* Upload Buttons */}
        <div className="upload-grid">
          <div
            className="upload-btn"
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <span className="upload-ico">➕</span>
            <span className="upload-btn-label">Upload Image</span>
            <span className="upload-btn-sub">JPG, PNG — drag and drop</span>
          </div>

          <div
            className="upload-btn"
            onClick={() => setShowCamera(true)}
          >
            <span className="upload-ico">📷</span>
            <span className="upload-btn-label">Use Camera</span>
            <span className="upload-btn-sub">Capture live image</span>
          </div>
        </div>

        {/* Preview Thumbnail */}
        {preview && (
          <div className="thumb-row">
            <img src={preview} alt="thumb" />
            <div>
              <div className="thumb-name">✓ Image Ready</div>
              <div className="thumb-sub">{file?.name}</div>
            </div>
            <button
              className="thumb-remove"
              onClick={() => { setFile(null); setPreview(null); }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Patient Info */}
        <div className="form-row">
          <div className="form-group">
            <label>Patient Name</label>
            <input
              placeholder="Rajesh Kumar"
              value={patient.name}
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              placeholder="47"
              value={patient.age}
              onChange={(e) => setPatient({ ...patient, age: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Diabetes Duration</label>
            <select
              value={patient.dia}
              onChange={(e) => setPatient({ ...patient, dia: e.target.value })}
            >
              <option value="">Select</option>
              <option>Less than 1 year</option>
              <option>1–5 years</option>
              <option>5–10 years</option>
              <option>10+ years</option>
            </select>
          </div>
        </div>

        <button
          className="btn-analyze"
          onClick={handleAnalyze}
          disabled={!file}
        >
          {file ? '🔬 Analyze Retinal Image' : 'Upload an image to continue'}
        </button>
      </div>

      {/* Symptom Quiz */}
      <SymptomQuiz onAskChat={onAskChat} />
      {showCamera && (
        <CameraCapture
          onCancel={() => setShowCamera(false)}
          onCapture={(fileObj, previewUrl) => {
            setFile(fileObj);
            setPreview(previewUrl);
            setShowCamera(false);
          }}
        />
      )}
    </div>
  );
}
