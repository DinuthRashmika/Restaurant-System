import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { login } from '../../services/authService';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleMode, setRoleMode] = useState('CUSTOMER'); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      
      if (response.success) {
        // STRICT CHECK: Ensure the tab they selected matches their actual database role
        if (response.data.role !== roleMode) {
          setError(`Account mismatch! You are registered as a ${response.data.role}. Please select the correct tab above.`);
          setIsLoading(false);
          return;
        }
        
        // If it matches, log them in!
        loginUser(response.data);
      }
    } catch (err) {
      if (err.message === 'Network Error') {
        setError('Cannot connect to server. Is Spring Boot running?');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaeaea] p-4">
      <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-brand-orange italic mb-4">Digital Maître D'</h1>
          <h2 className="text-3xl font-extrabold text-brand-dark mb-2">Welcome back</h2>
          <p className="text-gray-500 text-sm">Please enter your details to sign in</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button 
            type="button"
            onClick={() => { setRoleMode('CUSTOMER'); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${roleMode === 'CUSTOMER' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Customer
          </button>
          <button 
            type="button"
            onClick={() => { setRoleMode('OWNER'); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${roleMode === 'OWNER' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Restaurant Owner
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center border border-red-100 font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" placeholder="name@example.com" required
              className="w-full bg-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
              value={email} onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-bold text-brand-orange hover:underline">Forgot?</a>
            </div>
            <input 
              type="password" placeholder="••••••••" required
              className="w-full bg-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <div className="flex items-center pt-2">
            <input type="checkbox" id="remember" className="w-4 h-4 text-brand-orange rounded border-gray-300 focus:ring-brand-orange" />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600 font-medium">Stay signed in for 30 days</label>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 mt-4 flex justify-center items-center gap-2 disabled:opacity-70">
            {isLoading ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>

        <div className="mt-8 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or continue with</div>
        </div>

        {/* Added type="button" here to prevent form submission! */}
        <div className="flex gap-4 mt-6">
          <button type="button" className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">Google</button>
          <button type="button" className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">Apple</button>
        </div>

        <div className="mt-8 text-center text-sm font-medium text-gray-500">
          New to Digital Maître D'? <Link to="/register" className="text-brand-orange font-bold hover:underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
}