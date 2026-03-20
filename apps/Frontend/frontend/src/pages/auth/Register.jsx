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
    role: 'CUSTOMER' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Sending data to Spring Boot backend
      const response = await register(formData);
      if (response.success) {
        loginUser(response.data); // Log them in immediately after register
      }
    } catch (err) {
      // Friendly error handling if the backend is turned off
      if (err.message === 'Network Error') {
        setError('Cannot connect to server. Please ensure your Spring Boot user-service is running on port 8081.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaeaea] p-4">
      <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-brand-orange italic mb-4">Digital Maître D'</h1>
          <h2 className="text-3xl font-extrabold text-brand-dark mb-2">Create an account</h2>
          <p className="text-gray-500 text-sm">Please enter your details to get started.</p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm text-center border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              placeholder="Maître D'John Doe" 
              required
              className="w-full bg-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
              value={formData.fullName} 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="john@maitred.com" 
              required
              className="w-full bg-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
              <input 
                type="text" 
                placeholder="+1 (555) 000-0000" 
                required
                className="w-full bg-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full bg-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-2">Account Type</label>
            <select 
              className="w-full bg-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all appearance-none cursor-pointer font-medium"
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="CUSTOMER">Dining Customer</option>
              <option value="OWNER">Restaurant Owner</option>
            </select>
          </div>

          <div className="flex items-start pt-2 mb-2">
            <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 text-brand-orange rounded border-gray-300 focus:ring-brand-orange" />
            <label htmlFor="terms" className="ml-2 text-xs text-gray-500 font-medium leading-relaxed">
              I agree to the <a href="#" className="text-brand-orange hover:underline font-bold">Terms of Service</a> and <a href="#" className="text-brand-orange hover:underline font-bold">Privacy Policy</a>.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 mt-4 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
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