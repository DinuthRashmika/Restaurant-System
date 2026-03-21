import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm py-4 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-8 lg:gap-16">
            <Link to="/customer/dashboard">
              <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-[#1f2937] transition-colors hover:text-[#d05322]">
                Digital Maitre D
              </h1>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-10">
              <Link 
                to="/customer/dashboard" 
                className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-300 flex flex-col after:h-0.5 after:mt-1 ${
                  currentPath === '/customer/dashboard' 
                    ? 'text-[#1f2937] after:w-full after:bg-[#d05322]' 
                    : 'text-[#6b7280] hover:text-[#1f2937] after:w-0 hover:after:w-full hover:after:bg-[#d05322]/50'
                }`}
              >
                Explore
              </Link>
              
              <Link 
                to="/menu" 
                className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-300 flex flex-col after:h-0.5 after:mt-1 ${
                  currentPath.includes('/menu') || currentPath.includes('/checkout')
                    ? 'text-[#1f2937] after:w-full after:bg-[#d05322]' 
                    : 'text-[#6b7280] hover:text-[#1f2937] after:w-0 hover:after:w-full hover:after:bg-[#d05322]/50'
                }`}
              >
                Order Now
              </Link>
              
              <Link 
                to="/order-history" 
                className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-300 flex flex-col after:h-0.5 after:mt-1 ${
                  currentPath.includes('/order-history') 
                    ? 'text-[#1f2937] after:w-full after:bg-[#d05322]' 
                    : 'text-[#6b7280] hover:text-[#1f2937] after:w-0 hover:after:w-full hover:after:bg-[#d05322]/50'
                }`}
              >
                History
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="transition-transform duration-300 hover:scale-110 text-[#1f2937] hover:text-[#d05322]">
              <Bell size={22} strokeWidth={2.5} />
            </button>
            <Link to="/profile">
              <div 
                className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-cover bg-center border-2 border-transparent hover:border-[#d05322] transition-colors shadow-sm" 
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')"}}
              ></div>
            </Link>

            {/* Vertical Divider line */}
            <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center h-10 w-10 rounded-full text-gray-500 hover:text-[#d05322] hover:bg-orange-50 transition-all duration-300"
              title="Logout"
            >
              <LogOut size={20} strokeWidth={2.5} className="ml-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Invisible Spacer */}
      {/* This invisible box pushes the rest of your page content down so it doesn't get hidden behind the fixed header */}
      <div className="h-[72px] w-full"></div>
    </>
  );
}