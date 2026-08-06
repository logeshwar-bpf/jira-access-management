"use client";

import React, { useState } from "react";
import { Shield, KeyRound, Mail, ArrowRight, Lock, Sparkles, AlertCircle } from "lucide-react";
import GlitterSymbol from "./GlitterSymbol";

export default function SignInPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onLoginSuccess(data.user);
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setError("Login request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="center-screen">
      {/* Main Split Layout Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-left">
        
        {/* LEFT SIDE: Sign In Form & Details */}
        <div className="signin-card w-full shadow-lg">
          
          {/* Brand & Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="brand-logo">◆</div>
            <div>
              <div className="brand-name text-lg">Jira Access</div>
              <div className="brand-sub">Bipolar Factory</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="pill primary mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>Single Admin Authentication</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight">
              Sign In to Provisioning
            </h1>
            <p className="text-xs text-[var(--text-2)] mt-1">
              Authorized administrator portal for project provisioning and user access control.
            </p>
          </div>

          {/* Single User Lock Notice */}
          <div className="mb-6 p-3.5 rounded-xl bg-[var(--primary-soft)] border border-[var(--border)] flex items-start gap-3">
            <Lock className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-[var(--text)]">Single-User Master Access</p>
              <p className="text-[var(--text-2)] mt-0.5">
                Only <strong className="text-[var(--primary)]">admin@jira.internal</strong> has master authorization to sign in.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-[var(--risk-soft)] border border-[var(--risk)] flex items-center gap-2.5 text-xs text-[var(--risk)]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="field">
              <span>Administrator Email</span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-3)]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jira.internal"
                  required
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="field">
              <div className="flex items-center justify-between mb-1">
                <span>Security Passcode</span>
                <span className="text-[11px] text-[var(--text-3)]">Master Secret Key</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-3)]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3 justify-center text-sm font-bold mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Launch Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE: Jira Provisioning Symbol Artwork */}
        <div className="w-full h-full flex items-center justify-center p-4">
          <GlitterSymbol />
        </div>

      </div>
    </div>
  );
}
