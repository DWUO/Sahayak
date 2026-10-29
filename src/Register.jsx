
import { useState } from "react";
import "./Register.css";

export default function Register({ onBack }) {
  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");

  function handleRegister(e) {
    e.preventDefault();
    setMessage("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (role === "student" && !studentId.trim()) {
      setMessage("Please enter your Student ID.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!accepted) {
      setMessage("Please accept the Terms and Conditions.");
      return;
    }

    setMessage(
      "Form validated successfully! Connect your backend to create the account."
    );
  }

  return (
    <main className="register-page">
      {/* LEFT SIDE */}
      <section className="register-intro">
        <div className="register-brand">
          <div className="register-logo">🛡️</div>
          <div>
            <h1>
              SAHAYAK
            </h1>
            <p>Emergency Response Coordinator</p>
          </div>
        </div>

        <div className="register-welcome">
          <span className="welcome-tag">JOIN OUR COMMUNITY</span>
          <h2>
            Your Safety,
            <br />
            <span>Our Priority.</span>
          </h2>
          <p>
            Create your Sahayak account and help
            make your campus a safer place for everyone.
          </p>

          <div className="register-benefits">
            <div className="benefit">
              <span className="benefit-icon red">✚</span>
              <div>
                <strong>Report Emergencies</strong>
                <p>Get help when you need it most.</p>
              </div>
            </div>

            <div className="benefit">
              <span className="benefit-icon blue">⌖</span>
              <div>
                <strong>Stay Connected</strong>
                <p>Connect with campus responders.</p>
              </div>
            </div>

            <div className="benefit">
              <span className="benefit-icon green">✓</span>
              <div>
                <strong>Protect Your Community</strong>
                <p>Every member makes a difference.</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="register-footer">
          Sahayak • Emergency Response System
        </footer>
      </section>

      {/* RIGHT SIDE */}
      <section className="register-form-panel">
        <div className="register-slogan">
          Be Aware <i>•</i> Be Prepared <i>•</i> Be Safe
        </div>

        <div className="register-card">
          <div className="register-heading">
            <h2>Create Account</h2>
            <p>Join Sahayak to keep your campus safe</p>
          </div>

          <div className="register-roles">
            {["student", "admin", "responder"].map((item) => (
              <button
                type="button"
                key={item}
                className={role === item ? "register-role selected" : "register-role"}
                onClick={() => {
                  setRole(item);
                  setMessage("");
                }}
              >
                <span className="role-symbol">
                  {item === "student" ? "🎓" : item === "admin" ? "🛡️" : "🚨"}
                </span>
                <span>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister}>
            <label className="register-field">
              <span>Full Name *</span>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </label>

            <label className="register-field">
              <span>Email Address *</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            {role === "student" && (
              <label className="register-field">
                <span>Student ID *</span>
                <input
                  type="text"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </label>
            )}

            <label className="register-field">
              <span>Password *</span>
              <div className="register-password">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label className="register-field">
              <span>Confirm Password *</span>
              <div className="register-password">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label className="terms-label">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span>
                I agree to the <strong>Terms and Conditions</strong> and
                <strong> Privacy Policy</strong>.
              </span>
            </label>

            <button className="create-account-button" type="submit">
              Create Account <span>→</span>
            </button>
          </form>

          {message && (
            <p className="register-message" role="status">
              {message}
            </p>
          )}

          <p className="back-to-login">
            Already have an account?
            <button type="button" onClick={onBack}>
              Login here
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
