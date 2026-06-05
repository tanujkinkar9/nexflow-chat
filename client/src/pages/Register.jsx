import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    else if (form.username.length < 3) e.username = "At least 3 characters";
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      e.username = "Letters, numbers, underscores only";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";

    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords don't match";

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
      const res = await axios.post(`${API}/auth/register`, {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      localStorage.setItem("nexflow_token", res.data.token);
      localStorage.setItem("nexflow_user", JSON.stringify(res.data.user));
      navigate("/app");
    } catch (err) {
      setServerError(
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][strength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"][strength];

  return (
    <div style={s.root}>
      {/* Left panel */}
      <div style={s.left}>
        <Link to="/" style={s.logo}>
          <span style={s.logoDot} />
          NexFlow
        </Link>

        <div style={s.leftContent}>
          <div style={s.leftQuote}>
            "The cleanest team tool we've used. Channels, tasks, all in one place."
          </div>
          <div style={s.leftAuthor}>
            <div style={s.leftAvatar}>A</div>
            <div>
              <div style={s.leftName}>Arjun M.</div>
              <div style={s.leftRole}>Founding Engineer</div>
            </div>
          </div>
        </div>

        <div style={s.leftFeatures}>
          {[
            "Real-time messaging with Socket.io",
            "Persistent message history in MongoDB",
            "Kanban task board per channel",
            "Live presence & typing indicators",
          ].map((f) => (
            <div key={f} style={s.leftFeature}>
              <span style={s.leftCheck}>✓</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={s.right}>
        <div style={s.formWrap}>
          {/* Mobile logo */}
          <Link to="/" style={{ ...s.logo, ...s.mobileLogo }}>
            <span style={s.logoDot} />
            NexFlow
          </Link>

          <h1 style={s.heading}>Create your account</h1>
          <p style={s.subheading}>
            Already have one?{" "}
            <Link to="/login" style={s.link}>
              Sign in →
            </Link>
          </p>

          {serverError && (
            <div style={s.serverError}>
              <span style={s.errorIcon}>!</span>
              {serverError}
            </div>
          )}

          <form onSubmit={onSubmit} noValidate style={s.form}>
            {/* Username */}
            <div style={s.field}>
              <label style={s.label} htmlFor="username">
                Username
              </label>
              <div style={s.inputWrap}>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. tanuj_dev"
                  value={form.username}
                  onChange={onChange("username")}
                  style={{
                    ...s.input,
                    ...(errors.username ? s.inputError : {}),
                  }}
                />
              </div>
              {errors.username && (
                <span style={s.fieldError}>{errors.username}</span>
              )}
            </div>

            {/* Email */}
            <div style={s.field}>
              <label style={s.label} htmlFor="email">
                Email
              </label>
              <div style={s.inputWrap}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange("email")}
                  style={{
                    ...s.input,
                    ...(errors.email ? s.inputError : {}),
                  }}
                />
              </div>
              {errors.email && (
                <span style={s.fieldError}>{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div style={s.field}>
              <label style={s.label} htmlFor="password">
                Password
              </label>
              <div style={s.inputWrap}>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
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
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div style={s.strengthRow}>
                  <div style={s.strengthBars}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          ...s.strengthBar,
                          background: i <= strength ? strengthColor : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ ...s.strengthLabel, color: strengthColor }}>
                    {strengthLabel}
                  </span>
                </div>
              )}
              {errors.password && (
                <span style={s.fieldError}>{errors.password}</span>
              )}
            </div>

            {/* Confirm password */}
            <div style={s.field}>
              <label style={s.label} htmlFor="confirm">
                Confirm password
              </label>
              <div style={s.inputWrap}>
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={onChange("confirm")}
                  style={{
                    ...s.input,
                    paddingRight: 44,
                    ...(errors.confirm ? s.inputError : {}),
                    ...(form.confirm && form.confirm === form.password
                      ? s.inputSuccess
                      : {}),
                  }}
                />
                <button
                  type="button"
                  style={s.eyeBtn}
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? "🙈" : "👁"}
                </button>
                {form.confirm && form.confirm === form.password && (
                  <span style={s.checkmark}>✓</span>
                )}
              </div>
              {errors.confirm && (
                <span style={s.fieldError}>{errors.confirm}</span>
              )}
            </div>

            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? (
                <span style={s.spinner} />
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p style={s.terms}>
            By signing up you agree to our{" "}
            <a href="#" style={s.link}>
              Terms
            </a>{" "}
            and{" "}
            <a href="#" style={s.link}>
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    background: "#fff",
    color: "#111",
  },

  // LEFT PANEL
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
    marginBottom: 40,
  },
  leftQuote: {
    fontSize: 20,
    lineHeight: 1.5,
    color: "#f9fafb",
    fontStyle: "italic",
    fontWeight: 400,
    marginBottom: 24,
    letterSpacing: "-0.01em",
  },
  leftAuthor: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  leftAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600,
    color: "#e5e7eb",
    flexShrink: 0,
  },
  leftName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#f9fafb",
  },
  leftRole: {
    fontSize: 12,
    color: "#9ca3af",
  },
  leftFeatures: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingTop: 32,
    borderTop: "1px solid #1f2937",
    marginBottom: 40,
  },
  leftFeature: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    color: "#9ca3af",
  },
  leftCheck: {
    color: "#22c55e",
    fontWeight: 700,
    fontSize: 13,
    flexShrink: 0,
  },

  // RIGHT PANEL
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  formWrap: {
    width: "100%",
    maxWidth: 400,
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

  // SERVER ERROR
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

  // FORM
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
  inputSuccess: {
    borderColor: "#86efac",
    background: "#f0fdf4",
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
  checkmark: {
    position: "absolute",
    right: 36,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#16a34a",
    fontSize: 14,
    fontWeight: 700,
  },

  // STRENGTH
  strengthRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  strengthBars: {
    display: "flex",
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    transition: "background 0.2s",
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: 500,
    minWidth: 64,
    textAlign: "right",
  },

  // SUBMIT
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

  // TERMS
  terms: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 1.6,
  },
};
