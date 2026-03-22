import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Star, ArrowRight, ArrowLeft, ChevronRight, MapPin, Sparkles, ChefHat, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllMenuItems } from "../../services/menuService";
import { useAuth } from "../../context/AuthContext";

export default function CustomerDashboard() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate(); 
  const { auth, logout } = useAuth();
  
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  
  const [categories, setCategories] = useState([
    { name: "All", image: "https://images.unsplash.com/photo-1544025162-8315ea07fcc2?auto=format&fit=crop&w=400&q=80" }
  ]);

  // --- START REAL PROFILE PIC LOGIC ---
  const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
  const currentUser = auth?.user || auth || storedAuth?.user || storedAuth || {};
  
  // Extract User ID to look into the specific local cache
  const userId = currentUser.id || currentUser._id || currentUser.userId || "Unassigned";
  
  // Hunt for the cached image (the boy pic) or the auth image
  const cachedImage = localStorage.getItem(`frontend_image_cache_${userId}`);
  const profileImage = cachedImage || currentUser.profileImage || currentUser.avatarUrl || "";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  // --- END REAL PROFILE PIC LOGIC ---

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllMenuItems();
        if (response.success) {
          const items = response.data;
          setMenuItems(items);
          setFilteredItems(items); 

          const dynamicCategories = [
            { name: "All", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" }
          ];
          
          const addedCategories = new Set();

          items.forEach(item => {
            if (item.category && !addedCategories.has(item.category)) {
              addedCategories.add(item.category);
              
              const categoryImage = item.imageUrl 
                ? `http://localhost:8082${item.imageUrl}` 
                : "https://images.unsplash.com/photo-1490818387583-1b0570c867ee?auto=format&fit=crop&w=400&q=80";

              dynamicCategories.push({
                name: item.category,
                image: categoryImage
              });
            }
          });

          setCategories(dynamicCategories);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(item => 
        item.category && item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredItems(filtered);
    }
  }, [menuItems, selectedCategory]);

  const popularCuisines = [
    { name: "Italian Kitchen", chef: "Massimo Bottura", location: "Downtown · 1.2mi", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" },
    { name: "The Wagyu House", chef: "Kenji Sato", location: "Midtown · 3.4mi", image: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=600&q=80" },
    { name: "Botanica Vegan", chef: "Sarah Wells", location: "Westside · 0.8mi", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80" },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans selection:bg-[#d05322] selection:text-white pb-16">
      
      {/* Immersive Hero Navbar - Ultra Premium Glassmorphism */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-4 border-b border-white/20' : 'bg-gradient-to-b from-black/70 to-transparent py-8'}`}>
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <h1 className={`text-2xl font-black italic tracking-tighter transition-colors duration-500 ${scrolled ? 'text-[#1f2937]' : 'text-white drop-shadow-md'}`}>
              Digital Maitre D'
            </h1>
            <nav className="hidden lg:flex items-center gap-10">
              <Link to="/customer/dashboard" className={`text-[12px] font-black tracking-[0.15em] uppercase transition-colors duration-500 ${scrolled ? 'text-[#1f2937]' : 'text-white'} flex flex-col after:w-full after:h-[2px] after:bg-[#d05322] after:mt-1.5`}>
                Explore
              </Link>
              <Link to="/menu" className={`text-[12px] font-black tracking-[0.15em] uppercase transition-colors duration-500 ${scrolled ? 'text-[#9ca3af] hover:text-[#d05322]' : 'text-white/60 hover:text-white'}`}>
                Order Now
              </Link>
              <Link to="/order-history" className={`text-[12px] font-black tracking-[0.15em] uppercase transition-colors duration-500 ${scrolled ? 'text-[#9ca3af] hover:text-[#d05322]' : 'text-white/60 hover:text-white'}`}>
                History
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-8">
            <button className={`transition-all duration-500 hover:scale-110 ${scrolled ? 'text-[#1f2937] hover:text-[#d05322]' : 'text-white hover:text-gray-200 drop-shadow-md'}`}>
              <Bell size={22} strokeWidth={2.5} />
            </button>
            <Link to="/profile" className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d05322] to-[#b84318] rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>
              {/* UPDATED: Profile picture container now uses the real image/boy pic or fallback User icon */}
              <div className={`relative h-11 w-11 rounded-full border-2 transition-colors duration-500 shadow-xl overflow-hidden flex items-center justify-center bg-gray-100 ${scrolled ? 'border-white' : 'border-white/30'}`}>
                {profileImage ? (
                  <div 
                    className="w-full h-full bg-cover bg-center" 
                    style={{ backgroundImage: `url('${profileImage}')` }}
                  />
                ) : (
                  <User size={24} className="text-gray-400" />
                )}
              </div>
            </Link>
            
            {/* Added Logout to Header for better usability */}
            <div className={`h-6 w-px hidden sm:block mx-1 ${scrolled ? 'bg-gray-200' : 'bg-white/20'}`}></div>
            <button onClick={handleLogout} className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 ${scrolled ? 'text-gray-400 hover:text-[#d05322] hover:bg-orange-50' : 'text-white hover:bg-white/10'}`}>
              <LogOut size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Cinematic Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#111827]">
          <img 
            src="https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?auto=format&fit=crop&w=2000&q=80" 
            alt="Fine dining table" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay animate-in fade-in duration-[2000ms] ease-out zoom-in-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#111827]/40 to-[#fafaf9]"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-8 flex flex-col items-center text-center mt-5">
          <div className="flex items-center gap-3 mb-8 animate-in slide-in-from-bottom-8 fade-in duration-1000">
            <div className="h-[2px] w-8 bg-[#d05322]"></div>
            <span className="text-[#d05322] font-black tracking-[0.4em] uppercase text-[11px] drop-shadow-md">Exclusive Access</span>
            <div className="h-[2px] w-8 bg-[#d05322]"></div>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-[96px] font-extrabold text-white leading-[1.05] tracking-tight mb-8 drop-shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-150">
            Curated Dining, <br/>
            <span className="italic font-light text-white/90">Delivered.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-[600px] font-medium leading-relaxed mb-16 drop-shadow-md animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-300">
            Experience the city's highest-tier culinary creations, brought to your door with white-glove precision.
          </p>

          <div className="flex items-center bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-2 w-full max-w-[720px] shadow-2xl transition-all hover:bg-white/20 focus-within:bg-white focus-within:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group animate-in zoom-in-95 fade-in duration-1000 delay-500">
            <div className="pl-6 pr-2 text-white group-focus-within:text-[#d05322] transition-colors">
              <Search size={24} strokeWidth={2.5}/>
            </div>
            <input 
              type="text" 
              placeholder="What are you craving today?" 
              className="flex-1 px-4 py-5 outline-none bg-transparent text-[16px] font-semibold text-white group-focus-within:text-[#1f2937] placeholder:text-white/60 group-focus-within:placeholder:text-[#9ca3af] transition-colors"
            />
            <button 
              onClick={() => navigate('/menu')}
              className="rounded-[1.5rem] bg-[#d05322] px-10 py-5 text-[13px] font-black tracking-[0.2em] text-white uppercase transition-all hover:bg-[#b84318] hover:scale-[1.02] shadow-[0_8px_20px_rgba(208,83,34,0.4)]"
            >
              Order Now
            </button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <div className="w-full max-w-[1440px] mx-auto px-8 relative z-20 -mt-16">
        
        {/* Editorial Categories Carousel */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-10 px-2">
            <div>
              <h2 className="text-[36px] font-extrabold text-[#1f2937] tracking-tight">Our Curations</h2>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border-2 border-[#e5e7eb] bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#1f2937] hover:border-[#d05322] hover:text-[#d05322] transition-all hover:shadow-lg">
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>
              <button className="w-12 h-12 rounded-full border-2 border-[#e5e7eb] bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#1f2937] hover:border-[#d05322] hover:text-[#d05322] transition-all hover:shadow-lg">
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x pt-2 px-2">
            {categories.map((cat) => (
              <div 
                key={cat.name} 
                onClick={() => setSelectedCategory(cat.name)}
                className={`group cursor-pointer snap-start rounded-[2.5rem] p-2 transition-all duration-500 flex-shrink-0 ${
                  selectedCategory === cat.name ? 'bg-[#d05322] shadow-[0_15px_40px_rgba(208,83,34,0.3)] -translate-y-2' : 'bg-transparent hover:bg-white hover:shadow-xl'
                }`}
              >
                <div className="h-[280px] w-[200px] lg:w-[240px] rounded-[2rem] overflow-hidden relative shadow-inner">
                  <div className={`absolute inset-0 z-10 transition-colors duration-500 ${selectedCategory === cat.name ? 'bg-gradient-to-t from-black/60 to-transparent' : 'bg-black/30 group-hover:bg-gradient-to-t group-hover:from-black/60 group-hover:to-transparent'}`}></div>
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className={`backdrop-blur-sm rounded-2xl py-4 px-4 text-center border transition-all duration-500 ${selectedCategory === cat.name ? 'bg-white text-[#d05322] border-transparent shadow-xl' : 'bg-white/20 border-white/40 text-white group-hover:bg-white/30'}`}>
                      <span className="text-[13px] font-black tracking-[0.15em] uppercase">
                        {cat.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Menu Grid - Premium Cards */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-16 px-2">
            <h2 className="text-[40px] md:text-[48px] font-extrabold text-[#1f2937] tracking-tight">
              {selectedCategory === "All" ? "Full Collection" : `${selectedCategory} Selection`}
            </h2>
            <div className="h-[2px] bg-gradient-to-r from-[#e5e7eb] to-transparent flex-1 mt-4"></div>
            <Link to="/menu" className="text-[12px] font-black tracking-[0.2em] uppercase text-[#d05322] hover:text-[#1f2937] transition-colors flex items-center gap-2 mt-4">
              Explore Menu <ChevronRight size={18} strokeWidth={3} />
            </Link>
          </div>
          
          {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#d05322]"></div>
              </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="group cursor-pointer bg-white rounded-[2rem] border border-[#f3f4f6] hover:border-[#d05322]/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-1">
                    <div className="h-[260px] w-full overflow-hidden relative">
                      {item.imageUrl ? (
                        <img 
                          src={`http://localhost:8082${item.imageUrl}`} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f9fafb] flex items-center justify-center text-gray-300">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 text-[10px] font-black text-[#1f2937] flex items-center gap-1.5 shadow-lg uppercase tracking-widest">
                        <Sparkles size={12} className="text-[#d05322]"/> Curated
                      </div>
                    </div>
                    
                    <div className="flex-1 p-8 flex flex-col justify-between bg-white relative">
                      <div>
                        <h4 className="text-[22px] font-bold text-[#1f2937] leading-tight mb-3 group-hover:text-[#d05322] transition-colors">{item.name}</h4>
                        <p className="text-[#6b7280] text-[15px] leading-relaxed line-clamp-2 font-medium mb-8">{item.description}</p>
                      </div>
                      
                      <div className="flex items-end justify-between mt-auto">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black tracking-widest text-[#9ca3af] uppercase mb-1">Price</span>
                            <span className="text-[28px] font-extrabold text-[#1f2937] leading-none">${item.price.toFixed(2)}</span>
                          </div>
                          <button 
                            onClick={() => navigate('/menu')}
                            className="w-14 h-14 rounded-full bg-[#1f2937] text-white flex items-center justify-center group-hover:bg-[#d05322] transition-colors duration-300 shadow-xl group-hover:shadow-[0_10px_20px_rgba(208,83,34,0.3)]"
                          >
                            <ArrowRight size={22} strokeWidth={2.5} className="transform group-hover:translate-x-1 transition-transform" />
                          </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full h-72 flex flex-col items-center justify-center border-2 border-dashed border-[#e5e7eb] rounded-[3rem] bg-gray-50/50">
                  <ChefHat size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
                  <p className="text-[20px] font-extrabold text-[#1f2937] mb-2">No items discovered.</p>
                  <p className="text-[15px] font-medium text-[#6b7280]">Our chefs are currently preparing the {selectedCategory} menu.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Premier Kitchens Near You - Editorial Cards */}
        <section className="mb-32 px-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Star className="text-[#d05322]" fill="#d05322" size={16} />
                <span className="text-[12px] font-black text-[#d05322] tracking-[0.3em] uppercase">Partnerships</span>
              </div>
              <h2 className="text-[40px] font-extrabold text-[#1f2937] tracking-tight leading-none">Premier Kitchens Nearby</h2>
            </div>
            <p className="text-[#6b7280] text-[16px] max-w-md font-medium leading-relaxed border-l-2 border-[#d05322] pl-6">
              We have partnered with the finest culinary establishments in your vicinity to bring their mastery to your table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {popularCuisines.map((kitchen) => (
              <div key={kitchen.name} className="group cursor-pointer">
                <div className="h-[320px] rounded-[2.5rem] overflow-hidden mb-6 shadow-lg relative">
                  <img src={kitchen.image} alt={kitchen.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl inline-flex items-center gap-2 mb-4 border border-white/30 text-white">
                      <MapPin size={14} strokeWidth={2.5} />
                      <span className="text-[11px] font-black tracking-widest uppercase">{kitchen.location}</span>
                    </div>
                    <h3 className="text-[28px] font-bold text-white mb-1 group-hover:text-white transition-colors">{kitchen.name}</h3>
                    <p className="text-[15px] font-medium text-gray-300">By Chef {kitchen.chef}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Epic Newsletter Banner - Deep Luxury */}
        <section className="mb-24 px-2">
          <div className="bg-[#111827] rounded-[3.5rem] overflow-hidden relative flex flex-col md:flex-row items-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="absolute left-0 top-0 bottom-0 w-[50%] bg-gradient-to-r from-[#d05322]/20 to-transparent pointer-events-none"></div>
            
            <div className="p-12 md:p-20 lg:px-24 flex-1 relative z-10">
              <span className="text-[12px] font-black text-[#d05322] tracking-[0.3em] uppercase mb-6 block">The Inner Circle</span>
              <h2 className="text-[40px] md:text-[56px] font-extrabold text-white leading-[1.1] tracking-tight mb-8">
                Receive exclusive <br/>
                <span className="italic font-light text-gray-300">off-menu pairings.</span>
              </h2>
              <p className="text-[18px] font-medium text-gray-400 max-w-lg mb-12 leading-relaxed">
                Join the VIP list to access limited-edition seasonal dishes and chef-curated tasting events before anyone else.
              </p>
              
              <div className="flex bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-2 max-w-xl focus-within:bg-white/15 focus-within:border-white/40 transition-all shadow-2xl">
                <input type="email" placeholder="Enter your email address" className="flex-1 bg-transparent px-6 py-2 text-white text-[16px] font-medium outline-none placeholder:text-gray-500" />
                <button className="bg-white hover:bg-gray-100 text-[#111827] rounded-full px-8 lg:px-10 py-4 text-[13px] font-black uppercase tracking-[0.2em] transition-colors shadow-lg flex-shrink-0">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="w-full md:w-[40%] h-[400px] md:h-auto relative z-10 self-stretch">
                <div className="absolute inset-0 bg-gradient-to-r from-[#111827] to-transparent z-10 hidden md:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent z-10 md:hidden"></div>
                <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80" alt="Pouring wine" className="w-full h-full object-cover"/>
            </div>
          </div>
        </section>

      </div>

      {/* Sophisticated Footer */}
      <footer className="bg-white border-t border-[#f3f4f6] pt-24 pb-12">
        <div className="w-full max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="font-black italic text-[#1f2937] text-[24px] mb-6 tracking-tighter">Digital Maitre D'</h3>
            <p className="text-[#6b7280] text-[16px] max-w-[480px] leading-relaxed font-medium">
              Elevating the at-home dining experience through technology and culinary expertise. We bridge the gap between fine dining and sophisticated convenience.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-between">
            <div className="flex flex-wrap gap-x-10 gap-y-4 text-[13px] font-black tracking-[0.2em] uppercase text-[#1f2937]">
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Terms</span>
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Support</span>
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Careers</span>
            </div>
            <p className="text-[#9ca3af] text-[12px] font-bold mt-16 md:mt-0 tracking-widest uppercase">
              © 2024 DIGITAL MAITRE D' TECHNOLOGIES. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}