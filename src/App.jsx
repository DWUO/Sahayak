
import { useState } from "react";
import { validateLogin } from "./login.js";
import "./App.css";
import Register from "./Register.jsx";

function Icon({ type, size = 22 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  const icons = {
    mail: <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>,
    lock: <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v3" />
    </>,
    eye: <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>,
    eyeOff: <>
      <path d="m3 3 18 18" />
      <path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7s-1.5 3-4 5" />
      <path d="M6.2 6.3C3.5 8.1 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4-.8" />
    </>,
    student: <>
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11v5c3.5 3 8.5 3 12 0v-5" />
      <path d="M22 9v6" />
    </>,
    shield: <>
      <path d="M12 2 20 5v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5l8-3Z" />
    </>,
    responder: <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M3 14h18v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3Z" />
      <path d="M10 5V3h4v2" />
    </>,
    bell: <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
      <path d="M12 2v2" />
    </>,
    pin: <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>,
    people: <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M15 15a5.5 5.5 0 0 1 6.5 5" />
    </>,
    arrow: <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  };

  return <svg {...props}>{icons[type]}</svg>;
}

export default function App() {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  function handleLogin(event) {
    event.preventDefault();

    const error = validateLogin(username, password);

    if (error) {
      setMessage(error);
      return;
    }

    setMessage(
      `${role.charAt(0).toUpperCase() + role.slice(1)} login form validated. Connect a backend to authenticate users.`
    );
  }

  function showComingSoon(page) {
    setMessage(`${page} is not connected yet.`);
  }

  if (showRegister) {
  return (
    <Register
      onBack={() => setShowRegister(false)}
    />
  );
}
  return (
    <main className="login-page">
      {/* LEFT SIDE */}
      <section className="intro-panel">
        <div className="brand">
          <div className="brand-shield">
            <Icon type="shield" size={82} />
            <span className="person-symbol">●</span>
            <span className="cross-symbol">✚</span>
          </div>

          <div>
            <div className="brand-title">
              SAHAYAK 
            </div>
            <div className="brand-subtitle">
              Emergency Response Coordinator
            </div>
          </div>
        </div>

        <div className="intro-copy">
          <h1>
            Safer Campus,
            <br />
            <span>Stronger Community</span>
          </h1>

          <p className="intro-description">
            Report emergencies, get help, and keep
            <br className="desktop-break" />
            our campus safe — together.
          </p>

          <div className="feature-list">
            <div className="feature">
              <div className="feature-icon emergency">
                <Icon type="bell" size={28} />
              </div>
              <div>
                <strong>Quick Emergency Reporting</strong>
                <span>Report incidents with your location</span>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon location">
                <Icon type="pin" size={28} />
              </div>
              <div>
                <strong>Real-time Response</strong>
                <span>Connect with campus responders</span>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon community">
                <Icon type="people" size={28} />
              </div>
              <div>
                <strong>Safer Community</strong>
                <span>Because every life matters</span>
              </div>
            </div>
          </div>
        </div>

        <div className="intro-footer">
          <span className="footer-building">▤</span>
          <span>SAHAYAK • Emergency Response System</span>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="form-panel">
        <div className="slogan">
          Be Aware <i>•</i> Be Prepared <i>•</i> Be Safe
        </div>

        <div className="login-card">
          <header className="card-heading">
            <h2>Welcome Back</h2>
            <p>Sign in to your Campus Shield account</p>
          </header>

          <div className="role-picker">
            <button
              type="button"
              className={role === "student" ? "role-option active" : "role-option"}
              onClick={() => setRole("student")}
            >
              <Icon type="student" size={27} />
              <span>Student</span>
            </button>

            <button
              type="button"
              className={role === "admin" ? "role-option active" : "role-option"}
              onClick={() => setRole("admin")}
            >
              <Icon type="shield" size={27} />
              <span>Admin</span>
            </button>

            <button
              type="button"
              className={role === "responder" ? "role-option active" : "role-option"}
              onClick={() => setRole("responder")}
            >
              <Icon type="responder" size={27} />
              <span>Responder</span>
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <label className="input-wrap">
              <Icon type="mail" size={23} />
              <input
                type="text"
                placeholder="Email or Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setMessage("");
                }}
                autoComplete="username"
                aria-label="Email or Username"
              />
            </label>

            <label className="input-wrap password-wrap">
              <Icon type="lock" size={23} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage("");
                }}
                autoComplete="current-password"
                aria-label="Password"
              />

              <button
                type="button"
                className="visibility-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon type={showPassword ? "eye" : "eyeOff"} size={22} />
              </button>
            </label>

            <div className="form-options">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="text-link"
                onClick={() => showComingSoon("Forgot password")}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-button">
              Login <Icon type="arrow" size={20} />
            </button>
          </form>

          {message && (
            <div className="notice" role="status">
              {message}
            </div>
          )}

          <div className="or-divider">
            <span></span>
            <b>OR</b>
            <span></span>
          </div>

          <button
            type="button"
            className="google-button"
            onClick={() => showComingSoon("Google sign-in")}
          >
            <span className="google-g">G</span>
            <span>Continue with Google</span>
          </button>

          <p className="register-line">
            Don’t have an account?
            <button
              type="button"
              className="text-link"
              onClick={() => setShowRegister(true)}
            >
              Register here
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
