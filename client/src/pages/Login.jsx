import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const onChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: "" }));
    setServerError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      localStorage.setItem("nexflow_token", res.data.token);
      localStorage.setItem("nexflow_user", JSON.stringify(res.data.user));
      navigate("/app");
    } catch (err) {
      setServerError(
        err?.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.root}>
      {/* Left panel */}
      <div style={s.left}>
        <Link to="/" style={s.logo}>
          <span style={s.logoDot} />
          NexFlow
        </Link>
        <div style={s.leftContent}>
          <div style={s.leftHeadline}>
            Your team's work,
            <br />
            in one place.
          </div>
          <div style={s.leftSub}>
            Channels, tasks, and real-time presence — all connected.
          </div>
        </div>
        <div style={s.leftStats}>
          {[
            { v: "< 50ms", l: "Message latency" },
            { v: "Socket.io", l: "Real-time engine" },
            { v: "MongoDB", l: "Persistent storage" },
          ].map(({ v, l }) => (
            <div key={l} style={s.leftStat}>
              <div style={s.leftStatVal}>{v}</div>
              <div style={s.leftStatLabel}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={s.right}>
        <div style={s.formWrap}>
          <Link to="/" style={{ ...s.logo, ...s.mobileLogo }}>
            <span style={{ ...s.logoDot, background: "#111" }} />
            NexFlow
          </Link>

          <h1 style={s.heading}>Welcome back</h1>
          <p style={s.subheading}>
            Don't have an account?{" "}
            <Link to="/register" style={s.link}>
              Sign up →
            </Link>
          </p>

          {serverError && (
            <div style={s.serverError}>
              <span style={s.errorIcon}>!</span>
              {serverError}
            </div>
          )}

          <form onSubmit={onSubmit} noValidate style={s.form}>
            <div style={s.field}>
              <label style={s.label} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={onChange("email")}
                style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
              />
              {errors.email && <span style={s.fieldError}>{errors.email}</span>}
            </div>

            <div style={s.field}>
              <div style={s.labelRow}>
                <label style={s.label} htmlFor="password">Password</label>
                <a href="#" style={s.forgotLink}>Forgot password?</a>
              </div>
              <div style={s.inputWrap}>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={onChange("password")}
                  style={{
                    ...s.input,
                    paddingRight: 44,
                    ...(errors.password ? s.inputError : {}),
                  }}
                />
                <button
                  type="button"
                  style={s.eyeBtn}
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide" : "Show"}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <span style={s.fieldError}>{errors.password}</span>}
            </div>

            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? <span style={s.spinner} /> : "Sign in"}
            </button>
          </form>

          <p style={s.terms}>
            Protected by JWT authentication & bcrypt encryption.
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    background: "#fff",
    color: "#111",
  },
  left: {
    width: 420,
    flexShrink: 0,
    background: "#0a0a0a",
    padding: "40px 48px",
    display: "flex",
    flexDirection: "column",
    color: "#fff",
  },
  logo: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 700,
    fontSize: 17,
    letterSpacing: "-0.02em",
    color: "#fff",
    textDecoration: "none",
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#fff",
    flexShrink: 0,
  },
  leftContent: {
    marginTop: "auto",
    marginBottom: 48,
  },
  leftHeadline: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.03em",
    color: "#f9fafb",
    marginBottom: 16,
  },
  leftSub: {
    fontSize: 15,
    color: "#9ca3af",
    lineHeight: 1.6,
  },
  leftStats: {
    display: "flex",
    gap: 0,
    borderTop: "1px solid #1f2937",
    marginBottom: 40,
    paddingTop: 28,
  },
  leftStat: {
    flex: 1,
    paddingRight: 16,
  },
  leftStatVal: {
    fontSize: 15,
    fontWeight: 700,
    color: "#f9fafb",
    letterSpacing: "-0.02em",
    marginBottom: 2,
  },
  leftStatLabel: {
    fontSize: 11,
    color: "#6b7280",
    letterSpacing: "0.02em",
  },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  formWrap: {
    width: "100%",
    maxWidth: 380,
  },
  mobileLogo: {
    display: "none",
    color: "#111",
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "-0.025em",
    color: "#0a0a0a",
    margin: "0 0 8px",
  },
  subheading: {
    fontSize: 14,
    color: "#6b7280",
    margin: "0 0 28px",
  },
  link: {
    color: "#111",
    fontWeight: 500,
    textDecoration: "none",
    borderBottom: "1px solid #d1d5db",
    paddingBottom: 1,
  },
  forgotLink: {
    fontSize: 12,
    color: "#9ca3af",
    textDecoration: "none",
  },
  serverError: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    color: "#b91c1c",
    marginBottom: 20,
  },
  errorIcon: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#fee2e2",
    border: "1px solid #fca5a5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "#dc2626",
    flexShrink: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
  },
  inputWrap: {
    position: "relative",
  },
  input: {
    width: "100%",
    height: 42,
    padding: "0 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 14,
    color: "#111",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#f87171",
    background: "#fff9f9",
  },
  fieldError: {
    fontSize: 12,
    color: "#dc2626",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    lineHeight: 1,
    padding: 2,
    color: "#9ca3af",
  },
  submitBtn: {
    width: "100%",
    height: 44,
    background: "#0a0a0a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    fontFamily: "inherit",
    letterSpacing: "-0.01em",
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  terms: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 20,
  },
};
