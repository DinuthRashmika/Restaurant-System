import { Link } from "react-router-dom";
import { Search, Bell, User, Star, ArrowRight, ArrowLeft, ChevronRight, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllMenuItems } from "../../services/menuService"; // Added API import

export default function CustomerDashboard() {
  const [scrolled, setScrolled] = useState(false);
  
  // --- NEW STATES FOR DYNAMIC MENU ---
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- FETCH & FILTER LOGIC ---
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllMenuItems();
        if (response.success) {
          setMenuItems(response.data);
          setFilteredItems(response.data); // Initialize with all items
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

  // --- UPDATED CATEGORIES TO ACT AS FILTERS ---
  const categories = [
    { name: "All", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" },
    { name: "Main Course", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80" },
    { name: "Appetizers", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=400&q=80" },
    { name: "Desserts", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400&q=80" },
    { name: "Beverages", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80" }
  ];

  const popularCuisines = [
    { name: "Italian Kitchen", chef: "Massimo Bottura", location: "Downtown · 1.2mi", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" },
    { name: "The Wagyu House", chef: "Kenji Sato", location: "Midtown · 3.4mi", image: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=600&q=80" },
    { name: "Botanica Vegan", chef: "Sarah Wells", location: "Westside · 0.8mi", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80" },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans selection:bg-[#d05322] selection:text-white">
      
      {/* Immersive Hero Navbar - Becomes solid on scroll */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <h1 className={`text-2xl font-black italic tracking-tighter transition-colors duration-500 ${scrolled ? 'text-[#1f2937]' : 'text-white'}`}>
              Digital Maitre D
            </h1>
            <nav className="hidden lg:flex items-center gap-10">
              <Link to="/customer/dashboard" className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-500 ${scrolled ? 'text-[#1f2937]' : 'text-white'} flex flex-col after:w-full after:h-0.5 after:bg-[#d05322] after:mt-1`}>
                Explore
              </Link>
              <Link to="/customer/orders" className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-500 ${scrolled ? 'text-[#6b7280] hover:text-[#1f2937]' : 'text-white/70 hover:text-white'}`}>
                Orders
              </Link>
              <Link to="/favorites" className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-500 ${scrolled ? 'text-[#6b7280] hover:text-[#1f2937]' : 'text-white/70 hover:text-white'}`}>
                Favorites
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button className={`transition-colors duration-500 hover:scale-110 ${scrolled ? 'text-[#1f2937]' : 'text-white'}`}>
              <Bell size={22} strokeWidth={2.5} />
            </button>
            <Link to="/profile">
              <div className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white/20 cursor-pointer hover:border-[#d05322] transition-colors" style={{backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')"}}></div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?auto=format&fit=crop&w=2000&q=80" 
            alt="Fine dining table" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#fafaf9]"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-8 flex flex-col items-center text-center mt-20">
          <span className="text-[#d05322] font-black tracking-[0.3em] uppercase text-[11px] mb-6 flex items-center gap-2">
            <div className="w-8 h-px bg-[#d05322]"></div>
            Exclusive Access
            <div className="w-8 h-px bg-[#d05322]"></div>
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-[84px] font-bold text-white leading-[1.05] tracking-tight mb-8">
            Curated Dining, <br/>
            <span className="italic font-light text-white/90">Delivered.</span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-[600px] font-medium leading-relaxed mb-12">
            Experience the city's highest-tier culinary creations, brought to your door with white-glove precision.
          </p>

          <div className="flex items-center bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full p-2 w-full max-w-[680px] shadow-2xl transition-all hover:bg-white/20 focus-within:bg-white focus-within:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] group">
            <div className="pl-6 text-white group-focus-within:text-[#d05322] transition-colors">
              <Search size={22} strokeWidth={2.5}/>
            </div>
            <input 
              type="text" 
              placeholder="What are you craving today?" 
              className="flex-1 px-4 py-4 lg:py-5 outline-none bg-transparent text-[16px] font-semibold text-white group-focus-within:text-[#1f2937] placeholder:text-white/60 group-focus-within:placeholder:text-[#9ca3af] transition-colors"
            />
            <button className="rounded-full bg-[#d05322] px-8 lg:px-10 py-4 lg:py-5 text-[14px] font-bold tracking-widest text-white uppercase transition-all hover:bg-[#b84318] hover:scale-105 shadow-[0_0_20px_rgba(208,83,34,0.4)]">
              Find Food
            </button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content bounded width */}
      <div className="w-full max-w-[1440px] mx-auto px-8 relative z-20 -mt-10 lg:-mt-24">
        
        {/* Categories Carousel - UPDATED TO BE FUNCTIONAL */}
        <section className="mb-16">
           <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="text-[28px] font-bold text-[#1f2937] tracking-tight">Our Curations</h2>
            </div>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center text-[#1f2937] hover:border-[#d05322] hover:text-[#d05322] transition-colors shadow-sm">
                <ArrowLeft size={18} strokeWidth={2.5} />
              </button>
              <button className="w-10 h-10 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center text-[#1f2937] hover:border-[#d05322] hover:text-[#d05322] transition-colors shadow-sm">
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x pt-2 px-2">
            {categories.map((cat) => (
              <div 
                key={cat.name} 
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex flex-col gap-4 min-w-[140px] lg:min-w-[180px] group cursor-pointer snap-start rounded-[2.2rem] p-1.5 transition-all duration-300 ${
                  selectedCategory === cat.name ? 'bg-[#d05322] shadow-[0_10px_30px_rgba(208,83,34,0.3)]' : 'bg-transparent'
                }`}
              >
                <div className="h-[180px] lg:h-[240px] w-full rounded-[1.8rem] overflow-hidden relative shadow-md">
                  <div className={`absolute inset-0 transition-colors duration-500 z-10 ${selectedCategory === cat.name ? 'bg-black/0' : 'bg-black/20 group-hover:bg-black/0'}`}></div>
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Floating Label */}
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl py-3 px-4 text-center border border-white/50 shadow-xl">
                      <span className={`text-[14px] font-black tracking-wider uppercase ${selectedCategory === cat.name ? 'text-[#d05322]' : 'text-[#1f2937]'}`}>
                        {cat.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DYNAMIC MENU ITEMS GRID (Replaces static Chef's Selection) */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12 px-2">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#1f2937] tracking-tight">
              {selectedCategory === "All" ? "Full Collection" : `${selectedCategory} Selection`}
            </h2>
            <div className="h-px bg-[#e5e7eb] flex-1 mt-2"></div>
            <Link className="text-[13px] font-bold tracking-widest uppercase text-[#d05322] flex items-center gap-1 mt-2">
              {filteredItems.length} Items
            </Link>
          </div>
          
          {loading ? (
             <div className="flex justify-center items-center h-48">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d05322]"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="group cursor-pointer bg-white rounded-[2.5rem] border border-[#e5e7eb] hover:border-[#d05322]/50 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden flex flex-col h-full">
                    <div className="h-[220px] w-full overflow-hidden relative shadow-sm">
                      {item.imageUrl ? (
                        <img 
                          src={`http://localhost:8082${item.imageUrl}`} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f3f4f6] flex items-center justify-center text-gray-400">No Image</div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] font-black text-[#1f2937] flex items-center gap-1 shadow-md uppercase tracking-wider">
                        <Star size={12} fill="#d05322" className="text-[#d05322]"/> New
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[20px] font-extrabold text-[#1f2937] leading-snug mb-2 group-hover:text-[#d05322] transition-colors">{item.name}</h4>
                        <p className="text-[#6b7280] text-[14px] leading-relaxed line-clamp-2 mb-6">{item.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#f3f4f6]">
                         <span className="text-[24px] font-black text-[#1f2937]">${item.price.toFixed(2)}</span>
                         <button className="w-12 h-12 rounded-full bg-[#f3f4f6] text-[#1f2937] flex items-center justify-center group-hover:bg-[#d05322] group-hover:text-white transition-all transform group-hover:rotate-12 shadow-sm">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                         </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-[#e5e7eb] rounded-[3rem]">
                  <p className="text-[18px] font-bold text-[#6b7280] mb-2">No items discovered.</p>
                  <p className="text-[14px] text-[#9ca3af]">We are currently preparing our {selectedCategory} menu.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Premier Kitchens Near You */}
        <section className="mb-24 px-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-[12px] font-black text-[#d05322] tracking-[0.2em] uppercase mb-2">Exclusive Partnerships</p>
              <h2 className="text-[32px] font-bold text-[#1f2937] tracking-tight">Premier Kitchens Nearby</h2>
            </div>
            <p className="text-[#6b7280] text-[15px] max-w-sm">We've partnered with the finest culinary establishments in your vicinity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCuisines.map((kitchen) => (
              <div key={kitchen.name} className="group cursor-pointer">
                <div className="h-[240px] rounded-[2rem] overflow-hidden mb-6 shadow-sm border border-[#e5e7eb] relative">
                  <img src={kitchen.image} alt={kitchen.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <MapPin size={12} strokeWidth={3} className="text-[#d05322]" />
                    <span className="text-[11px] font-black text-[#1f2937] tracking-widest uppercase">{kitchen.location}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[20px] font-extrabold text-[#1f2937] mb-1 group-hover:text-[#d05322] transition-colors">{kitchen.name}</h3>
                  <p className="text-[14px] font-semibold text-[#6b7280]">By Chef {kitchen.chef}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Epic Newsletter Banner */}
        <section className="mb-32 px-2">
          <div className="bg-[#1f2937] rounded-[3rem] overflow-hidden relative flex flex-col md:flex-row items-center border border-[#374151] shadow-2xl">
            <div className="absolute right-0 top-0 bottom-0 w-[60%] bg-[#d05322]/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
            
            <div className="p-12 md:p-16 lg:px-24 flex-1 relative z-10">
              <span className="text-[12px] font-black text-[#d05322] tracking-[0.2em] uppercase mb-4 block">The Inner Circle</span>
              <h2 className="text-[36px] md:text-[48px] font-bold text-white leading-tight tracking-tight mb-6">
                Receive exclusive <br/>off-menu pairings.
              </h2>
              <p className="text-[16px] text-[#9ca3af] max-w-md mb-8">Join the VIP list to get access to limited-edition seasonal dishes and chef-curated tasting events.</p>
              
              <div className="flex bg-white/5 backdrop-blur-md border border-white/20 rounded-full p-1.5 max-w-md focus-within:bg-white/10 transition-colors">
                <input type="email" placeholder="Enter your email address" className="flex-1 bg-transparent px-6 text-white text-[14px] outline-none placeholder:text-[#9ca3af]" />
                <button className="bg-[#d05322] hover:bg-[#b84318] text-white rounded-full px-8 py-4 text-[13px] font-black uppercase tracking-widest transition-colors shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="w-full md:w-[45%] h-[300px] md:h-auto relative z-10 self-stretch">
               <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80" alt="Pouring wine" className="w-full h-full object-cover rounded-tl-[3rem] rounded-bl-[3rem] md:rounded-bl-none"/>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[#f3f4f6] pt-20 pb-10">
        <div className="w-full max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-bold italic text-[#d05322] text-[20px] mb-4 tracking-tight">Digital Maitre D</h3>
            <p className="text-[#6b7280] text-[14px] max-w-[400px] leading-relaxed font-medium">
              Elevating the at-home dining experience through technology and culinary expertise. We bridge the gap between fine dining and sophisticated convenience.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-between">
            <div className="flex gap-8 text-[13px] font-bold tracking-widest uppercase text-[#1f2937]">
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Terms</span>
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Support</span>
              <span className="hover:text-[#d05322] transition-colors cursor-pointer">Careers</span>
            </div>
            <p className="text-[#9ca3af] text-[12px] font-semibold mt-12 md:mt-0 tracking-wider">
              © 2024 DIGITAL MAITRE D' TECHNOLOGIES. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}