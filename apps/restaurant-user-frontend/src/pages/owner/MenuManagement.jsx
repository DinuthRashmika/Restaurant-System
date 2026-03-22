import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, SlidersHorizontal, Bell, LogOut, Plus, MoreVertical, Edit2, Trash2, X, User, CheckCircle2, Loader2 } from "lucide-react";
import { 
  getAllMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from "../../services/menuService";
import { getAllOrders } from "../../services/orderService"; 
import { useAuth } from "../../context/AuthContext";
import { setToken } from "../../api/axios";

export default function MenuManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();
  const currentPath = location.pathname;

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [customCategories, setCustomCategories] = useState(() => {
    return JSON.parse(localStorage.getItem("customCategories")) || [];
  });
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); 
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Notifications State
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // --- START REAL PROFILE PIC LOGIC ---
  const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
  const currentUser = auth?.user || auth || storedAuth?.user || storedAuth || {};
  
  // Extract User ID to find the specific local cache
  const userId = currentUser.id || currentUser._id || currentUser.userId || "Unassigned";
  
  // Hunt for the cached image (the boy pic) or the auth image
  const cachedImage = localStorage.getItem(`frontend_image_cache_${userId}`);
  const profileImage = cachedImage || currentUser.profileImage || currentUser.avatarUrl || "";
  // --- END REAL PROFILE PIC LOGIC ---

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    available: true
  });
  const [imageFile, setImageFile] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchIncomingOrders = async () => {
      try {
        let currentToken = auth?.token || auth?.accessToken;
        if (!currentToken) {
          try {
            const storedAuthData = JSON.parse(localStorage.getItem("auth"));
            currentToken = storedAuthData?.token || storedAuthData?.accessToken;
          } catch (e) {}
        }
        if (currentToken) setToken(currentToken);

        const orderRes = await getAllOrders();

        const extractArrayAggressive = (obj) => {
          if (!obj) return [];
          if (Array.isArray(obj)) return obj;
          let foundArrays = [];
          const search = (item) => {
            if (!item || typeof item !== 'object') return;
            for (let key in item) {
              if (Array.isArray(item[key])) foundArrays.push(item[key]);
              else if (item[key] && typeof item[key] === 'object') search(item[key]);
            }
          };
          search(obj);
          if (foundArrays.length > 0) return foundArrays.sort((a, b) => b.length - a.length)[0];
          return [];
        };

        const extractedOrders = extractArrayAggressive(orderRes);
        const pending = extractedOrders.filter(o => String(o.status || "").toUpperCase() === "PENDING");
        setIncomingOrders(pending.sort((a, b) => new Date(b.createdAt || b.orderDate || 0) - new Date(a.createdAt || a.orderDate || 0)));
      } catch (err) {
        console.error("Silent Order Fetch Failed:", err);
      }
    };

    fetchIncomingOrders();
    const interval = setInterval(fetchIncomingOrders, 15000);
    return () => clearInterval(interval);
  }, [auth]);

  useEffect(() => {
    fetchMenuItems();
  }, [customCategories]); 

  const fetchMenuItems = async () => {
    try {
      const response = await getAllMenuItems();
      const items = (response.success && response.data) ? response.data : [];
      setMenuItems(items);
      
      const categoryMap = new Map();
      
      items.forEach(item => {
        const catName = item.category || "Uncategorized";
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + 1);
      });

      customCategories.forEach(catName => {
        if (!categoryMap.has(catName)) {
          categoryMap.set(catName, 0); 
        }
      });

      const dynamicCategories = Array.from(categoryMap, ([name, count]) => ({ name, count }));
      dynamicCategories.sort((a, b) => a.name.localeCompare(b.name));
      
      setCategories(dynamicCategories);

      if (dynamicCategories.length > 0 && !activeCategory) {
          setActiveCategory(dynamicCategories[0].name);
      }

    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const displayedItems = menuItems.filter(item => {
    const catMatch = (item.category || "Uncategorized") === activeCategory;
    const searchMatch = searchQuery.trim() === "" || 
                        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    let filterMatch = true;
    if (filterStatus === "available") filterMatch = item.available === true;
    if (filterStatus === "sold_out") filterMatch = item.available === false;

    return catMatch && searchMatch && filterMatch;
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("description", formData.description);
    formDataObj.append("category", formData.category); 
    formDataObj.append("price", formData.price);
    formDataObj.append("available", formData.available);
    if (imageFile) {
      formDataObj.append("image", imageFile);
    }

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, formDataObj);
      } else {
        await createMenuItem(formDataObj);
      }
      fetchMenuItems();
      resetForm();
    } catch (err) {
      setError(editingItem ? "Failed to update item" : "Failed to create item");
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i));
      
      const formDataObj = new FormData();
      formDataObj.append("name", item.name);
      formDataObj.append("description", item.description);
      formDataObj.append("category", item.category);
      formDataObj.append("price", item.price);
      formDataObj.append("available", !item.available);
      
      await updateMenuItem(item.id, formDataObj);
      fetchMenuItems(); 
    } catch (err) {
      console.error("Failed to toggle availability", err);
      fetchMenuItems(); 
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      available: item.available
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await deleteMenuItem(id);
      if (response && response.success) {
        fetchMenuItems();
      } else {
        setMenuItems(prev => prev.filter(i => i.id !== id));
      }
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    const cleanName = newCategoryName.trim();
    if (!cleanName) return;

    setCustomCategories(prev => {
      if (!prev.includes(cleanName)) {
        const updated = [...prev, cleanName];
        localStorage.setItem("customCategories", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });

    setActiveCategory(cleanName);
    setNewCategoryName("");
    setShowCategoryModal(false);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      category: activeCategory || (categories.length > 0 ? categories[0].name : ""),
      price: "",
      available: true
    });
    setImageFile(null);
    setError("");
  };

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/200?text=No+Image";
    if (url.startsWith('http')) return url;
    return `http://localhost:8082${url}`;
  };

  const formatTime = (dateString) => {
    if(!dateString) return "JUST NOW";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "JUST NOW";
    if (diffMins < 60) return `${diffMins} MIN AGO`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} HR AGO`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans flex flex-col items-center">
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm py-4 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link to="/owner/dashboard">
              <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-[#1f2937] transition-colors hover:text-[#d05322]">
                Digital Maitre D
              </h1>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-10">
              <Link to="/owner/dashboard" className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-300 flex flex-col after:h-0.5 after:mt-1 ${currentPath === '/owner/dashboard' ? 'text-[#1f2937] after:w-full after:bg-[#d05322]' : 'text-[#6b7280] hover:text-[#1f2937] after:w-0 hover:after:w-full hover:after:bg-[#d05322]/50'}`}>Dashboard</Link>
              <Link to="/owner/orders" className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-300 flex flex-col after:h-0.5 after:mt-1 ${currentPath === '/owner/orders' ? 'text-[#1f2937] after:w-full after:bg-[#d05322]' : 'text-[#6b7280] hover:text-[#1f2937] after:w-0 hover:after:w-full hover:after:bg-[#d05322]/50'}`}>Live Orders</Link>
              <Link to="/owner/menu" className={`text-[13px] font-bold tracking-widest uppercase transition-colors duration-300 flex flex-col after:h-0.5 after:mt-1 ${currentPath === '/owner/menu' ? 'text-[#1f2937] after:w-full after:bg-[#d05322]' : 'text-[#6b7280] hover:text-[#1f2937] after:w-0 hover:after:w-full hover:after:bg-[#d05322]/50'}`}>Menu Editor</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNotifications(prev => !prev);
                }}
                className="text-[#6b7280] hover:text-[#d05322] transition-colors relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-orange-50 focus:outline-none"
              >
                <Bell size={20} strokeWidth={2.5} />
                {incomingOrders.length > 0 && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#d05322] rounded-full border-2 border-white animate-pulse"></div>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-[9999] animate-in fade-in slide-in-from-top-2">
                  <div className="px-6 pb-3 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-[14px] font-extrabold text-[#1f2937]">Notifications</h3>
                    <span className="text-[10px] font-black tracking-widest bg-orange-50 text-[#d05322] px-2 py-0.5 rounded-full">
                      {incomingOrders.length} NEW
                    </span>
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto">
                    {incomingOrders.length === 0 ? (
                      <div className="px-6 py-8 text-center text-[13px] text-gray-500 font-medium">
                        You're all caught up!
                      </div>
                    ) : (
                      incomingOrders.slice(0, 5).map(order => (
                        <div 
                          key={order.id} 
                          className="px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer" 
                          onClick={() => navigate("/owner/orders")}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[13px] font-bold text-[#1f2937]">New Order #{order.id?.slice(-4).toUpperCase()}</span>
                            <span className="text-[10px] font-bold text-gray-400">{formatTime(order.createdAt || order.orderDate)}</span>
                          </div>
                          <p className="text-[12px] text-gray-500 line-clamp-1">{order.customerName}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SYNCED PROFILE IMAGE LOGIC */}
            <Link to="/profile" className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d05322] to-[#b84318] rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
              <div className="relative h-10 w-10 rounded-full bg-gray-100 border-2 border-transparent group-hover:border-white transition-all shadow-sm overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${profileImage}')`}} />
                ) : (
                  <User size={20} className="text-gray-400" />
                )}
              </div>
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>
            <button onClick={handleLogout} className="flex items-center justify-center h-10 w-10 rounded-full text-gray-500 hover:text-[#d05322] hover:bg-orange-50 transition-all duration-300 focus:outline-none"><LogOut size={20} strokeWidth={2.5} /></button>
          </div>
        </div>
      </header>

      <div className="h-[80px] w-full"></div>

      <div className="w-full max-w-[1440px] px-8 py-6 flex flex-col flex-1">
        
        <div className="flex items-center justify-between mb-8 mt-4">
          <h2 className="text-[32px] font-extrabold text-[#1f2937] tracking-tight">Menu Editor</h2>
          <div className="flex items-center gap-4">
            
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#d05322] transition-colors" size={16} strokeWidth={2.5}/>
              <input 
                type="text" 
                placeholder="SEARCH ITEM" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-[#e5e7eb] rounded-lg pl-10 pr-4 py-2.5 text-[12px] font-bold tracking-wider text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] w-[220px] transition-all uppercase shadow-sm"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-2 bg-white border ${showFilterDropdown || filterStatus !== 'all' ? 'border-[#d05322] text-[#d05322]' : 'border-[#e5e7eb] text-[#1f2937]'} rounded-lg px-4 py-2.5 text-[12px] font-bold tracking-wider hover:border-[#d05322] hover:text-[#d05322] transition-colors uppercase shadow-sm`}
              >
                <SlidersHorizontal size={16} strokeWidth={2.5} />
                FILTER {filterStatus !== 'all' && <span className="w-1.5 h-1.5 rounded-full bg-[#d05322] ml-1"></span>}
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Availability</div>
                  <button onClick={() => {setFilterStatus('all'); setShowFilterDropdown(false);}} className={`w-full text-left px-4 py-2.5 text-[13px] font-bold transition-colors ${filterStatus === 'all' ? 'text-[#d05322] bg-orange-50' : 'text-gray-700 hover:bg-gray-50'}`}>All Items</button>
                  <button onClick={() => {setFilterStatus('available'); setShowFilterDropdown(false);}} className={`w-full text-left px-4 py-2.5 text-[13px] font-bold transition-colors ${filterStatus === 'available' ? 'text-[#d05322] bg-orange-50' : 'text-gray-700 hover:bg-gray-50'}`}>Available Only</button>
                  <button onClick={() => {setFilterStatus('sold_out'); setShowFilterDropdown(false);}} className={`w-full text-left px-4 py-2.5 text-[13px] font-bold transition-colors ${filterStatus === 'sold_out' ? 'text-[#d05322] bg-orange-50' : 'text-gray-700 hover:bg-gray-50'}`}>Sold Out Only</button>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                setFormData(prev => ({...prev, category: activeCategory || (categories.length > 0 ? categories[0].name : "")}));
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-[#d05322] hover:bg-[#b84318] text-white rounded-lg px-5 py-2.5 text-[12px] font-bold tracking-wider uppercase transition-colors shadow-sm ml-2"
            >
              <Plus size={16} strokeWidth={3} />
              ADD NEW ITEM
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          <div className="w-full lg:w-64 flex-shrink-0">
            <h3 className="text-[11px] font-black text-[#9ca3af] tracking-widest uppercase mb-4 px-2">CATEGORIES</h3>
            <div className="flex flex-col gap-1 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-gray-200 before:-z-10 ml-2">
              {categories.length === 0 && !loading && <div className="px-4 py-3 text-[13px] text-gray-500 font-medium">No categories yet.</div>}
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {setActiveCategory(cat.name); setSearchQuery(""); setFilterStatus("all");}}
                  className={`flex items-center justify-between px-4 py-3 text-left w-full transition-all group border-l-2 ${activeCategory === cat.name ? "border-[#d05322] bg-white shadow-sm font-bold text-[#1f2937]" : "border-transparent text-[#6b7280] font-semibold hover:bg-white/50 hover:text-[#1f2937]"}`}
                >
                  <span className="text-[14px] truncate pr-2">{cat.name}</span>
                  <span className={`text-[12px] px-2 py-0.5 rounded-full flex-shrink-0 ${activeCategory === cat.name ? "bg-gray-100 text-[#1f2937]" : "bg-transparent text-[#9ca3af] group-hover:bg-gray-100"}`}>{cat.count}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowCategoryModal(true)} className="flex items-center gap-2 text-[12px] font-bold text-[#d05322] uppercase tracking-wider mt-6 px-6 hover:text-[#b84318] transition-colors"><Plus size={14} strokeWidth={3} /> ADD CATEGORY</button>
          </div>

          <div className="flex-1 min-w-0 bg-white rounded-3xl border border-[#e5e7eb] shadow-sm flex flex-col overflow-hidden mb-8">
            <div className="px-8 py-6 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
              <div>
                <h3 className="text-[20px] font-extrabold text-[#1f2937] tracking-tight">{activeCategory || "Menu Items"}</h3>
                <p className="text-[13px] text-[#9ca3af] font-medium mt-1">Manage items within this category</p>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f3f4f6] bg-[#fafaf9]">
                    <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase w-[50%]">Item Details</th>
                    <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase">Price</th>
                    <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase">Status</th>
                    <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="py-8 text-center text-gray-500 text-[14px] font-semibold">Loading items...</td></tr>
                  ) : displayedItems.length === 0 ? (
                    <tr><td colSpan="4" className="py-12 text-center text-gray-500"><div className="text-[15px] font-bold text-[#1f2937]">No items found.</div></td></tr>
                  ) : (
                    displayedItems.map((item) => (
                      <tr key={item.id} className="border-b last:border-b-0 border-[#f3f4f6] hover:bg-[#fafaf9] transition-colors group">
                        <td className="py-4 px-8">
                          <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                              <img src={getImageUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-cover"/>
                            </div>
                            <div>
                              <div className="font-bold text-[#1f2937] text-[15px]">{item.name}</div>
                              <div className="text-[13px] text-[#6b7280] mt-0.5 line-clamp-1">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-8"><span className="font-extrabold text-[#1f2937] text-[15px]">${parseFloat(item.price).toFixed(2)}</span></td>
                        <td className="py-4 px-8">
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-sm ${item.available ? "bg-green-50 text-[#10b981]" : "bg-gray-100 text-[#6b7280]"}`}>{item.available ? "AVAILABLE" : "SOLD OUT"}</span>
                            <div onClick={() => handleToggleAvailability(item)} className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${item.available ? "bg-[#10b981]" : "bg-gray-200"}`}><div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${item.available ? "translate-x-4" : "translate-x-0"}`}></div></div>
                          </div>
                        </td>
                        <td className="py-4 px-8">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9ca3af] hover:text-[#d05322] hover:bg-[#d05322]/10"><Edit2 size={16} strokeWidth={2.5}/></button>
                            <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9ca3af] hover:text-red-500 hover:bg-red-50"><Trash2 size={16} strokeWidth={2.5}/></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showCategoryModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-[20px] font-extrabold text-[#1f2937] tracking-tight">Add Category</h2>
                 <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-[#d05322]"><X size={20} strokeWidth={2.5}/></button>
              </div>
              <form onSubmit={handleAddCategorySubmit}>
                <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g. Artisanal Starters" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[14px] font-semibold outline-none transition-all mb-6" autoFocus required />
                <button type="submit" className="w-full rounded-xl bg-[#d05322] hover:bg-[#b84318] py-3 text-[13px] font-extrabold text-white tracking-widest uppercase transition-colors shadow-md">Save Category</button>
              </form>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl p-8 border border-gray-100 max-h-[90vh] overflow-y-auto">
              <h2 className="text-[24px] font-extrabold text-[#1f2937] tracking-tight mb-6">{editingItem ? "Edit Item" : "Add New Item"}</h2>
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div><label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">Item Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[14px] font-semibold" required /></div>
                <div><label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[14px] font-semibold" required /></div>
                <div className="grid grid-cols-2 gap-5">
                  <div><label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">Category</label><select name="category" value={formData.category} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[14px] font-semibold bg-white" required><option value="" disabled>Select a category</option>{categories.map(cat => (<option key={cat.name} value={cat.name}>{cat.name}</option>))}</select></div>
                  <div><label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">Price ($)</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" min="0" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[14px] font-semibold" required /></div>
                </div>
                <div><label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">Item Image</label><input type="file" onChange={handleImageChange} accept="image/*" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-[13px] font-semibold" /></div>
                <label className="flex items-center gap-3 cursor-pointer mt-2 w-max p-2 rounded-lg hover:bg-gray-50"><div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${formData.available ? "bg-[#d05322]" : "bg-gray-300"}`}><div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${formData.available ? "translate-x-4" : "translate-x-0"}`}/></div><input type="checkbox" name="available" checked={formData.available} onChange={handleInputChange} className="hidden" /><span className="text-[13px] font-bold text-[#1f2937]">Item is available</span></label>
                <div className="mt-8 flex gap-4 pt-4 border-t border-gray-100"><button type="submit" className="flex-1 rounded-xl bg-[#d05322] py-3.5 text-[13px] font-extrabold text-white tracking-widest uppercase shadow-md">SAVE</button><button type="button" onClick={resetForm} className="flex-1 rounded-xl border border-gray-300 bg-white py-3.5 text-[13px] font-extrabold tracking-widest uppercase">CANCEL</button></div>
              </form>
            </div>
          </div>
        )}

        <footer className="mt-auto pt-8 pb-8 border-t border-[#f3f4f6] flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em]">© 2026 DIGITAL MAITRE D' • HIGH CULINARY LOGISTICS</p>
        </footer>
      </div>
    </div>
  );
}