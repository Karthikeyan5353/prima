import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, User } from "lucide-react";

const Flash = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div className="animate-fade-in">
          <h1 style={styles.title}>Prima Boutique</h1>
          <p style={styles.subtitle}>Experience Luxury & Elegance</p>
        </div>

        <div style={styles.card} className="animate-fade-in">
          <p style={styles.instruction}>Please select your portal</p>

          <div style={styles.buttonGroup}>
            <button
              onClick={() => navigate("/customer/login")}
              style={styles.buttonPrimary}
              className="btn-primary"
            >
              <User size={20} />
              <span>Customer Login</span>
            </button>

            <button
              onClick={() => navigate("/admin/login")}
              style={styles.buttonOutline}
              className="btn-outline"
            >
              <ShieldCheck size={20} />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      <div style={styles.background}></div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--bg-body)",
    position: "relative",
    overflow: "hidden"
  },
  content: {
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--spacing-xl)",
    width: "100%",
    maxWidth: "400px",
    padding: "20px"
  },
  title: {
    fontFamily: "var(--font-heading)",
    fontSize: "3.5rem",
    color: "var(--primary)",
    textAlign: "center",
    marginBottom: "0.5rem",
    letterSpacing: "-1px"
  },
  subtitle: {
    textAlign: "center",
    color: "var(--text-muted)",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontSize: "0.9rem",
    fontWeight: "500"
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    padding: "40px 30px",
    borderRadius: "var(--radius-card)",
    boxShadow: "var(--shadow-premium)",
    border: "1px solid rgba(255, 255, 255, 0.5)"
  },
  instruction: {
    textAlign: "center",
    marginBottom: "30px",
    color: "var(--dark)",
    fontWeight: "500"
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  buttonPrimary: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "14px",
    borderRadius: "var(--radius-btn)",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem"
  },
  buttonOutline: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "14px",
    borderRadius: "var(--radius-btn)",
    border: "1px solid var(--dark)",
    cursor: "pointer",
    fontSize: "1rem",
    background: "transparent"
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "radial-gradient(circle at 50% 50%, #f7ebe8 0%, #f8f5f2 100%)",
    zIndex: 1
  }
};

export default Flash;
