import React, { useEffect } from "react";
import { getImageUrl } from "../../utils/media";

const MODEL_VIEWER_SRC =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";

const ModelViewer3D = ({ src, alt }) => {
  useEffect(() => {
    const existing = document.querySelector(`script[src="${MODEL_VIEWER_SRC}"]`);
    if (existing) {
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = MODEL_VIEWER_SRC;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="viewer-shell">
      <model-viewer
        src={getImageUrl(src)}
        alt={alt}
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      />

      <style jsx>{`
        .viewer-shell {
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(180deg, #fbf7f5, #f1ebe8);
        }
      `}</style>
    </div>
  );
};

export default ModelViewer3D;
