import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  return (
    <nav className="flex items-center justify-between py-4">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-italic font-bold text-orange-700 italic">Digital Maître D’</h1>
        <div className="hidden space-x-6 text-sm font-medium text-gray-500 md:flex">
          <Link to="/" className="text-orange-600 border-b-2 border-orange-600">Explore</Link>
          <Link to="/orders" className="hover:text-orange-600">Orders</Link>
          <Link to="/favorites" className="hover:text-orange-600">Favorites</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search dishes..." 
            className="rounded-full bg-gray-100 px-10 py-2 text-sm outline-none w-64 focus:ring-1 focus:ring-orange-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <button className="p-2 text-gray-600">🔔</button>
        <div className="h-8 w-8 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
             {/* User Icon */}
        </div>
      </div>
    </nav>
  );
}