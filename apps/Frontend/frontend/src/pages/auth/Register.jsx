import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { register } from '../../services/authService';
import { Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    phone: '', 
    role: 'CUSTOMER' // Defaults to customer
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await register(formData);
      if (response.success) {
        // Backend returns the registered user data including their new role
        loginUser(response.data); 
      }
    } catch (err) {
      if (err.message === 'Network Error') {
        setError('Cannot connect to server. Please ensure your Spring Boot user-service is running.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaeaea] p-4 py-12">
      <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-brand-orange italic mb-4">Digital Maître D'</h1>
          <h2 className="text-3xl font-extrabold text-brand-dark mb-2">Create an account</h2>
          <p className="text-gray-500 text-sm">Join the exclusive circle of culinary enthusiasts.</p>
        </div>

        {/* Premium Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => setFormData({...formData, role: 'CUSTOMER'})}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.role === 'CUSTOMER' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Dining Customer
          </button>
          <button 
            type="button"
            onClick={() => setFormData({...formData, role: 'OWNER'})}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.role === 'OWNER' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Restaurant Owner
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm text-center border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" placeholder="Maître D'John Doe" required
              className="w-full bg-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
              value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" placeholder="john@maitred.com" required
              className="w-full bg-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
              <input 
                type="text" placeholder="+1 (555) 000" required
                className="w-full bg-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" placeholder="••••••••" required
                className="w-full bg-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex items-start pt-2 mb-2">
            <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 text-brand-orange rounded border-gray-300 focus:ring-brand-orange" />
            <label htmlFor="terms" className="ml-2 text-xs text-gray-500 font-medium leading-relaxed">
              I agree to the <a href="#" className="text-brand-orange hover:underline font-bold">Terms of Service</a> and <a href="#" className="text-brand-orange hover:underline font-bold">Privacy Policy</a>.
            </label>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 mt-4 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? 'Processing...' : 'Create Account →'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-gray-500">
          Already have an account? <Link to="/login" className="text-brand-orange font-bold hover:underline">Log in here</Link>
        </div>
      </div>
    </div>
  );
}