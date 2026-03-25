import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";


const CustomerRegister = () => {
  const navigate = useNavigate();
  const { saveUserSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", form);
      saveUserSession(data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Registration Successful",
        confirmButtonColor: "#B76E79",
      });
      navigate("/products");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Registration Failed",
        confirmButtonColor: "#B76E79",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {loading && <Loader fullScreen text="Creating your account..." />}
      <div style={styles.splitLayout}>
        {/* Left Side - Image/Brand */}
        <div style={styles.brandSection}>
          <div style={styles.overlay}></div>
          <h1 style={styles.brandTitle}>Join Prima</h1>
          <p style={styles.brandSubtitle}>Unlock Exclusive Benefits</p>
        </div>

        {/* Right Side - Form */}
        <div style={styles.formSection}>
          <div style={styles.formWrapper}>
            {loading && <Loader fullScreen text="Creating your account..." />}
            <div style={styles.header}>
              <h2>Create Account</h2>
              <p>Enter your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={styles.inputWrapper}>
                  <User size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: "45px" }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} style={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
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
                    placeholder="Create a strong password"
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
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>

            <div style={styles.footer}>
              <p>
                Already have an account?{" "}
                <span
                  style={styles.link}
                  onClick={() => navigate("/customer/login")}
                >
                  Login here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    backgroundColor: "var(--bg-body)",
    overflow: "hidden"
  },
  splitLayout: {
    display: "flex",
    height: "100%"
  },
  brandSection: {
    flex: "1",
    backgroundColor: "var(--primary)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(183, 110, 121, 0.8)", // Primary color with opacity
    zIndex: 1
  },
  brandTitle: {
    fontSize: "4rem",
    fontFamily: "var(--font-heading)",
    zIndex: 2,
    margin: 0
  },
  brandSubtitle: {
    fontSize: "1.2rem",
    letterSpacing: "3px",
    textTransform: "uppercase",
    zIndex: 2,
    opacity: 0.9
  },
  formSection: {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "var(--bg-surface)"
  },
  formWrapper: {
    width: "100%",
    maxWidth: "450px",
    padding: "40px"
  },
  header: {
    marginBottom: "40px",
    textAlign: "center"
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
  },
  footer: {
    marginTop: "30px",
    textAlign: "center",
    color: "var(--text-muted)",
    fontSize: "0.9rem"
  },
  link: {
    color: "var(--primary)",
    fontWeight: "600",
    cursor: "pointer",
    marginLeft: "5px"
  }
};

export default CustomerRegister;
