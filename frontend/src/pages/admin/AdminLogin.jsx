import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { saveAdminSession } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/admin-login",
        formData
      );
      saveAdminSession(response.data);
      navigate("/admin/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Invalid Admin Credentials",
        confirmButtonColor: "#B76E79",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <ShieldCheck size={32} color="var(--primary)" />
          </div>
          <h2 style={{ marginBottom: "5px" }}>Admin Portal</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Secure verification required</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                placeholder="admin@primaboutique.com"
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: "45px" }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: "45px" }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "var(--bg-body)",
    backgroundImage: "radial-gradient(#e6e6e6 1px, transparent 1px)",
    backgroundSize: "20px 20px"
  },
  card: {
    backgroundColor: "var(--bg-surface)",
    padding: "40px",
    borderRadius: "var(--radius-card)",
    boxShadow: "var(--shadow-lg)",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid var(--border)"
  },
  header: {
    textAlign: "center",
    marginBottom: "30px"
  },
  iconWrapper: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "rgba(183, 110, 121, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px auto"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  inputIcon: {
    position: "absolute",
    left: "15px",
    color: "var(--text-muted)"
  }
};

export default AdminLogin;
