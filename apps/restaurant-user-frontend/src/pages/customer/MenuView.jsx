import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { getAllMenuItems } from "../../services/menuService";
import { useCart } from "../../context/CartContext";
import { Search, Bell, LogOut, ShoppingBag, ChevronRight, Sparkles, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function MenuView() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const currentPath = location.pathname;

  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [categories, setCategories] = useState(["All"]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { cart, addToCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, selectedCategory, searchQuery]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchMenuItems = async () => {
    try {
      const response = await getAllMenuItems();
      if (response.success) {
        const items = response.data;
        
        // Immediately drop items that are switched off by the owner!
        const availableItemsOnly = items.filter(item => item.available === true);
        setMenuItems(availableItemsOnly);
        
        const dynamicCategories = ["All"];
        const addedCategories = new Set();

        availableItemsOnly.forEach(item => {
          if (dynamicCategories.length >= 8) return;

          if (item.category && !addedCategories.has(item.category)) {
            addedCategories.add(item.category);
            dynamicCategories.push(item.category);
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

  const filterItems = () => {
    let filtered = [...menuItems];
    
    // 1. Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => 
        item.category && item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // 2. Filter by search query (name or description)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredItems(filtered);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans selection:bg-[#d05322] selection:text-white pb-20">
      
      {/* IMMERSIVE HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-4 border-b border-white/20' : 'bg-gradient-to-b from-black/70 to-transparent py-8'}`}>
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link to="/customer/dashboard">
              <h1 className={`text-2xl font-black italic tracking-tighter transition-colors duration-500 ${scrolled ? 'text-[#1f2937]' : 'text-white drop-shadow-md'}`}>
                Digital Maitre D'
              </h1>
            </Link>
            <nav className="hidden lg:flex items-center gap-10">
              <Link to="/customer/dashboard" className={`text-[12px] font-black tracking-[0.15em] uppercase transition-colors duration-500 ${scrolled ? 'text-[#9ca3af] hover:text-[#d05322]' : 'text-white/60 hover:text-white'}`}>
                Explore
              </Link>
              <Link to="/menu" className={`text-[12px] font-black tracking-[0.15em] uppercase transition-colors duration-500 ${scrolled ? 'text-[#1f2937]' : 'text-white'} flex flex-col after:w-full after:h-[2px] after:bg-[#d05322] after:mt-1.5`}>
                Order Now
              </Link>
              <Link to="/order-history" className={`text-[12px] font-black tracking-[0.15em] uppercase transition-colors duration-500 ${scrolled ? 'text-[#9ca3af] hover:text-[#d05322]' : 'text-white/60 hover:text-white'}`}>
                History
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button className={`transition-all duration-500 hover:scale-110 ${scrolled ? 'text-[#1f2937] hover:text-[#d05322]' : 'text-white hover:text-gray-200 drop-shadow-md'}`}>
              <Bell size={22} strokeWidth={2.5} />
            </button>
            <Link to="/profile" className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d05322] to-[#b84318] rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>
              <div className={`relative h-10 w-10 rounded-full bg-cover bg-center border-2 transition-colors duration-500 shadow-xl ${scrolled ? 'border-white' : 'border-white/30'}`} style={{backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')"}}></div>
            </Link>
            <div className={`h-6 w-px hidden sm:block mx-2 ${scrolled ? 'bg-gray-200' : 'bg-white/20'}`}></div>
            <button onClick={handleLogout} className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 ${scrolled ? 'text-gray-400 hover:text-[#d05322] hover:bg-orange-50' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
              <LogOut size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* MINI CINEMATIC HERO */}
      <div className="relative w-full h-[40vh] min-h-[320px] flex flex-col items-center justify-center overflow-hidden bg-[#111827]">
        <img 
          src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop" 
          alt="Gourmet Preparation" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/60 via-transparent to-[#fafaf9]"></div>

        <div className="relative z-10 text-center px-4 mt-16">
          <div className="flex items-center justify-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-[2px] w-6 bg-[#d05322]"></div>
            <span className="text-[11px] font-black text-[#d05322] tracking-[0.3em] uppercase drop-shadow-md">A La Carte</span>
            <div className="h-[2px] w-6 bg-[#d05322]"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-extrabold text-white tracking-tight mb-4 leading-tight drop-shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            The Culinary Collection
          </h2>
        </div>
      </div>

      {/* MAIN MENU LAYOUT */}
      <div className="mx-auto max-w-[1440px] px-8 relative z-20 -mt-8">
        <div className="grid gap-10 lg:grid-cols-12">
          
          {/* EDITORIAL SIDEBAR */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 rounded-[2rem] bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#f3f4f6]">
              <h2 className="text-[12px] font-black text-[#9ca3af] tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                <Sparkles size={14} className="text-[#d05322]" /> Menu Categories
              </h2>
              
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-5 py-3.5 text-[14px] font-bold transition-all duration-300 rounded-xl relative group overflow-hidden ${
                      selectedCategory === category
                        ? "text-[#d05322] bg-orange-50/50"
                        : "text-[#6b7280] hover:bg-gray-50 hover:text-[#1f2937]"
                    }`}
                  >
                    {selectedCategory === category && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d05322] rounded-r-full"></div>
                    )}
                    <span className={`relative z-10 ${selectedCategory === category ? 'pl-2' : 'group-hover:pl-2'} transition-all duration-300 block`}>
                      {category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN MENU CONTENT */}
          <div className="lg:col-span-6">
            
            {/* Sleek Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl md:text-[40px] font-extrabold text-[#1f2937] tracking-tight leading-none mb-2">
                  {selectedCategory === "All" ? "Full Collection" : `${selectedCategory}`}
                </h2>
                <p className="text-[14px] text-[#6b7280] font-medium">
                  {filteredItems.length} {filteredItems.length === 1 ? 'creation' : 'creations'} available
                </p>
              </div>
              
              <div className="relative group w-full sm:w-72 flex-shrink-0">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="text-[#9ca3af] group-focus-within:text-[#d05322] transition-colors" size={18} strokeWidth={2.5}/>
                </div>
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#e5e7eb] rounded-full pl-12 pr-4 py-3.5 text-[14px] font-bold text-[#1f2937] placeholder:text-[#9ca3af] placeholder:font-medium focus:outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] transition-all shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-48 animate-pulse rounded-[2rem] bg-gray-200/50"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div key={item.id} className="group bg-white rounded-[2rem] p-4 pr-6 border border-[#f3f4f6] hover:border-[#d05322]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col sm:flex-row gap-6">
                      
                      <div className="h-48 w-full sm:w-48 flex-shrink-0 overflow-hidden rounded-[1.5rem] relative">
                        {item.imageUrl ? (
                          <img
                            src={`http://localhost:8082${item.imageUrl}`}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full bg-[#f9fafb] flex items-center justify-center text-gray-300">
                            <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      <div className="flex flex-1 flex-col justify-between py-3">
                        <div>
                          <h3 className="text-[22px] font-bold text-[#1f2937] group-hover:text-[#d05322] transition-colors leading-tight">{item.name}</h3>
                          <p className="mt-3 text-[14px] text-[#6b7280] font-medium line-clamp-2 leading-relaxed">{item.description}</p>
                        </div>
                        
                        <div className="mt-6 flex items-end justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-[#9ca3af] uppercase mb-0.5">Price</span>
                            <span className="text-2xl font-extrabold text-[#1f2937]">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => addToCart(item)}
                            className="flex items-center gap-2 rounded-full bg-[#1f2937] px-6 py-3 text-[12px] font-black uppercase tracking-[0.15em] text-white transition-all hover:bg-[#d05322] hover:-translate-y-1 shadow-lg shadow-gray-900/20 hover:shadow-[#d05322]/30"
                          >
                            <Plus size={16} strokeWidth={3} /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2.5rem] border-2 border-dashed border-[#e5e7eb] p-16 text-center bg-gray-50/50">
                    <p className="text-xl font-bold text-[#1f2937] mb-2">No culinary items found.</p>
                    <p className="text-[14px] text-[#6b7280]">Try adjusting your search or category filter.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PREMIUM CART PANEL */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 rounded-[2rem] bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#f3f4f6]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#d05322]">
                  <ShoppingBag size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-[20px] font-extrabold text-[#1f2937] tracking-tight">Your Selection</h3>
              </div>
              
              <div className="space-y-5 max-h-[45vh] overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start group">
                    <div className="pr-4">
                      <p className="font-bold text-[#1f2937] text-[14px] leading-tight mb-1 group-hover:text-[#d05322] transition-colors">{item.name}</p>
                      <p className="text-[12px] font-bold text-[#9ca3af]">Qty: <span className="text-[#6b7280]">{item.quantity}</span></p>
                    </div>
                    <span className="font-black text-[#1f2937] text-[14px] whitespace-nowrap mt-0.5">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                {cart.length === 0 && (
                  <div className="py-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                      <ShoppingBag className="text-gray-300" size={24} />
                    </div>
                    <p className="text-[14px] font-bold text-[#6b7280]">Your tray is empty.</p>
                    <p className="text-[12px] text-[#9ca3af] mt-1">Add items to begin your order.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 border-t border-dashed border-[#e5e7eb] pt-6">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-[12px] font-black tracking-widest text-[#9ca3af] uppercase">Subtotal</span>
                  <span className="text-3xl font-extrabold text-[#d05322] leading-none">${cartTotal.toFixed(2)}</span>
                </div>
                
                <Link
                  to="/checkout"
                  className={`block w-full rounded-[1.25rem] py-4 text-center text-[13px] font-black uppercase tracking-[0.2em] text-white transition-all ${
                    cart.length > 0 
                      ? "bg-[#1f2937] hover:bg-black hover:-translate-y-1 shadow-xl shadow-gray-900/20" 
                      : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  Checkout <ChevronRight size={16} className="inline mb-0.5 ml-1" strokeWidth={3}/>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto px-8 mt-32 pt-12 border-t border-[#e5e7eb] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 text-[13px]">
           <h3 className="font-black italic text-[#d05322] text-[16px]">Digital Maitre D'</h3>
           <span className="hidden md:block text-[#9ca3af]">|</span>
           <p className="text-[#6b7280] font-medium">Curating exceptional dining experiences globally.</p>
        </div>
        <div className="flex gap-8 text-[12px] font-bold tracking-wider uppercase text-[#6b7280]">
          <Link to="/terms" className="hover:text-[#1f2937] transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-[#1f2937] transition-colors">Privacy</Link>
          <Link to="/support" className="hover:text-[#1f2937] transition-colors">Concierge</Link>
        </div>
      </footer>

    </div>
  );
}