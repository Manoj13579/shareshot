import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUserAuth } from '@/context/userAuthContext';


const  Navbar = () => {

  const { user } = useUserAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <nav className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div onClick={() => navigate('/')} className="flex-shrink-0 text-xl font-bold cursor-pointer">
            Shareshot
          </div>

          {/* Desktop Links */}
          {!user && (
            
          <div className="hidden md:flex space-x-4">
            <a href="/signup" className="hover:text-gray-400">Signup</a>
            <a href="/login" className="hover:text-gray-400">Login</a>
          </div>
          )}

          {/* Mobile menu button */}
          {!user && (
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-white focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>)}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          <a href="/signup" className="block text-white hover:text-gray-400">Signup</a>
          <a href="/login" className="block text-white hover:text-gray-400">Login</a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;