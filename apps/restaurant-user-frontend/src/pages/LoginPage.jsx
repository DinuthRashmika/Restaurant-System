import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [roleTab, setRoleTab] = useState("CUSTOMER");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(form);

      if (!response.success) {
        setError(response.message || "Login failed");
        return;
      }

      const user = response.data;

      if (user.role !== roleTab) {
        setError(
          `This account is registered as ${user.role}. Please select the correct role tab.`
        );
        return;
      }

      login(user);

      if (user.role === "OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#6b675d] flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="bg-[#f5f6f8] w-full max-w-[440px] rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Header content */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold italic text-[#d05322] tracking-tight mb-6">
            Digital Maitre D
          </h1>
          <h2 className="text-[32px] font-bold text-[#1f2937] leading-tight mb-2">
            Welcome back
          </h2>
          <p className="text-[15px] text-[#6b7280]">
            Please enter your details to sign in
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-[#e5e7eb] p-1 rounded-xl mb-8">
          <button
            type="button"
            onClick={() => setRoleTab("CUSTOMER")}
            className={`flex-1 py-2.5 text-[14px] font-semibold rounded-lg transition-colors ${
              roleTab === "CUSTOMER"
                ? "bg-white text-[#d05322] shadow-sm"
                : "text-[#6b7280] hover:text-[#4b5563]"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRoleTab("OWNER")}
            className={`flex-1 py-2.5 text-[14px] font-semibold rounded-lg transition-colors ${
              roleTab === "OWNER"
                ? "bg-white text-[#d05322] shadow-sm"
                : "text-[#6b7280] hover:text-[#4b5563]"
            }`}
          >
            Restaurant Owner
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-[#6b7280] tracking-wider uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full bg-[#e5e7eb]/50 border-none rounded-xl px-4 py-3.5 text-[#1f2937] text-[15px] placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#d05322]/20 focus:bg-white transition-all outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] font-bold text-[#6b7280] tracking-wider uppercase">
                Password
              </label>
              <Link to="/forgot" className="text-[12px] font-bold text-[#d05322] hover:text-[#b84318]">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#e5e7eb]/50 border-none rounded-xl px-4 py-3.5 text-[#1f2937] text-[15px] placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#d05322]/20 focus:bg-white transition-all outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={2.5}/> : <Eye size={18} strokeWidth={2.5}/>}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Stay Signed In */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="staySignedIn"
              className="w-4 h-4 rounded border-[#e5e7eb] text-[#d05322] focus:ring-[#d05322]"
            />
            <label htmlFor="staySignedIn" className="text-[14px] text-[#6b7280]">
              Stay signed in for 30 days
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d05322] hover:bg-[#b84318] text-white font-semibold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(208,83,34,0.39)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e7eb]"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#f5f6f8] px-4 text-[10px] font-bold text-[#9ca3af] tracking-widest uppercase">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Defaults */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 border border-[#e5e7eb] rounded-xl py-2.5 text-[14px] font-semibold text-[#374151] hover:bg-white transition-colors">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 border border-[#e5e7eb] rounded-xl py-2.5 text-[14px] font-semibold text-[#374151] hover:bg-white transition-colors">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.42-1.09-.48-2.09-.5-3.24 0-1.44.63-2.2.45-3.06-.42-6.33-6.79-3.3-10.99 2.4-11.04 1.27.04 2.17.68 2.91.68.73 0 1.88-.69 3.15-.59 1.29.1 2.26.63 2.86 1.56-2.65 1.56-2.23 4.99.45 5.96-.58 1.52-1.31 3.02-2.39 4.43zM12.03 7.25c-.26-2.7 2.22-4.99 4.78-5.25.29 2.56-2.34 5.02-4.78 5.25z" fill="currentColor"/>
            </svg>
            Apple
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-[14px] text-[#6b7280]">
            New to Digital Maitre D?{" "}
            <Link to="/register" className="font-bold text-[#d05322] hover:text-[#b84318]">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}