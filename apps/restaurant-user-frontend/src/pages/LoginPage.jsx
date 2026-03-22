import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

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
      setError(err?.response?.data?.message || "Unable to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-[#d05322] selection:text-white">
      
      {/* LEFT PANEL - Premium Visual Showcase */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#111827] overflow-hidden">
        {/* NEW: A gorgeous, moody, fine-dining plated dish image */}
        <img 
          src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop" 
          alt="Gourmet Plated Dish" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[20s] hover:scale-105"
        />
        
        {/* Dual directional gradients to ensure perfect text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/95 via-[#111827]/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent"></div>
        
        {/* Brand & Copy */}
        <div className="absolute top-12 left-12 z-10">
          <h1 className="text-2xl font-black italic tracking-tighter text-white drop-shadow-md z-10">
            Digital Maitre D'
          </h1>
        </div>
        
        <div className="absolute bottom-16 left-12 right-12 text-white z-10">
          <h2 className="text-[40px] font-extrabold tracking-tight mb-4 leading-tight drop-shadow-lg">
            Elevating the <br/><span className="text-[#d05322]">Culinary Experience.</span>
          </h2>
          <p className="text-[16px] text-gray-300 font-medium max-w-md leading-relaxed drop-shadow-md">
            Curated dining, orchestrated flawlessly. Sign in to manage your premium reservations, orders, and curated menus.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Minimalist Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12 relative">
        
        {/* Mobile Brand Header */}
        <div className="absolute top-8 left-8 lg:hidden">
          <h1 className="text-xl font-black italic tracking-tighter text-[#1f2937]">
            Digital Maitre D'
          </h1>
        </div>

        <div className="w-full max-w-[420px]">
          
          <div className="mb-10">
            <h2 className="text-[32px] font-extrabold text-[#1f2937] tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-[15px] text-gray-500 font-medium">
              Please enter your details to sign in.
            </p>
          </div>

          {/* Premium Segmented Role Switcher */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl mb-10 shadow-inner">
            <button
              type="button"
              onClick={() => setRoleTab("CUSTOMER")}
              className={`flex-1 py-2.5 text-[13px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                roleTab === "CUSTOMER"
                  ? "bg-white text-[#d05322] shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Guest
            </button>
            <button
              type="button"
              onClick={() => setRoleTab("OWNER")}
              className={`flex-1 py-2.5 text-[13px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                roleTab === "OWNER"
                  ? "bg-white text-[#1f2937] shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Restaurateur
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-700 text-[13px] font-semibold p-4 rounded-xl border border-red-100 flex items-start gap-3 animate-in fade-in">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-[#1f2937] text-[15px] font-medium placeholder:text-gray-400 focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] transition-all outline-none shadow-sm"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1 mr-1">
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase">
                  Password
                </label>
                <Link to="/forgot" className="text-[11px] font-bold text-[#d05322] hover:text-[#b84318] tracking-wide transition-colors">
                  FORGOT PASSWORD?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-[#1f2937] text-[15px] font-medium placeholder:text-gray-400 focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] transition-all outline-none shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d05322] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2.5}/> : <Eye size={18} strokeWidth={2.5}/>}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-1 mt-6">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="staySignedIn"
                  className="peer w-5 h-5 cursor-pointer appearance-none rounded-md border border-gray-300 checked:border-[#d05322] checked:bg-[#d05322] transition-all"
                />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <label htmlFor="staySignedIn" className="text-[14px] font-medium text-gray-600 cursor-pointer select-none">
                Keep me signed in
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl text-[14px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 mt-8
                ${roleTab === 'OWNER' 
                  ? 'bg-[#1f2937] hover:bg-black text-white shadow-lg shadow-gray-900/20' 
                  : 'bg-[#d05322] hover:bg-[#b84318] text-white shadow-lg shadow-[#d05322]/20'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : (
                 <>SIGN IN <ArrowRight size={18} strokeWidth={2.5}/></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-10">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Or Continue With</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-3 text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-3 text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.42-1.09-.48-2.09-.5-3.24 0-1.44.63-2.2.45-3.06-.42-6.33-6.79-3.3-10.99 2.4-11.04 1.27.04 2.17.68 2.91.68.73 0 1.88-.69 3.15-.59 1.29.1 2.26.63 2.86 1.56-2.65 1.56-2.23 4.99.45 5.96-.58 1.52-1.31 3.02-2.39 4.43zM12.03 7.25c-.26-2.7 2.22-4.99 4.78-5.25.29 2.56-2.34 5.02-4.78 5.25z" fill="currentColor"/>
              </svg>
              Apple
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[14px] text-gray-500 font-medium">
              New to Digital Maitre D'?{" "}
              <Link to="/register" className="font-bold text-[#d05322] hover:text-[#b84318] transition-colors underline decoration-2 underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}