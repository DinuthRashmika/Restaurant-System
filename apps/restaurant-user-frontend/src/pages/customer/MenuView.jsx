import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { getAllMenuItems, getMenuItemsByCategory } from "../../services/menuService";
import { useCart } from "../../context/CartContext";

export default function MenuView() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All Delights");
  const [dietaryFilters, setDietaryFilters] = useState([]);
  
  const { cart, addToCart } = useCart();
  
  const categories = [
    "All Delights",
    "Signature Mains",
    "Garden Fresh",
    "Artisan Breads",
    "Sweet Endings"
  ];
  
  const dietaryOptions = ["Veggie", "Gluten-free", "Spicy"];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, selectedCategory, dietaryFilters]);

  const fetchMenuItems = async () => {
    try {
      const response = await getAllMenuItems();
      if (response.success) {
        setMenuItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...menuItems];
    
    // Filter by category
    if (selectedCategory !== "All Delights") {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply dietary filters (simplified - in real app, you'd have dietary tags on items)
    if (dietaryFilters.length > 0) {
      filtered = filtered.filter(item => {
        // This is a simplified example - you'd need dietary fields in your model
        return dietaryFilters.some(filter => 
          item.description.toLowerCase().includes(filter.toLowerCase())
        );
      });
    }
    
    setFilteredItems(filtered);
  };

  const toggleDietaryFilter = (filter) => {
    setDietaryFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Topbar />

        <div className="mt-8 grid gap-8 lg:grid-cols-4">
          {/* Sidebar - Categories & Filters */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              
              <div className="mt-4 space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      selectedCategory === category
                        ? "bg-orange-50 font-semibold text-orange-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  DIETARY FILTERS
                </h3>
                <div className="mt-3 space-y-2">
                  {dietaryOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={dietaryFilters.includes(option)}
                        onChange={() => toggleDietaryFilter(option)}
                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Menu Items */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900">Signature Selections</h2>
            <p className="text-gray-500">Curated with precision, served with passion.</p>

            {loading ? (
              <div className="mt-6 space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-32 animate-pulse rounded-xl bg-gray-200"></div>
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="flex gap-4">
                      {item.imageUrl && (
                        <img
                          src={`http://localhost:8082${item.imageUrl}`}
                          alt={item.name}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xl font-bold text-orange-600">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-bold text-gray-900">Your Selection</h3>
              
              <div className="mt-4 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                {cart.length === 0 && (
                  <p className="text-sm text-gray-500">Your cart is empty</p>
                )}
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between font-bold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <Link
                  to="/checkout"
                  className="mt-4 block w-full rounded-lg bg-orange-600 py-3 text-center font-semibold text-white hover:bg-orange-700"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>Digital Maitre D' Technologies</p>
          <p className="mt-1">Empowering the hospitality experience through fine design and culinary practice.</p>
          <p className="mt-2">© 2024 Digital Maitre D' Technologies. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}