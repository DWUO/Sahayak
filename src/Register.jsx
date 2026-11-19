import { useState } from "react";
import { supabase } from "./supabase_cline";
import "./Register.css";

export default function Register({ onBack }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");

    // 1. Validate required fields
    if (
      !fullName.trim() ||
      !email.trim() ||
      !studentId.trim() ||
      !password ||
      !confirmPassword
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    // 2. Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    // 3. Validate password
    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    // 4. Confirm password
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // 5. Terms and conditions
    if (!accepted) {
      setMessage("Please accept the Terms and Conditions.");
      return;
    }

    // 6. Create account using Supabase
    setLoading(true);
    setMessage("Creating your account...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,

        options: {
          data: {
            full_name: fullName.trim(),
            student_id: studentId.trim(),
          },
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.user) {
        setMessage(
          data.session
            ? "Account created successfully! You can now log in."
            : "Account created! Please verify your email before logging in."
        );

        // Clear form after successful registration
        setFullName("");
        setEmail("");
        setStudentId("");
        setPassword("");
        setConfirmPassword("");
        setAccepted(false);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">

      {/* LEFT SIDE */}
      <section className="register-intro">
        <div className="register-brand">
          <div className="register-logo">🛡️</div>

          <div>
            <h1>SAHAYAK</h1>
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

          <form onSubmit={handleRegister}>

            {/* FULL NAME */}
            <label className="register-field">
              <span>Full Name *</span>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </label>

            {/* EMAIL */}
            <label className="register-field">
              <span>Email Address *</span>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            {/* STUDENT ID */}
            <label className="register-field">
              <span>Student ID *</span>

              <input
                type="text"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </label>

            {/* PASSWORD */}
            <label className="register-field">
              <span>Password *</span>

              <div className="register-password">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {/* CONFIRM PASSWORD */}
            <label className="register-field">
              <span>Confirm Password *</span>

              <div className="register-password">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {/* TERMS */}
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

            {/* SUBMIT */}
            <button
              className="create-account-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <span>→</span>}
            </button>

          </form>

          {/* MESSAGE */}
          {message && (
            <p className="register-message" role="status">
              {message}
            </p>
          )}

          {/* BACK TO LOGIN */}
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