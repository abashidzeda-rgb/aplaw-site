'use client'

import { loginAction } from '@/app/actions/auth'

export default function LoginForm({ error }: { error: boolean }) {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <img src="/logo-ink.svg" alt="Abashidze & Partners" className="login-logo" />
        <h1>Admin Panel</h1>
        <p>Enter your password to access the site editor.</p>
        <form action={loginAction}>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoFocus
              autoComplete="current-password"
            />
          </div>
          {error && <p className="login-error">Incorrect password. Try again.</p>}
          <button type="submit" className="btn-submit">Sign in →</button>
        </form>
      </div>
      <style>{`
        .login-wrap {
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0ece8;
        }
        .login-card {
          background: #fff;
          border-radius: 12px;
          padding: 48px;
          width: 380px;
          box-shadow: 0 4px 24px rgba(0,0,0,.08);
        }
        .login-logo {
          display: block;
          height: 48px;
          width: auto;
          margin-bottom: 28px;
        }
        .login-card h1 {
          font-size: 24px;
          font-weight: 600;
          color: #271918;
          margin: 0 0 8px;
        }
        .login-card p {
          font-size: 14px;
          color: #6b5a54;
          margin: 0 0 28px;
        }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
        .field label { font-size: 12px; font-weight: 600; color: #271918; letter-spacing: .04em; }
        .field input {
          padding: 10px 14px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 15px;
          outline: none;
          transition: border-color .2s;
        }
        .field input:focus { border-color: #9b7a5e; }
        .login-error { color: #c0392b; font-size: 13px; margin: -8px 0 16px; }
        .btn-submit {
          width: 100%;
          padding: 11px;
          background: #271918;
          color: #f4efeb;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background .2s;
        }
        .btn-submit:hover { background: #3a2b28; }
      `}</style>
    </div>
  )
}
