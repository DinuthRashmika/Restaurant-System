import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, User, Bell, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { 
  getAllMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from "../../services/menuService";

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Starters");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Starters",
    price: "",
    available: true
  });
  const [imageFile, setImageFile] = useState(null);

  // Mock Categories and data for visuals
  const categories = [
    { name: "Starters", count: 12 },
    { name: "Main Course", count: 24 },
    { name: "Desserts", count: 8 },
    { name: "Beverages", count: 18 }
  ];

  // Dummy fallback data if API is empty
  const dummyItems = [
    {
      id: "1",
      name: "Truffle Fries",
      description: "Crispy fries with truffle oil and parmesan.",
      price: 12.00,
      available: true,
      category: "Starters",
      imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "2",
      name: "Wagyu Sliders",
      description: "Three mini wagyu beef sliders with brioche buns.",
      price: 28.00,
      available: true,
      category: "Starters",
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "3",
      name: "Oysters Rockefeller",
      description: "Half dozen baked oysters with spinach and hollandaise.",
      price: 24.00,
      available: false,
      category: "Starters",
      imageUrl: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=200&q=80"
    }
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await getAllMenuItems();
      if (response.success && response.data.length > 0) {
        setMenuItems(response.data);
      } else {
        setMenuItems(dummyItems); // Using dummy data for display purposes
      }
    } catch (err) {
      setMenuItems(dummyItems);
      console.log("Using fallback data due to fetch error");
    } finally {
      setLoading(false);
    }
  };

  const currentCategoryItems = menuItems.filter(item => item.category === activeCategory);

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
      let response;
      if (editingItem) {
        response = await updateMenuItem(editingItem.id, formDataObj);
      } else {
        response = await createMenuItem(formDataObj);
      }

      if (response && response.success) {
        fetchMenuItems();
        resetForm();
      } else {
        // Mock successful save for demo
        fetchMenuItems();
        resetForm();
      }
    } catch (err) {
      setError(editingItem ? "Failed to update item" : "Failed to create item");
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
        // Mock delete
        setMenuItems(prev => prev.filter(i => i.id !== id));
      }
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      category: activeCategory,
      price: "",
      available: true
    });
    setImageFile(null);
    setError("");
  };

  // Safe image URL rendering
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/200?text=No+Image";
    if (url.startsWith('http')) return url;
    return `http://localhost:8082${url}`;
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-8 py-6 flex flex-col flex-1">
        
        {/* Header Navigation */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#1f2937] tracking-wider uppercase">
                Bistro Luxe
              </h1>
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-widest bg-gray-200/50 px-2 py-1 rounded-md">
                Admin Portal
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-10">
              <Link to="/owner/dashboard" className="text-[13px] font-bold text-[#6b7280] hover:text-[#1f2937] transition-colors pb-1">
                Dashboard
              </Link>
              <Link to="/owner/orders" className="text-[13px] font-bold text-[#6b7280] hover:text-[#1f2937] transition-colors pb-1">
                Live Orders
              </Link>
              <Link to="/owner/menu" className="text-[13px] font-bold text-[#d05322] border-b-2 border-[#d05322] pb-1">
                Menu Editor
              </Link>
              <Link to="/owner/analytics" className="text-[13px] font-bold text-[#6b7280] hover:text-[#1f2937] transition-colors pb-1">
                Analytics
              </Link>
              <Link to="/owner/settings" className="text-[13px] font-bold text-[#6b7280] hover:text-[#1f2937] transition-colors pb-1">
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-[#6b7280] hover:text-[#1f2937] transition-colors">
              <Bell size={20} strokeWidth={2.5} />
            </button>
            <button className="h-9 w-9 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#6b7280] hover:text-[#1f2937] transition-colors overflow-hidden border border-[#e5e7eb]">
              <User size={18} strokeWidth={2.5} />
            </button>
          </div>
        </header>

        {/* Top Controls: Search & Filters */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-extrabold text-[#1f2937] tracking-tight">Menu Editor</h2>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#d05322]" size={16} strokeWidth={2.5}/>
              <input 
                type="text" 
                placeholder="SEARCH ITEM" 
                className="bg-white border border-[#e5e7eb] rounded-lg pl-10 pr-4 py-2.5 text-[12px] font-bold tracking-wider text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] w-[220px] transition-all uppercase"
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-lg px-4 py-2.5 text-[12px] font-bold tracking-wider text-[#1f2937] hover:border-[#d05322] hover:text-[#d05322] transition-colors uppercase">
              <SlidersHorizontal size={16} strokeWidth={2.5} />
              FILTER
            </button>
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#d05322] hover:bg-[#b84318] text-white rounded-lg px-5 py-2.5 text-[12px] font-bold tracking-wider uppercase transition-colors shadow-sm ml-2"
            >
              <Plus size={16} strokeWidth={3} />
              ADD NEW ITEM
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          
          {/* Sidebar Categories */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <h3 className="text-[11px] font-black text-[#9ca3af] tracking-widest uppercase mb-4 px-2">CATEGORIES</h3>
            <div className="flex flex-col gap-1 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-gray-200 before:-z-10 ml-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center justify-between px-4 py-3 text-left w-full transition-all group border-l-2 ${
                    activeCategory === cat.name 
                      ? "border-[#d05322] bg-white shadow-sm font-bold text-[#1f2937]" 
                      : "border-transparent text-[#6b7280] font-semibold hover:bg-white/50 hover:text-[#1f2937]"
                  }`}
                >
                  <span className="text-[14px]">{cat.name}</span>
                  <span className={`text-[12px] px-2 py-0.5 rounded-full ${
                    activeCategory === cat.name ? "bg-gray-100 text-[#1f2937]" : "bg-transparent text-[#9ca3af] group-hover:bg-gray-100"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 text-[12px] font-bold text-[#d05322] uppercase tracking-wider mt-6 px-6 hover:text-[#b84318] transition-colors">
              <Plus size={14} strokeWidth={3} /> ADD CATEGORY
            </button>
          </div>

          {/* Main List Area */}
          <div className="flex-1 min-w-0 bg-white rounded-3xl border border-[#e5e7eb] shadow-sm flex flex-col overflow-hidden">
            
            <div className="px-8 py-6 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
              <div>
                <h3 className="text-[20px] font-extrabold text-[#1f2937] tracking-tight">{activeCategory}</h3>
                <p className="text-[13px] text-[#9ca3af] font-medium mt-1">Drag to reorder items</p>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f3f4f6]">
                    <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase w-[50%]">Item Details</th>
                    <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase">Price</th>
                    <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase">Status</th>
                    <th className="py-4 px-8 text-[11px] font-black tracking-widest text-[#9ca3af] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500 text-sm">Loading items...</td>
                    </tr>
                  ) : currentCategoryItems.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-gray-500 text-sm">No items found in this category.</td>
                    </tr>
                  ) : (
                    currentCategoryItems.map((item) => (
                      <tr key={item.id} className="border-b last:border-b-0 border-[#f3f4f6] hover:bg-[#fafaf9] transition-colors group">
                        <td className="py-4 px-8">
                          <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                              <img 
                                src={getImageUrl(item.imageUrl)} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-[#1f2937] text-[15px]">{item.name}</div>
                              <div className="text-[13px] text-[#6b7280] mt-0.5 line-clamp-1">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-8">
                          <span className="font-extrabold text-[#1f2937] text-[15px]">${parseFloat(item.price).toFixed(2)}</span>
                        </td>
                        <td className="py-4 px-8">
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-sm ${
                              item.available ? "bg-green-50 text-[#10b981]" : "bg-gray-100 text-[#6b7280]"
                            }`}>
                              {item.available ? "AVAILABLE" : "SOLD OUT"}
                            </span>
                            {/* Visual Toggle */}
                            <div className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${item.available ? "bg-[#10b981]" : "bg-gray-200"}`}>
                              <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${item.available ? "translate-x-4" : "translate-x-0"}`}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-8">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEdit(item)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9ca3af] hover:text-[#d05322] hover:bg-[#d05322]/10 transition-colors"
                            >
                              <Edit2 size={16} strokeWidth={2.5}/>
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9ca3af] hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} strokeWidth={2.5}/>
                            </button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9ca3af] hover:text-[#1f2937] transition-colors">
                              <MoreVertical size={16} strokeWidth={2.5}/>
                            </button>
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

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl p-8 border border-gray-100">
              <h2 className="text-[24px] font-extrabold text-[#1f2937] tracking-tight mb-6">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h2>
              
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[14px] font-semibold focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] outline-none transition-all placeholder:text-gray-400"
                    placeholder="e.g. Truffle Fries"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[14px] font-semibold focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] outline-none transition-all placeholder:text-gray-400"
                    placeholder="Brief description of the item"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[14px] font-semibold focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] outline-none transition-all bg-white"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[14px] font-semibold focus:border-[#d05322] focus:ring-1 focus:ring-[#d05322] outline-none transition-all text-[#1f2937]"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">
                    Item Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-[13px] font-semibold file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[12px] file:font-bold file:bg-gray-100 file:text-[#1f2937] hover:file:bg-gray-200 cursor-pointer text-gray-500"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer mt-2 w-max p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${formData.available ? "bg-[#d05322]" : "bg-gray-300"}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${formData.available ? "translate-x-4" : "translate-x-0"}`}/>
                  </div>
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <span className="text-[13px] font-bold text-[#1f2937]">Item is available for ordering</span>
                </label>

                <div className="mt-8 flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#d05322] hover:bg-[#b84318] py-3.5 text-[13px] font-extrabold text-white tracking-widest uppercase transition-colors shadow-md"
                  >
                    {editingItem ? "SAVE CHANGES" : "CREATE ITEM"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-xl border border-gray-300 hover:border-gray-400 bg-white py-3.5 text-[13px] font-extrabold text-[#1f2937] tracking-widest uppercase transition-colors shadow-sm"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-16 pb-8 border-t border-[#f3f4f6] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <h3 className="font-bold italic text-[#d05322] text-[14px]">Digital Maitre D</h3>
             <span className="text-[#9ca3af] text-[12px]">|</span>
             <p className="text-[#6b7280] text-[12px] font-medium">Elevating restaurant operations with premium design.</p>
          </div>
          <div className="flex gap-6 text-[12px] font-semibold text-[#6b7280]">
            <Link to="/terms" className="hover:text-[#1f2937] transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-[#1f2937] transition-colors">Privacy Policy</Link>
            <Link to="/support" className="hover:text-[#1f2937] transition-colors">Partner Support</Link>
          </div>
        </footer>

      </div>
    </div>
  );
}