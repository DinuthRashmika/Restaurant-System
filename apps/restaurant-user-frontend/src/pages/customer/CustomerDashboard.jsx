import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(false);
  // Mock data for the category icons (use Lucide-react or similar for real icons)
  const categories = [
    { name: "Pizza", icon: "🍕" },
    { name: "Burgers", icon: "🍔" },
    { name: "Sushi", icon: "🍣" },
    { name: "Desserts", icon: "🍰" },
    { name: "Coffee", icon: "☕" },
    { name: "Ramen", icon: "🍜" },
    { name: "Bakery", icon: "🥐" },
    { name: "Salads", icon: "🥗" },
    { name: "Seafood", icon: "🦞" },
    { name: "Mexican", icon: "🌮" },
  ];

  // Featured restaurants/items data
  const featuredItems = [
    { 
      name: "Smokey Joe's BBQ", 
      desc: "Prime Cuts & Oak Smoke", 
      price: 24.50, 
      time: "15 MIN",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Green Garden Bowls", 
      desc: "Organic & Sustenance-first", 
      price: 14.00, 
      time: "12 MIN",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Umami Sushi Bar", 
      desc: "Daily Fresh Catch • Chef Sourced", 
      price: 32.00, 
      time: "20 MIN",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Burger & Co", 
      desc: "Gourmet Patties • Artisan Buns", 
      price: 18.50, 
      time: "18 MIN",
      image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Popular dishes data
  const popularDishes = [
    { name: "Margherita Pizza", restaurant: "Pizza Heaven", price: 16.99, rating: 4.8, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80" },
    { name: "Spicy Ramen", restaurant: "Ramen House", price: 14.99, rating: 4.7, image: "https://images.unsplash.com/photo-1557872943-16a5ac26437a?auto=format&fit=crop&w=800&q=80" },
    { name: "Chocolate Lava Cake", restaurant: "Sweet Dreams", price: 8.99, rating: 4.9, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80" },
    { name: "California Roll", restaurant: "Sushi Master", price: 12.99, rating: 4.6, image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Full width top bar */}
      <Topbar />
      
      {/* Main content with max-width container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center mb-16">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Curated Dining, <br />
              <span className="text-orange-600">Delivered to You.</span>
            </h1>
            <p className="mt-4 text-gray-500 max-w-md text-sm sm:text-base">
              Experience restaurant-grade service and flavors from the comfort of your home. Your personal Digital Maître D’ is ready.
            </p>
            <div className="mt-8 flex items-center shadow-xl rounded-full border border-gray-100 p-1 max-w-md">
              <span className="pl-4 text-orange-600">🍴</span>
              <input 
                type="text" 
                placeholder="What are you craving?" 
                className="flex-1 px-4 py-3 outline-none bg-transparent text-sm"
              />
              <button className="rounded-full bg-orange-600 px-6 sm:px-8 py-3 text-xs font-bold text-white transition hover:bg-orange-700 whitespace-nowrap">
                FIND FOOD
              </button>
            </div>
          </div>

          {/* Right Side: Hero Image & Floating Card */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=1200&q=80" 
              alt="Truffle Risotto" 
              className="rounded-3xl shadow-2xl object-cover h-[300px] sm:h-[400px] w-full"
            />
            {/* Floating Chef's Choice Card */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md border border-white/20 max-w-[240px]">
              <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                <span className="rounded-full bg-orange-100 p-1">⭐</span> Chef's Choice
              </div>
              <h4 className="mt-1 font-bold text-gray-900">Truffle Risotto</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                Hand-picked selection for your refined palate today.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Explore Categories</h2>
              <p className="text-sm text-gray-400">Finest cuisines curated for you</p>
            </div>
            <button className="text-xs font-bold text-orange-600 hover:underline">View All →</button>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <div key={cat.name} className="flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-2xl transition-all duration-300 group-hover:bg-orange-50 group-hover:shadow-md group-hover:scale-110 border border-gray-100">
                  {cat.icon}
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-orange-600 transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Selection */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Featured Selection</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Big Feature (Pizza) */}
            <div className="relative group overflow-hidden rounded-3xl shadow-sm border border-gray-100 h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="Pizza" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 left-4 rounded-full bg-orange-500/90 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                ✦ POPULAR CHOICE
              </div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-bold text-lg">Margherita Pizza</h3>
                <p className="text-sm text-gray-200">Classic Italian • 25 min</p>
              </div>
            </div>

            {/* List Features */}
            <div className="space-y-4">
              {featuredItems.map((item) => (
                <div 
                  key={item.name} 
                  className="flex items-center gap-4 rounded-2xl bg-white p-3 border border-transparent hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="h-24 w-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
                      <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full font-bold text-gray-600">
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Dishes Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Popular Dishes</h2>
            <button className="text-xs font-bold text-orange-600 hover:underline">View All →</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish) => (
              <div 
                key={dish.name} 
                className="group cursor-pointer rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 truncate">{dish.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{dish.restaurant}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-orange-600">${dish.price.toFixed(2)}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-xs font-bold text-gray-600">{dish.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mb-16 bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Get Exclusive Offers
            </h2>
            <p className="text-gray-500 mb-6">
              Subscribe to our newsletter and receive special deals and updates
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-orange-400"
              />
              <button className="px-6 py-3 bg-orange-600 text-white rounded-full font-bold text-sm hover:bg-orange-700 transition whitespace-nowrap">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">About Us</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-orange-600 cursor-pointer">Our Story</li>
                <li className="hover:text-orange-600 cursor-pointer">Careers</li>
                <li className="hover:text-orange-600 cursor-pointer">Press</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-orange-600 cursor-pointer">Help Center</li>
                <li className="hover:text-orange-600 cursor-pointer">Contact Us</li>
                <li className="hover:text-orange-600 cursor-pointer">FAQs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-orange-600 cursor-pointer">Terms of Service</li>
                <li className="hover:text-orange-600 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-orange-600 cursor-pointer">Cookie Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <span className="text-2xl cursor-pointer hover:text-orange-600">📱</span>
                <span className="text-2xl cursor-pointer hover:text-orange-600">📘</span>
                <span className="text-2xl cursor-pointer hover:text-orange-600">📷</span>
                <span className="text-2xl cursor-pointer hover:text-orange-600">🐦</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
            © 2024 FoodDelivery. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}