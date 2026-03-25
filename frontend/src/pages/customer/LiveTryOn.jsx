import React, { useRef, useEffect, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { X, Loader, Camera, Share2 } from "lucide-react";
import Swal from "sweetalert2";
import { getImageUrl } from "../../utils/media";

const LiveTryOn = ({ onClose, product }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const faceMeshRef = useRef(null);
  const [loading, setLoading] = useState(true);

  let smoothLeft = { x: 0, y: 0, z: 0 };
  let smoothRight = { x: 0, y: 0, z: 0 };
  let smoothNeck = { x: 0, y: 0 };

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (!isMounted) return;
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setLoading(false);
        startFaceMesh();
      } catch (err) {
        setLoading(false);
        Swal.fire({ icon: "error", title: "Camera Access Denied", text: "Please allow camera access." });
        onClose();
      }
    };

    const startFaceMesh = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const jewelleryImage = new Image();
      jewelleryImage.src = product?.arImage ? getImageUrl(product.arImage) : product?.arType === "chain" ? "/chain.png" : "/earring.png";

      const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
      faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 });
      faceMeshRef.current = faceMesh;

      faceMesh.onResults((results) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.strokeRect(40, 30, canvas.width - 80, canvas.height - 60);

        if (!results.multiFaceLandmarks?.length) return;

        const landmarks = results.multiFaceLandmarks[0];
        const width = canvas.width;
        const height = canvas.height;
        const ratio = jewelleryImage.width / jewelleryImage.height;

        if (product?.arType !== "chain") {
          const left1 = landmarks[177];
          const left2 = landmarks[234];
          const right1 = landmarks[401];
          const right2 = landmarks[454];

          const leftCurrent = { x: ((left1.x + left2.x) / 2) * width, y: ((left1.y + left2.y) / 2) * height, z: (left1.z + left2.z) / 2 };
          const rightCurrent = { x: ((right1.x + right2.x) / 2) * width, y: ((right1.y + right2.y) / 2) * height, z: (right1.z + right2.z) / 2 };
          const FAST_SMOOTH = 0.7;
          const smoothFast = (prev, current) => ({
            x: prev.x * FAST_SMOOTH + current.x * (1 - FAST_SMOOTH),
            y: prev.y * FAST_SMOOTH + current.y * (1 - FAST_SMOOTH),
            z: prev.z * FAST_SMOOTH + current.z * (1 - FAST_SMOOTH),
          });

          smoothLeft = smoothFast(smoothLeft, leftCurrent);
          smoothRight = smoothFast(smoothRight, rightCurrent);

          const faceHeight = Math.abs(landmarks[10].y - landmarks[152].y) * height;
          const baseScale = faceHeight * 0.055;

          const drawEarring = (pt) => {
            const depthScale = 1 - pt.z * 1.2;
            const finalWidth = baseScale * depthScale;
            const finalHeight = finalWidth / ratio;
            ctx.drawImage(jewelleryImage, pt.x - finalWidth / 2, pt.y + finalHeight * 0.15, finalWidth, finalHeight);
          };

          drawEarring(smoothLeft);
          drawEarring(smoothRight);
        } else {
          const chin = landmarks[152];
          const leftJaw = landmarks[234];
          const rightJaw = landmarks[454];
          const jawWidth = Math.abs(leftJaw.x - rightJaw.x) * width;
          const neckCurrent = { x: chin.x * width, y: chin.y * height + 18 };
          const SMOOTH = 0.85;
          smoothNeck = { x: smoothNeck.x * SMOOTH + neckCurrent.x * (1 - SMOOTH), y: smoothNeck.y * SMOOTH + neckCurrent.y * (1 - SMOOTH) };
          const chainWidth = jawWidth * 0.85;
          const chainHeight = chainWidth / ratio;
          const angle = Math.atan2(rightJaw.y - leftJaw.y, rightJaw.x - leftJaw.x);

          ctx.save();
          ctx.translate(smoothNeck.x, smoothNeck.y);
          ctx.rotate(angle);
          ctx.drawImage(jewelleryImage, -chainWidth / 2, -chainHeight / 6, chainWidth, chainHeight);
          ctx.restore();
        }
      });

      const detect = async () => {
        if (!videoRef.current || videoRef.current.paused) return;
        await faceMesh.send({ image: videoRef.current });
        animationRef.current = requestAnimationFrame(detect);
      };

      setTimeout(detect, 400);
    };

    startCamera();

    return () => {
      isMounted = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (faceMeshRef.current) faceMeshRef.current.close();
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, [onClose, product]);

  const captureScreenshot = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    context.drawImage(canvasRef.current, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${product.name}-try-on.png`;
    link.click();
  };

  const shareShot = async () => {
    if (!navigator.share) {
      Swal.fire({ icon: "info", title: "Share unavailable", text: "This browser does not support sharing." });
      return;
    }
    await navigator.share({ title: "Prima Boutique Try-On", text: `Trying ${product.name} virtually.` });
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}><X size={24} /></button>
        <h2 style={{ marginBottom: 12 }}>Live Bridal Try-On</h2>
        <p style={{ marginTop: 0, color: "#64748b" }}>Align your face inside the guide box for stable jewellery placement.</p>

        <div style={cameraContainer}>
          {loading ? (
            <div style={loaderStyle}><Loader size={40} /><p>Initializing Camera...</p></div>
          ) : null}
          <div style={overlayLabel}>Face guide overlay active</div>
          <video ref={videoRef} width="640" height="480" style={videoStyle} playsInline />
          <canvas ref={canvasRef} width="640" height="480" style={canvasStyle} />
        </div>

        <div style={toolbarStyle}>
          <button className="btn btn-outline" onClick={captureScreenshot}><Camera size={18} /> Capture</button>
          <button className="btn btn-primary" onClick={shareShot}><Share2 size={18} /> Share</button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalStyle = { background: "#fff", padding: "25px", borderRadius: "16px", position: "relative", maxWidth: "720px", width: "calc(100% - 24px)" };
const closeBtn = { position: "absolute", top: 15, right: 15, background: "none", border: "none", cursor: "pointer" };
const cameraContainer = { position: "relative", width: "100%", maxWidth: "640px", aspectRatio: "4 / 3", borderRadius: "16px", overflow: "hidden", background: "#111827" };
const videoStyle = { position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" };
const canvasStyle = { position: "absolute", width: "100%", height: "100%", pointerEvents: "none", transform: "scaleX(-1)" };
const loaderStyle = { position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#f5f5f5" };
const toolbarStyle = { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" };
const overlayLabel = { position: "absolute", left: "16px", top: "16px", zIndex: 3, background: "rgba(0,0,0,0.45)", color: "#fff", padding: "8px 12px", borderRadius: "999px", fontSize: "0.85rem" };

export default LiveTryOn;
