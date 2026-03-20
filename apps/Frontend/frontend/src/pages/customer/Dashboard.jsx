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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Digital Maître D'</h1>
        <button onClick={logoutUser} className="text-brand-orange font-semibold hover:underline">Logout</button>
      </div>
      
      <h2 className="text-4xl font-bold mb-2">Curated Dining,</h2>
      <h2 className="text-4xl font-bold text-brand-orange mb-8">Delivered to You.</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow p-4">
            {/* If your spring boot app serves images, point to localhost:8082 here */}
            <div className="h-40 bg-gray-200 rounded-xl mb-4 overflow-hidden">
               {item.imageUrl && <img src={`http://localhost:8082${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover"/>}
            </div>
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-brand-orange">{formatCurrency(item.price)}</span>
              <button className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-bold">Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}