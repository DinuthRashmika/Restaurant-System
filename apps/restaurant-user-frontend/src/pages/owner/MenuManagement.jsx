import { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
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
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    available: true
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await getAllMenuItems();
      if (response.success) {
        setMenuItems(response.data);
      }
    } catch (err) {
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

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

      if (response.success) {
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
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await deleteMenuItem(id);
      if (response.success) {
        fetchMenuItems();
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
      category: "",
      price: "",
      available: true
    });
    setImageFile(null);
    setError("");
  };

  const categories = [
    "Signature Mains",
    "Garden Fresh",
    "Artisan Breads",
    "Sweet Endings"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Topbar />

        {/* Header */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-sm text-gray-500">Manage your restaurant's menu items</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
          >
            + Add New Item
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex gap-6 border-b border-gray-200">
          <button className="border-b-2 border-orange-600 pb-2 font-semibold text-orange-600">
            All Items
          </button>
          {categories.map(cat => (
            <button key={cat} className="pb-2 text-gray-500 hover:text-gray-700">
              {cat}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-orange-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-orange-500 focus:bg-white"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-orange-500 focus:bg-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-orange-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                    Item Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600"
                  />
                  <span className="text-sm text-gray-700">Available for ordering</span>
                </label>

                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-orange-600 py-2 font-semibold text-white hover:bg-orange-700"
                  >
                    {editingItem ? "Update Item" : "Create Item"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-lg border border-gray-300 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        {loading ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 animate-pulse rounded-xl bg-gray-200"></div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4">
                {item.imageUrl && (
                  <img
                    src={`http://localhost:8082${item.imageUrl}`}
                    alt={item.name}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                )}
                <div className="mt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <span className={`text-sm font-semibold ${
                      item.available ? "text-green-600" : "text-red-600"
                    }`}>
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <p className="mt-3 text-lg font-bold text-orange-600">${item.price.toFixed(2)}</p>
                  
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}