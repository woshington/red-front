import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login({ email, password });
      // The context will navigate to '/' on success
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glowBlob1} />
      <div style={styles.glowBlob2} />
      
      <div className="card" style={styles.card}>
        <div style={styles.header}>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Welcome Back</h1>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@school.com"
              style={{ ...styles.input, backgroundColor: "rgba(34, 38, 58, 0.5)" }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...styles.input, backgroundColor: "rgba(34, 38, 58, 0.5)" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={styles.button}
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Don't have an admin account? <Link to="/register" style={styles.link}>Register</Link></p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "var(--color-bg)",
  },
  glowBlob1: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
    opacity: 0.15,
    filter: "blur(60px)",
    borderRadius: "50%",
    animation: "float 10s ease-in-out infinite",
  },
  glowBlob2: {
    position: "absolute",
    bottom: "-10%",
    right: "-10%",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, #34d399 0%, transparent 70%)",
    opacity: 0.1,
    filter: "blur(60px)",
    borderRadius: "50%",
    animation: "float 12s ease-in-out infinite reverse",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
    padding: "var(--space-8)",
    background: "rgba(26, 29, 39, 0.6)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(108, 99, 255, 0.2)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    zIndex: 10,
    borderRadius: "var(--radius-xl)",
  },
  header: {
    textAlign: "center",
    marginBottom: "var(--space-6)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-4)",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },
  label: {
    fontSize: "var(--text-sm)",
    fontWeight: "var(--weight-medium)",
    color: "var(--color-text-muted)",
  },
  input: {
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  button: {
    marginTop: "var(--space-2)",
    justifyContent: "center",
    padding: "var(--space-3) var(--space-4)",
    fontSize: "var(--text-base)",
    boxShadow: "0 4px 14px 0 rgba(108, 99, 255, 0.39)",
  },
  errorBanner: {
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    color: "var(--color-error)",
    padding: "var(--space-3)",
    borderRadius: "var(--radius-md)",
    marginBottom: "var(--space-4)",
    fontSize: "var(--text-sm)",
    border: "1px solid rgba(248, 113, 113, 0.3)",
    textAlign: "center",
  },
  footer: {
    marginTop: "var(--space-6)",
    textAlign: "center",
    fontSize: "var(--text-sm)",
  },
  link: {
    fontWeight: "var(--weight-semibold)",
  }
};
