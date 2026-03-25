import React, { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, Search, X } from "lucide-react";

const VisualSearchModal = ({ open, onClose, onSearch }) => {
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!open) {
      setPreviewUrl("");
      setSelectedFile(null);
      setCameraMode(false);
      setCameraError("");
      setAnalyzing(false);
    }
  }, [open]);

  useEffect(() => {
    if (!cameraMode || !open) {
      return undefined;
    }

    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setCameraError("Camera access is unavailable on this device.");
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [cameraMode, open]);

  if (!open) {
    return null;
  }

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setCameraMode(false);
    setCameraError("");
  };

  const captureFromCamera = async () => {
    if (!videoRef.current) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) {
      return;
    }

    const file = new File([blob], `visual-search-${Date.now()}.jpg`, { type: "image/jpeg" });
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setCameraMode(false);
  };

  const runSearch = async () => {
    if (!selectedFile) {
      return;
    }

    setAnalyzing(true);
    try {
      await onSearch(selectedFile);
      onClose();
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="visual-search-backdrop" onClick={onClose}>
      <div className="visual-search-modal" onClick={(event) => event.stopPropagation()}>
        <div className="visual-search-head">
          <div>
            <h3>Visual Search</h3>
            <p>Upload a style image or use your live camera to find similar products.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="visual-search-actions">
          <button type="button" className="visual-option" onClick={() => inputRef.current?.click()}>
            <ImagePlus size={18} />
            <span>Upload an image</span>
          </button>
          <button type="button" className="visual-option" onClick={() => setCameraMode(true)}>
            <Camera size={18} />
            <span>Live camera search</span>
          </button>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFileSelect} />
        </div>

        {cameraMode ? (
          <div className="camera-panel">
            <video ref={videoRef} autoPlay playsInline muted />
            {cameraError ? <p className="text-muted">{cameraError}</p> : null}
            <button type="button" className="btn btn-outline" onClick={captureFromCamera}>
              Capture Search Image
            </button>
          </div>
        ) : null}

        {previewUrl ? (
          <div className="preview-panel">
            <img src={previewUrl} alt="Visual search preview" />
          </div>
        ) : null}

        <div className="visual-search-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={runSearch} disabled={!selectedFile || analyzing}>
            <Search size={17} />
            {analyzing ? "Analyzing..." : "Find Similar"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .visual-search-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.42); display: flex; align-items: center; justify-content: center; z-index: 1200; padding: 20px; }
        .visual-search-modal { width: min(620px, 100%); background: #fff; border-radius: 24px; box-shadow: var(--shadow-lg); padding: 24px; display: grid; gap: 18px; }
        .visual-search-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .visual-search-head h3 { margin: 0 0 6px; }
        .visual-search-head p { margin: 0; color: var(--text-muted); }
        .visual-search-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .visual-option { border: 1px solid rgba(183,110,121,0.2); background: rgba(183,110,121,0.04); border-radius: 18px; min-height: 56px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; color: var(--primary); }
        .camera-panel, .preview-panel { background: rgba(183,110,121,0.04); border-radius: 18px; padding: 16px; display: grid; gap: 12px; }
        .camera-panel video, .preview-panel img { width: 100%; border-radius: 16px; background: #f6f2f3; max-height: 320px; object-fit: cover; }
        .visual-search-footer { display: flex; justify-content: flex-end; gap: 12px; }
        .icon-btn { border: none; background: transparent; }
        @media (max-width: 640px) {
          .visual-search-actions { grid-template-columns: 1fr; }
          .visual-search-footer { flex-direction: column-reverse; }
          .visual-search-footer button { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default VisualSearchModal;
