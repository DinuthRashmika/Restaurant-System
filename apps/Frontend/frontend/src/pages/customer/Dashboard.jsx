import { useEffect, useState, useContext } from 'react';
import { getAvailableMenu } from '../../services/menuService';
import { formatCurrency } from '../../utils/formatters';
import { AuthContext } from '../../context/AuthContext';

export default function Dashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const { logoutUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getAvailableMenu();
        if (res.success) setMenuItems(res.data);
      } catch (err) {
        console.error("Failed to fetch menu");
      }
    };
    fetchMenu();
  }, []);

  const categories = [
    { name: 'Pizza', icon: '🍕' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Sushi', icon: '🍣' },
    { name: 'Desserts', icon: '🍰' },
    { name: 'Coffee', icon: '☕' },
    { name: 'Ramen', icon: '🍜' },
    { name: 'Bakery', icon: '🥐' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark pb-20">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-12">
          <h1 className="text-xl font-black text-brand-orange italic tracking-tight">Digital Maître D'</h1>
          <div className="hidden md:flex gap-8 font-bold text-sm text-gray-400">
            <a href="#" className="text-brand-orange border-b-2 border-brand-orange pb-1">Explore</a>
            <a href="#" className="hover:text-gray-800 transition-colors">Orders</a>
            <a href="#" className="hover:text-gray-800 transition-colors">Favorites</a>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <svg className="w-4 h-4 absolute left-4 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search dishes..." 
              className="bg-gray-100 text-sm font-medium rounded-full py-2.5 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
            />
          </div>
          <button className="text-gray-400 hover:text-brand-orange transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200" onClick={logoutUser} title="Click to Logout">
             <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-12">
        
        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="pr-10">
            <h2 className="text-6xl font-extrabold tracking-tight leading-[1.1] mb-2 text-brand-dark">Curated Dining,</h2>
            <h2 className="text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-brand-orange">Delivered to You.</h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed max-w-md">
              Experience restaurant-grade service and flavors from the comfort of your home. Your personal Digital Maître D' is ready.
            </p>
            
            <div className="flex items-center bg-white shadow-xl shadow-gray-200/50 rounded-2xl p-2 border border-gray-100 max-w-lg">
              <div className="pl-4 pr-3 text-brand-orange">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="What are you craving?" 
                className="flex-1 py-3 px-2 outline-none font-medium text-gray-700 placeholder-gray-400"
              />
              <button className="bg-brand-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
                FIND FOOD
              </button>
            </div>
          </div>

          {/* Overlapping Hero Image Design */}
          <div className="relative h-[400px] hidden lg:block">
             <div className="absolute right-0 top-0 w-4/5 h-full bg-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
                {/* Fallback image if backend has no images yet */}
                <img src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1000&auto=format&fit=crop" alt="Hero Dish" className="w-full h-full object-cover opacity-90 mix-blend-overlay" />
             </div>
             {/* Floating Chef's Choice Card */}
             <div className="absolute left-0 bottom-10 bg-white p-6 rounded-2xl shadow-2xl shadow-black/10 max-w-[280px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-brand-orange">★</div>
                  <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Chef's Choice</span>
                </div>
                <h3 className="text-xl font-black mb-2">Truffle Risotto</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">Hand-picked selection for your refined palate today.</p>
             </div>
          </div>
        </div>

        {/* --- CATEGORIES SECTION --- */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-2xl font-extrabold mb-1">Explore Categories</h3>
              <p className="text-sm text-gray-500 font-medium">Finest cuisines curated for you</p>
            </div>
            <a href="#" className="text-brand-orange font-bold text-sm hover:underline">View All →</a>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 cursor-pointer group min-w-[80px]">
                <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl shadow-sm group-hover:bg-brand-orange/10 group-hover:border-brand-orange/30 transition-all">
                  {cat.icon}
                </div>
                <span className="text-sm font-bold text-gray-600 group-hover:text-brand-orange transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- FEATURED SELECTION (DYNAMIC DATA FROM SPRING BOOT) --- */}
        <div>
          <h3 className="text-2xl font-extrabold mb-8">Featured Selection</h3>
          
          {menuItems.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-10 text-center border border-dashed border-gray-200">
               <p className="text-gray-500 font-medium">Connecting to Spring Boot...</p>
               <p className="text-sm text-gray-400 mt-2">Add items in your Owner Dashboard to see them here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LARGE FEATURED ITEM (First item in DB) */}
              <div className="lg:col-span-2 relative h-[450px] rounded-[2rem] overflow-hidden shadow-xl group cursor-pointer">
                <img 
                  src={`http://localhost:8082${menuItems[0]?.imageUrl}`} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop' }}
                  alt={menuItems[0]?.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-6 left-6 bg-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  ✦ Popular Choice
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <h4 className="text-3xl font-black text-white mb-2">{menuItems[0]?.name}</h4>
                  <p className="text-gray-200 line-clamp-2">{menuItems[0]?.description}</p>
                </div>
              </div>

              {/* SMALL LIST ITEMS (Rest of DB) */}
              <div className="flex flex-col gap-6">
                {menuItems.slice(1, 4).map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                      <img 
                        src={`http://localhost:8082${item.imageUrl}`} 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop' }}
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-extrabold text-gray-800 mb-1 line-clamp-1">{item.name}</h5>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-1">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-brand-orange">{formatCurrency(item.price)}</span>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">20 MIN</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </main>

      {/* --- SIMPLE FOOTER --- */}
      <footer className="max-w-7xl mx-auto px-10 mt-24 border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-lg font-black text-brand-orange italic mb-2">Digital Maître D'</h2>
          <p className="text-xs text-gray-500 max-w-sm leading-relaxed">Elevating the at-home dining experience through technology and culinary expertise. We bridge the gap between fine dining and convenience.</p>
          <p className="text-[10px] text-gray-400 mt-6">© 2026 Digital Maître D' Technologies</p>
        </div>
        <div className="flex gap-6 text-xs font-bold text-gray-500">
          <a href="#" className="hover:text-brand-orange cursor-pointer">Privacy Policy</a>
          <a href="#" className="hover:text-brand-orange cursor-pointer">Terms of Service</a>
          <a href="#" className="hover:text-brand-orange cursor-pointer">Partner Support</a>
          <a href="#" className="hover:text-brand-orange cursor-pointer">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}