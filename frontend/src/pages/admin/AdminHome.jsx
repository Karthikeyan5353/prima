import React from "react";
import { Settings, Save } from "lucide-react";

const AdminHome = () => {
  return (
    <div className="admin-settings animate-fade-in">
      <h2 className="page-title mb-lg">Store Settings</h2>

      <div className="settings-container">
        <div className="card mb-lg">
          <h3 className="mb-md">General Information</h3>
          <form>
            <div className="form-group mb-md">
              <label className="form-label">Store Name</label>
              <input type="text" className="form-input" defaultValue="Prima Boutique" />
            </div>
            <div className="form-group mb-md">
              <label className="form-label">Support Email</label>
              <input type="email" className="form-input" defaultValue="support@primaboutique.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select className="form-input">
                <option>INR (₹)</option>
                <option>USD ($)</option>
              </select>
            </div>
          </form>
        </div>

        <div className="card">
          <h3 className="mb-md">Appearance</h3>
          <div className="flex-start gap-md">
            <div className="theme-toggle">
              <label className="form-label mb-sm block">Theme Color</label>
              <div className="color-preview" style={{ background: "var(--primary)", width: "40px", height: "40px", borderRadius: "50%" }}></div>
            </div>
          </div>
        </div>

        <button className="btn btn-primary mt-lg flex-center gap-sm">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <style jsx>{`
        .admin-settings {
            max-width: 800px;
        }
        .card {
            background: white;
            padding: 25px;
            border-radius: var(--radius-card);
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border);
        }
        .block { display: block; }
      `}</style>
    </div>
  );
};

export default AdminHome;
