import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({
  text = "Loading...",
  fullScreen = false,
  size = 40,
  color = "var(--primary)",
  skeletonCount = 0,
}) => {
  const skeleton = skeletonCount ? (
    <div className="skeleton-grid">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-image shimmer"></div>
          <div className="skeleton-line shimmer"></div>
          <div className="skeleton-line small shimmer"></div>
        </div>
      ))}
    </div>
  ) : null;

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className="loader-content">
          <Loader2 className="spinner" size={size} color={color} />
          {text ? <p className="loader-text">{text}</p> : null}
          {skeleton}
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="loader-inline">
      <Loader2 className="spinner" size={size} color={color} />
      {text ? <span className="loader-text">{text}</span> : null}
      {skeleton}
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = `
  .loader-fullscreen { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 9999; }
  .loader-content, .loader-inline { display: flex; flex-direction: column; align-items: center; gap: 15px; }
  .loader-inline { justify-content: center; padding: 20px; }
  .spinner { animation: spin 1s linear infinite; }
  .loader-text { font-family: var(--font-body); color: var(--text-muted); font-size: 0.95rem; font-weight: 500; }
  .skeleton-grid { width: 100%; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
  .skeleton-card { width: 100%; background: white; padding: 14px; border-radius: 18px; box-shadow: var(--shadow-sm); }
  .skeleton-image { height: 180px; border-radius: 14px; margin-bottom: 12px; }
  .skeleton-line { height: 16px; border-radius: 999px; margin-bottom: 10px; }
  .skeleton-line.small { width: 60%; }
  .shimmer { background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%); background-size: 200% 100%; animation: shimmer 1.6s infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;

export default Loader;
