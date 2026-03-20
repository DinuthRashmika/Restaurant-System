import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

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
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await registerUser(form);

      if (!response.success) {
        setError(response.message || "Registration failed");
        return;
      }

      login(response.data);

      if (response.data.role === "OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.data?.email ||
          "Unable to register"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Hero Section with Restaurant Image */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Luxury restaurant interior with elegant dining setup"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-orange-500/90 mix-blend-multiply"></div>
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-12 flex flex-col min-h-screen">
          {/* Top Section */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-white/80 text-sm font-medium tracking-wider">EST. 2024</span>
            </div>

            <h1 className="text-5xl font-bold italic text-white leading-tight">
              SALVIN RESTAURENT
            </h1>
            
            <p className="mt-6 text-lg leading-relaxed text-white/90 max-w-md">
              Experience dining curated by world-class professionals. Join an exclusive circle of culinary enthusiasts.
            </p>

            {/* Stats Section */}
            <div className="mt-8 flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-sm text-white/70">Partner Venues</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div>
                <p className="text-2xl font-bold text-white">50k+</p>
                <p className="text-sm text-white/70">Happy Members</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div>
                <p className="text-2xl font-bold text-white">4.9</p>
                <p className="text-sm text-white/70">User Rating</p>
              </div>
            </div>
          </div>

          {/* Middle Section - Features */}
          <div className="mt-auto mb-auto pt-16">
            <p className="text-white/80 text-sm font-semibold tracking-wider mb-4">EXCLUSIVE BENEFITS</p>
            <div className="space-y-4 max-w-sm">
              <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/20 transform transition hover:scale-105 hover:bg-white/15">
                <div className="h-12 w-12 rounded-full bg-orange-400/30 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Premium Curation</p>
                  <p className="text-sm text-white/70">Hand-picked dining experiences by expert sommeliers & chefs</p>
                </div>
              </div>
              
            </div>
          </div>


          {/* Footer */}
          <div className="relative z-10 text-white/60 text-sm mt-auto pt-12">
            <p>© 2026 Digital Maitre D'. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-gray-500">
              Please enter your details to get started.
            </p>
          </div>

          {/* Social Sign Up */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>
            
            <button className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M17.05 20.28c-.98.95-2.05.88-3.08.42-1.09-.48-2.09-.5-3.24 0-1.44.63-2.2.45-3.06-.42-6.33-6.79-3.3-10.99 2.4-11.04 1.27.04 2.17.68 2.91.68.73 0 1.88-.69 3.15-.59 1.29.1 2.26.63 2.86 1.56-2.65 1.56-2.23 4.99.45 5.96-.58 1.52-1.31 3.02-2.39 4.43zM12.03 7.25c-.26-2.7 2.22-4.99 4.78-5.25.29 2.56-2.34 5.02-4.78 5.25z"
                />
              </svg>
              Sign up with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">OR REGISTER WITH EMAIL</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                FULL NAME
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@digitalmaitred.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                PHONE NUMBER
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            {/* Password Strength Indicator */}
            <div className="text-xs text-gray-500">
              Password must be at least 8 characters with 1 uppercase, 1 number & 1 special character
            </div>

            {/* Features Preview - Mobile Only */}
            <div className="lg:hidden grid grid-cols-2 gap-3 border-t border-b border-gray-200 py-4 my-4">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">Premium Curation</p>
                <p className="text-xs text-gray-500">Expertly selected venues</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">Priority Access</p>
                <p className="text-xs text-gray-500">Skip waitlists</p>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <label className="flex items-start gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                required
              />
              <span>
                I agree to the <span className="font-semibold text-orange-600">Terms of Service</span> and{" "}
                <span className="font-semibold text-orange-600">Privacy Policy</span>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-600 py-3.5 font-semibold text-white shadow-lg transition hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-xl active:transform active:scale-[0.98]"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700">
              Log in here
            </Link>
          </p>

          {/* Footer Links */}
          <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
            <button className="hover:text-gray-600 transition flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Support
            </button>
            <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600 transition">
              <span>English (US)</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}