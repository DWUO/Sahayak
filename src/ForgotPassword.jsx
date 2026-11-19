import { useState } from "react";
import { supabase } from "./supabase_cline";
import "./ForgotPassword.css";

export default function ForgotPassword({ onBack }) {
  const [step, setStep] = useState("request"); // 'request' | 'verify' | 'success'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP / Password Reset Email
  async function handleRequestOtp(event) {
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

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        setMessage(error.message);
      } else {
        setStep("verify");
        setMessage("Verification code sent! Check your inbox.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP code and update password
  async function handleVerifyAndReset(event) {
    event.preventDefault();
    setMessage("");

    if (!otp.trim()) {
      setMessage("Please enter the verification code sent to your email.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 1. Verify OTP with Supabase
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: "recovery",
      });

      if (otpError) {
        setMessage(`Verification failed: ${otpError.message}`);
        setLoading(false);
        return;
      }

      // 2. Set new password for the authenticated recovery session
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setMessage(`Password update failed: ${updateError.message}`);
      } else {
        setStep("success");
        setMessage("Your password has been reset successfully! You can now log in.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setMessage("Something went wrong verifying the code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="forgot-page">
      {/* LEFT SIDE */}
      <section className="forgot-intro">
        <div className="forgot-brand">
          <div className="forgot-brand-icon">🛡️</div>
          <div>
            <h1>SAHAYAK</h1>
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
            Losing access happens. Recover your account securely with your OTP code
            and get back to keeping your campus safe.
          </p>

          <div className="recovery-features">
            <div className="recovery-feature">
              <span className="recovery-icon violet">✉</span>
              <div>
                <strong>Email OTP Verification</strong>
                <p>Receive a secure one-time passcode.</p>
              </div>
            </div>

            <div className="recovery-feature">
              <span className="recovery-icon teal">✓</span>
              <div>
                <strong>Instant Reset</strong>
                <p>Update your password directly in the app.</p>
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

          {/* STEP 1: Request OTP */}
          {step === "request" && (
            <>
              <div className="forgot-heading">
                <h2>Forgot Password?</h2>
                <p>
                  Enter your registered email and we'll send you a verification
                  code to reset your password.
                </p>
              </div>

              <form onSubmit={handleRequestOtp}>
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
                      required
                    />
                  </div>
                </label>

                {message && (
                  <p className="forgot-message" role="status">
                    {message}
                  </p>
                )}

                <button className="reset-button" type="submit" disabled={loading}>
                  {loading ? "Sending Code..." : "Send Verification Code"} <span>→</span>
                </button>
              </form>

              <div className="forgot-help">
                <span>🔒</span>
                Your account security is important to us.
              </div>
            </>
          )}

          {/* STEP 2: Verify OTP & Enter New Password */}
          {step === "verify" && (
            <>
              <div className="forgot-heading">
                <h2>Enter Verification Code</h2>
                <p>
                  We sent a code to <strong>{email}</strong>. Enter it below along with your new password.
                </p>
              </div>

              <form onSubmit={handleVerifyAndReset}>
                <label className="forgot-field">
                  <span>OTP / Verification Code</span>
                  <div className="forgot-input-wrap">
                    <span className="email-symbol">🔑</span>
                    <input
                      type="text"
                      placeholder="Enter 6 or 8-digit OTP"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setMessage("");
                      }}
                      autoComplete="one-time-code"
                      required
                    />
                  </div>
                </label>

                <label className="forgot-field">
                  <span>New Password</span>
                  <div className="forgot-input-wrap">
                    <span className="email-symbol">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setMessage("");
                      }}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </label>

                <label className="forgot-field">
                  <span>Confirm New Password</span>
                  <div className="forgot-input-wrap">
                    <span className="email-symbol">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setMessage("");
                      }}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </label>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer", color: "#6b7280" }}>
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    Show password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("request");
                      setMessage("");
                    }}
                    style={{ background: "none", border: "none", color: "#6366f1", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Resend Code
                  </button>
                </div>

                {message && (
                  <p className="forgot-message" role="status">
                    {message}
                  </p>
                )}

                <button className="reset-button" type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Reset Password & Login"} <span>→</span>
                </button>
              </form>
            </>
          )}

          {/* STEP 3: Success Screen */}
          {step === "success" && (
            <div className="sent-content">
              <div className="sent-check">✓</div>
              <h2>Password Updated!</h2>
              <p>{message}</p>
              <button
                className="reset-button"
                type="button"
                onClick={onBack}
                style={{ marginTop: "20px" }}
              >
                Proceed to Login <span>→</span>
              </button>
            </div>
          )}

          <button
            type="button"
            className="back-login-button"
            onClick={onBack}
            style={{ marginTop: "16px" }}
          >
            <span>←</span> Back to Login
          </button>
        </div>
      </section>
    </main>
  );
}
