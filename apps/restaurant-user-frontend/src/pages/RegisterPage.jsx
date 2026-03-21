import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, User, Mail, Star, Gauge } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER", // By default signing up as a customer based on mockup flow
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 xl:px-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Luxury dining setup"
            className="w-full h-full object-cover"
          />
          {/* Orange gradient overlay exactly like mockup */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#d05322]/90 to-[#b84318]/95 mix-blend-multiply"></div>
          {/* A slight solid orange tint to ensure vibrancy */}
          <div className="absolute inset-0 bg-[#d05322]/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-xl">
          <h1 className="text-5xl lg:text-6xl font-bold italic text-white leading-tight mb-8 drop-shadow-md">
            Digital Maître D'
          </h1>
          
          <p className="text-xl text-white/95 font-medium leading-relaxed mb-12 drop-shadow">
            Experience dining curated by professionals.<br/>
            Join the exclusive circle of culinary<br/>
            enthusiasts.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transition hover:bg-white/20">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                 <Star className="text-[#d05322] w-4 h-4" fill="currentColor" />
              </div>
              <p className="text-white font-semibold shadow-sm">Premium Curation</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transition hover:bg-white/20">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <Gauge className="text-[#d05322] w-4 h-4" strokeWidth={3} />
              </div>
              <p className="text-white font-semibold shadow-sm">Priority Access</p>
            </div>
          </div>
        </div>

        {/* Footer info absolute bottom */}
        <div className="absolute bottom-8 left-16 xl:left-24 z-10">
          <p className="text-white/60 text-xs tracking-wider uppercase">
            © 2024 Digital Maître D' Technologies
          </p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-20 overflow-y-auto">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h2 className="text-3xl font-bold italic text-[#d05322]">Digital Maître D'</h2>
          </div>

          <div className="absolute top-12 right-12 hidden lg:block opacity-20 pointer-events-none">
             {/* Cutlery decoration faintly visible in mockup */}
             <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
               <path d="M11 2v9c0 1.1-.9 2-2 2v9H7v-9c-1.1 0-2-.9-2-2V2h2v5h1V2h2v5h1V2h2zm10 0h-2c-1.1 0-2 .9-2 2v7h2v11h2V2z"/>
             </svg>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[32px] font-bold text-[#1f2937] leading-tight mb-2">
              Create an account
            </h2>
            <p className="text-[15px] text-[#6b7280]">
              Please enter your details to get started.
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex bg-[#f3f4f6] p-1 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, role: "CUSTOMER" }))}
              className={`flex-1 py-3 text-[14px] font-semibold rounded-lg transition-colors ${
                form.role === "CUSTOMER"
                  ? "bg-white text-[#d05322] shadow-sm"
                  : "text-[#6b7280] hover:text-[#4b5563]"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, role: "OWNER" }))}
              className={`flex-1 py-3 text-[14px] font-semibold rounded-lg transition-colors ${
                form.role === "OWNER"
                  ? "bg-white text-[#d05322] shadow-sm"
                  : "text-[#6b7280] hover:text-[#4b5563]"
              }`}
            >
              Restaurant Owner
            </button>
          </div>

          {/* Social Sign Up side-by-side */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] py-3 text-[14px] font-semibold text-[#1f2937] transition hover:bg-gray-50">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] py-3 text-[14px] font-semibold text-[#1f2937] transition hover:bg-gray-50">
               <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.42-1.09-.48-2.09-.5-3.24 0-1.44.63-2.2.45-3.06-.42-6.33-6.79-3.3-10.99 2.4-11.04 1.27.04 2.17.68 2.91.68.73 0 1.88-.69 3.15-.59 1.29.1 2.26.63 2.86 1.56-2.65 1.56-2.23 4.99.45 5.96-.58 1.52-1.31 3.02-2.39 4.43zM12.03 7.25c-.26-2.7 2.22-4.99 4.78-5.25.29 2.56-2.34 5.02-4.78 5.25z" fill="currentColor"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e7eb]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-[11px] font-bold tracking-widest text-[#9ca3af] uppercase">
                OR REGISTER WITH EMAIL
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-[#6b7280] tracking-wider uppercase mb-2">
                FULL NAME
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#9ca3af]">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Maître D'John Doe"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#f3f4f6] border-none rounded-xl pl-11 pr-4 py-3.5 text-[#1f2937] text-[15px] placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#d05322]/20 focus:bg-white outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6b7280] tracking-wider uppercase mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#9ca3af]">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="john@maitred.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-[#f3f4f6] border-none rounded-xl pl-11 pr-4 py-3.5 text-[#1f2937] text-[15px] placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#d05322]/20 focus:bg-white outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#6b7280] tracking-wider uppercase mb-2">
                  PHONE
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-[#f3f4f6] border-none rounded-xl px-4 py-3.5 text-[#1f2937] text-[15px] placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#d05322]/20 focus:bg-white outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6b7280] tracking-wider uppercase mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-[#f3f4f6] border-none rounded-xl px-4 py-3.5 text-[#1f2937] text-[15px] placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#d05322]/20 focus:bg-white outline-none transition-all"
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
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mt-2">
                {error}
              </div>
            )}

            <div className="flex items-start gap-3 mt-6">
              <input
                type="checkbox"
                id="agreed"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#e5e7eb] text-[#d05322] focus:ring-[#d05322]"
                required
              />
              <label htmlFor="agreed" className="text-[13px] text-[#6b7280] leading-snug">
                I agree to the{" "}
                <span className="font-bold text-[#d05322]">Terms of Service</span> and{" "}
                <span className="font-bold text-[#d05322]">Privacy Policy</span>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d05322] hover:bg-[#b84318] text-white font-semibold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(208,83,34,0.39)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[14px] text-[#1f2937] font-semibold">
            Already have an account?{" "}
            <Link to="/login" className="text-[#d05322] hover:text-[#b84318]">
              Log in here
            </Link>
          </p>

          <div className="mt-12 flex items-center justify-between text-[11px] font-bold tracking-wider text-[#9ca3af] uppercase">
            <span className="cursor-pointer hover:text-[#6b7280]">Support</span>
            <span className="cursor-pointer hover:text-[#6b7280]">English (US)</span>
          </div>
        </div>
      </div>
    </div>
  );
}