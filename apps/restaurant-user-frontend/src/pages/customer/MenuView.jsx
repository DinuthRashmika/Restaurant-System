import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { getAllMenuItems } from "../../services/menuService";
import { useCart } from "../../context/CartContext";
import { Search } from "lucide-react"; // Imported Search icon

export default function MenuView() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  
  const [categories, setCategories] = useState(["All"]);
  
  // NEW: State for the search query
  const [searchQuery, setSearchQuery] = useState("");
  
  const { cart, addToCart } = useCart();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // UPDATED: Added searchQuery to dependency array
  useEffect(() => {
    filterItems();
  }, [menuItems, selectedCategory, searchQuery]);

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
          if (dynamicCategories.length >= 5) return;

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
    <div className="min-h-screen bg-[#fafaf9] selection:bg-[#d05322] selection:text-white pb-12">
      <Topbar />

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4 mt-4">
          
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 tracking-tight">Menu Categories</h2>
              
              <div className="mt-4 space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full rounded-xl px-4 py-3 text-left text-[14px] transition-all duration-300 font-semibold ${
                      selectedCategory === category
                        ? "bg-[#d05322] text-white shadow-md"
                        : "text-gray-600 bg-transparent hover:bg-gray-50 hover:text-[#1f2937]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* UPDATED: Header section with Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4 flex-1">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight whitespace-nowrap">
                  {selectedCategory === "All" ? "Full Collection" : `${selectedCategory} Selection`}
                </h2>
                <div className="h-px bg-gray-200 flex-1 hidden sm:block mt-2"></div>
              </div>
              
              <div className="relative group w-full sm:w-64 flex-shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d05322] transition-colors" size={18} strokeWidth={2.5}/>
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] transition-all shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-40 animate-pulse rounded-2xl bg-gray-200"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div key={item.id} className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-[#d05322]/50 hover:shadow-lg flex flex-col sm:flex-row gap-6">
                      
                      {item.imageUrl ? (
                        <div className="h-40 w-full sm:w-40 flex-shrink-0 overflow-hidden rounded-xl">
                          <img
                            src={`http://localhost:8082${item.imageUrl}`}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="h-40 w-full sm:w-40 flex-shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">No Image</span>
                        </div>
                      )}
                      
                      <div className="flex flex-1 flex-col justify-between py-2">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#d05322] transition-colors">{item.name}</h3>
                          </div>
                          <p className="mt-2 text-[14px] text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                        </div>
                        
                        <div className="mt-6 flex items-center justify-between">
                          <span className="text-2xl font-black text-[#1f2937]">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="rounded-full bg-[#f3f4f6] px-6 py-2.5 text-[13px] font-black uppercase tracking-widest text-[#1f2937] transition-all hover:bg-[#d05322] hover:text-white shadow-sm hover:shadow-md"
                          >
                            Add to Order
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
                    <p className="text-lg font-bold text-gray-400">
                      {searchQuery ? `No items found matching "${searchQuery}"` : "No items found for this category."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Your Selection</h3>
              
              <div className="mt-6 space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-[14px] border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="pr-3">
                      <p className="font-bold text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900 whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                {cart.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-[14px] font-medium text-gray-400">Your cart is empty.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-dashed border-gray-200 pt-6">
                <div className="flex justify-between font-black text-lg text-gray-900">
                  <span>Subtotal</span>
                  <span className="text-[#d05322]">${cartTotal.toFixed(2)}</span>
                </div>
                
                <Link
                  to="/checkout"
                  className={`mt-6 block w-full rounded-xl py-4 text-center text-[14px] font-black uppercase tracking-widest text-white transition-all shadow-lg ${
                    cart.length > 0 
                      ? "bg-[#1f2937] hover:bg-[#d05322] hover:-translate-y-1" 
                      : "bg-gray-300 cursor-not-allowed pointer-events-none shadow-none"
                  }`}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}