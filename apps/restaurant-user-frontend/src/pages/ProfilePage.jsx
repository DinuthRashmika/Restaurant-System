import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { 
  Bell, 
  LogOut, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Camera,
  Loader2
} from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { auth, logout } = useAuth(); 
  
  const fileInputRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [imagePreview, setImagePreview] = useState(null);

  // Aggressive Data Extraction
  const deeplyFindField = (obj, possibleKeys) => {
    if (!obj || typeof obj !== 'object') return "";
    for (let key of possibleKeys) {
      if (obj[key] && typeof obj[key] !== 'object') return String(obj[key]);
    }
    for (let key in obj) {
      const found = deeplyFindField(obj[key], possibleKeys);
      if (found) return found;
    }
    return "";
  };

  const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
  const currentUser = auth?.user || auth || storedAuth?.user || storedAuth || {};
  
  const userId = deeplyFindField(auth, ['id', '_id', 'userId']) || deeplyFindField(storedAuth, ['id', '_id', 'userId']) || "Unassigned";
  const userRoleRaw = deeplyFindField(auth, ['role', 'userRole']) || deeplyFindField(storedAuth, ['role', 'userRole']) || "CUSTOMER";
  
  // Look for caches
  const cachedPhone = localStorage.getItem(`frontend_phone_cache_${userId}`);
  const cachedImage = localStorage.getItem(`frontend_image_cache_${userId}`);
  
  // REMOVED HARDCODED IMAGE: Using cached image or user's provided image. Fallback is an empty string for CSS handling.
  const initialProfileImage = cachedImage || currentUser.profileImage || currentUser.avatarUrl || "";

  const [formData, setFormData] = useState({
    fullName: deeplyFindField(auth, ['fullName', 'name']) || deeplyFindField(storedAuth, ['fullName', 'name']) || "",
    email: deeplyFindField(auth, ['email']) || deeplyFindField(storedAuth, ['email']) || "",
    phone: deeplyFindField(auth, ['phone', 'phoneNumber']) || deeplyFindField(storedAuth, ['phone', 'phoneNumber']) || cachedPhone || "",
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditPictureClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { 
        setErrorMsg("Image too large. Please use a photo under 1MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrorMsg("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    
    try {
      const finalImage = imagePreview || initialProfileImage;

      // 1. Prepare updated user object
      const updatedUser = {
        ...currentUser,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        profileImage: finalImage // Save the base64 string
      };

      // 2. Update LocalStorage immediately so refresh works
      const updatedAuth = { ...storedAuth, user: updatedUser };
      localStorage.setItem("auth", JSON.stringify(updatedAuth));
      
      if (userId !== "Unassigned") {
        localStorage.setItem(`frontend_phone_cache_${userId}`, formData.phone);
        if (imagePreview) {
          localStorage.setItem(`frontend_image_cache_${userId}`, imagePreview);
        }
      }

      setTimeout(() => {
        setIsSaving(false);
        setIsEditing(false);
        setImagePreview(null); 
        setSuccessMsg("Profile updated successfully.");
        setTimeout(() => setSuccessMsg(""), 4000);
      }, 1000);
      
    } catch (error) {
      setErrorMsg("Failed to save changes.");
      setIsSaving(false);
    }
  };

  const userRole = String(userRoleRaw).toUpperCase();
  const dashboardLink = userRole.includes("OWNER") ? "/owner/dashboard" : "/customer/dashboard";
  const menuLink = userRole.includes("OWNER") ? "/owner/menu" : "/menu";
  const historyLink = userRole.includes("OWNER") ? "/owner/orders" : "/order-history";
  
  const displayImage = imagePreview || initialProfileImage;

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans selection:bg-[#d05322] selection:text-white pb-20">
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-4 border-b border-white/20' : 'bg-gradient-to-b from-black/70 to-transparent py-8'}`}>
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link to={dashboardLink}>
              <h1 className={`text-2xl font-black italic tracking-tighter transition-colors duration-500 ${scrolled ? 'text-[#1f2937]' : 'text-white drop-shadow-md'}`}>
                Digital Maitre D'
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <button className={`transition-all duration-500 hover:scale-110 ${scrolled ? 'text-[#1f2937]' : 'text-white'}`}>
              <Bell size={22} />
            </button>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d05322] to-[#b84318] rounded-full blur opacity-100"></div>
              {/* Header Image Fallback to User Icon if no image */}
              <div className="relative h-10 w-10 rounded-full bg-gray-200 bg-cover bg-center border-2 border-white overflow-hidden flex items-center justify-center">
                {initialProfileImage ? (
                  <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${initialProfileImage}')`}} />
                ) : (
                  <User size={20} className="text-gray-400" />
                )}
              </div>
            </div>
            <button onClick={handleLogout} className={`flex items-center justify-center h-10 w-10 rounded-full ${scrolled ? 'text-gray-400 hover:text-[#d05322]' : 'text-white/80 hover:text-white'}`}>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="relative w-full h-[45vh] min-h-[360px] flex flex-col items-center justify-center overflow-hidden bg-[#111827]">
        <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop" alt="Wine Cellar" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/80 via-[#111827]/40 to-[#fafaf9]"></div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-[800px] px-6 relative z-20 -mt-50">
        
        {successMsg && (
           <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 size={18} /></div>
               <span className="font-bold text-[14px]">{successMsg}</span>
             </div>
             <button onClick={() => setSuccessMsg("")} className="text-green-500"><X size={18} /></button>
           </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-[#f3f4f6] overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white px-10 pt-10 pb-8 border-b border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-8 relative">
            <div className="relative group cursor-pointer" onClick={handleEditPictureClick}>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d05322] to-[#b84318] rounded-full blur opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Profile Image Main Container */}
              <div className="relative h-32 w-32 rounded-full bg-gray-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                {displayImage ? (
                  <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${displayImage}')`}} />
                ) : (
                  <User size={48} className="text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                  <Camera size={24} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-center">Change Photo</span>
                </div>
              </div>
              <div className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-[#1f2937] text-white flex items-center justify-center border-2 border-white shadow-md hover:bg-[#d05322] transition-colors"><Camera size={16} /></div>
            </div>

            <div className="flex-1 text-center sm:text-left pt-2">
              <h2 className="text-3xl font-extrabold text-[#1f2937] tracking-tight">{formData.fullName || "Guest User"}</h2>
              <p className="text-[#6b7280] font-medium mt-1">{formData.email}</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-orange-50/80 border border-[#d05322]/20 px-4 py-1.5 rounded-full">
                <Shield size={14} className="text-[#d05322]" />
                <span className="text-[10px] font-black text-[#d05322] tracking-[0.2em] uppercase">{userRole} Account</span>
              </div>
            </div>

            {!isEditing && !imagePreview && (
              <button onClick={() => setIsEditing(true)} className="absolute top-8 right-8 flex items-center gap-2 text-[11px] font-black tracking-widest uppercase text-[#9ca3af] hover:text-[#d05322] transition-colors bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md"><Edit3 size={14} /> Edit</button>
            )}
          </div>

          <div className="p-10">
            <h3 className="text-[18px] font-extrabold text-[#1f2937] tracking-tight mb-8">Personal Information</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border-b border-gray-100 pb-6">
                <label className="md:w-48 text-[11px] font-black tracking-[0.15em] text-gray-400 uppercase flex items-center gap-2"><User size={16} /> Full Name</label>
                {isEditing ? <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-bold text-[#1f2937] outline-none" /> : <div className="flex-1 text-[15px] font-bold text-[#1f2937]">{formData.fullName || "Not provided"}</div>}
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border-b border-gray-100 pb-6">
                <label className="md:w-48 text-[11px] font-black tracking-[0.15em] text-gray-400 uppercase flex items-center gap-2"><Mail size={16} /> Email</label>
                {isEditing ? <input type="email" name="email" value={formData.email} onChange={handleChange} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-bold text-[#1f2937] outline-none" /> : <div className="flex-1 text-[15px] font-bold text-[#1f2937]">{formData.email || "Not provided"}</div>}
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border-b border-gray-100 pb-6">
                <label className="md:w-48 text-[11px] font-black tracking-[0.15em] text-gray-400 uppercase flex items-center gap-2"><Phone size={16} /> Phone</label>
                {isEditing ? <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-bold text-[#1f2937] outline-none" /> : <div className="flex-1 text-[15px] font-bold text-[#1f2937]">{formData.phone || "Not provided"}</div>}
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 pt-2">
                <label className="md:w-48 text-[11px] font-black tracking-[0.15em] text-gray-400 uppercase flex items-center gap-2"><Shield size={16} /> Account ID</label>
                <div className="flex-1 text-[13px] font-mono text-gray-500 bg-gray-50 px-4 py-2 rounded-lg w-max">{userId}</div>
              </div>

              {(isEditing || imagePreview) && (
                <div className="flex gap-4 pt-8 mt-8 border-t border-gray-100 animate-in fade-in">
                  <button type="submit" disabled={isSaving} className="flex-1 h-14 bg-[#1f2937] hover:bg-black text-white py-4 rounded-xl text-[12px] font-black tracking-[0.15em] uppercase transition-all shadow-lg flex justify-center items-center gap-2">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                  </button>
                  <button type="button" onClick={() => { setIsEditing(false); setImagePreview(null); setSelectedFile(null); setFormData({ fullName: currentUser.fullName || "", email: currentUser.email || "", phone: cachedPhone || currentUser.phone || "" }); }} className="flex-1 h-14 bg-white border border-gray-200 text-[#1f2937] py-4 rounded-xl text-[12px] font-black tracking-[0.15em] uppercase hover:bg-gray-50 transition-all flex justify-center items-center gap-2 shadow-sm"><X size={18} /> Cancel</button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t border-[#f3f4f6] pt-24 pb-12 mt-24">
        <div className="w-full max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 text-center md:text-left">
          <div>
            <h3 className="font-black italic text-[#1f2937] text-[24px] mb-6 tracking-tighter">Digital Maitre D'</h3>
            <p className="text-[#6b7280] text-[16px] max-w-[480px] leading-relaxed font-medium">Elevating the at-home dining experience through technology and culinary expertise.</p>
          </div>
          <div className="flex flex-col md:items-end justify-between">
            <div className="flex flex-wrap justify-center md:justify-end gap-x-10 gap-y-4 text-[13px] font-black tracking-[0.2em] uppercase text-[#1f2937]">
              <span>Privacy</span><span>Terms</span><span>Support</span><span>Careers</span>
            </div>
            <p className="text-[#9ca3af] text-[12px] font-bold mt-16 md:mt-0 tracking-widest uppercase">© 2024 DIGITAL MAITRE D' TECHNOLOGIES. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const CheckCircle2 = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>;