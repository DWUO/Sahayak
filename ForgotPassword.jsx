
import { useState } from "react";
import "./ForgotPassword.css";

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    // Demo only: no real email is sent until a backend is connected.
    setSubmitted(true);
    setMessage(
      "Your email is ready for processing. Connect a backend to send a real reset link."
    );
  }

  return (
    <main className="forgot-page">
      {/* LEFT SIDE */}
      <section className="forgot-intro">
        <div className="forgot-brand">
          <div className="forgot-brand-icon">🛡️</div>
          <div>
            <h1>
              SAHAYAK
            </h1>
            <p>Emergency Response Coordinator</p>
          </div>
        </div>

        <div className="forgot-left-content">
          <span className="forgot-tag">ACCOUNT RECOVERY</span>

          <h2>
            Don't Worry,
            <br />
            <span>We've Got You.</span>
          </h2>

          <p className="forgot-description">
            Losing access happens. Recover your account
            securely and get back to keeping your campus safe.
          </p>

          <div className="recovery-features">
            <div className="recovery-feature">
              <span className="recovery-icon violet">✉</span>
              <div>
                <strong>Email Recovery</strong>
                <p>Use your registered email address.</p>
              </div>
            </div>

            <div className="recovery-feature">
              <span className="recovery-icon teal">✓</span>
              <div>
                <strong>Secure Process</strong>
                <p>Reset your password safely.</p>
              </div>
            </div>

            <div className="recovery-feature">
              <span className="recovery-icon pink">♡</span>
              <div>
                <strong>Your Safety Matters</strong>
                <p>We're here to help your campus community.</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="forgot-footer">
          Sahayak • Emergency Response System
        </footer>
      </section>

      {/* RIGHT SIDE */}
      <section className="forgot-form-panel">
        <div className="forgot-slogan">
          Be Aware <i>•</i> Be Prepared <i>•</i> Be Safe
        </div>

        <div className="forgot-card">
          <div className="recovery-illustration">
            <div className="recovery-circle">
              <span className="recovery-lock">🔐</span>
            </div>
            <span className="recovery-spark spark-one">✦</span>
            <span className="recovery-spark spark-two">✧</span>
          </div>

          {!submitted ? (
            <>
              <div className="forgot-heading">
                <h2>Forgot Password?</h2>
                <p>
                  Enter your registered email and we'll help
                  you get back into your account.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <label className="forgot-field">
                  <span>Email Address</span>
                  <div className="forgot-input-wrap">
                    <span className="email-symbol">✉</span>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setMessage("");
                      }}
                      autoComplete="email"
                      aria-label="Email address"
                    />
                  </div>
                </label>

                {message && (
                  <p className="forgot-message" role="status">
                    {message}
                  </p>
                )}

                <button className="reset-button" type="submit">
                  Send Reset Link <span>→</span>
                </button>
              </form>

              <div className="forgot-help">
                <span>🔒</span>
                Your account security is important to us.
              </div>
            </>
          ) : (
            <div className="sent-content">
              <div className="sent-check">✓</div>
              <h2>Request Prepared!</h2>
              <p>{message}</p>
              <p className="sent-email">
                Email entered: <strong>{email}</strong>
              </p>
              <button
                className="reset-button"
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage("");
                }}
              >
                Try Another Email
              </button>
            </div>
          )}

          <button
            type="button"
            className="back-login-button"
            onClick={onBack}
          >
            <span>←</span> Back to Login
          </button>
        </div>
      </section>
    </main>
  );
}
