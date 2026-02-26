import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Zap, ShieldCheck, Menu, X } from 'lucide-react'; 

// Assets
import futsal1 from '../assets/futsal1.jpg';
import futsal2 from '../assets/futsal2.jpg';
import futsal3 from '../assets/futsal3.jpg';
import futsal4 from '../assets/futsal4.jpg';
import Logo from '../assets/Logo.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 overflow-x-hidden">
      
      {/* --- Mobile Sidebar Overlay --- */}
      <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}>
        <div 
          className={`absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-8 transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-12">
            <img src={Logo} alt="Logo" className="w-10 h-10" />
            <button onClick={toggleMenu} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            <button onClick={() => navigate('/login')} className="block w-full text-left text-2xl font-black text-slate-800 hover:text-emerald-600">Explore</button>
            <button onClick={() => navigate('/login')} className="block w-full text-left text-2xl font-black text-slate-800 hover:text-emerald-600">Bookings</button>
            <button onClick={() => navigate('/login')} className="block w-full text-left text-2xl font-black text-slate-800 hover:text-emerald-600">Sign In</button>
            <hr className="border-slate-100 my-8" />
            <button 
              onClick={() => navigate('/login')} 
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* --- Navigation Bar --- */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 p-1">
            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-800 uppercase">
            Futsal<span className="text-emerald-600">Connect</span>
          </span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate('/login')} className="font-bold text-slate-500 hover:text-emerald-600 transition-colors">Find Pitch</button>
          <button onClick={() => navigate('/login')} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
            Sign In
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 bg-slate-50 rounded-xl" onClick={toggleMenu}>
          <Menu size={24} className="text-slate-800" />
        </button>
      </nav>

      {/* --- Hero Section --- */}
      <header className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} space-y-8`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]">
            <Zap size={14} className="fill-emerald-600" />
            Live Slot Availability
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] text-slate-900 tracking-tighter">
            Play More. <br />
            <span className="text-emerald-600">Wait Less.</span>
          </h1>
          
          <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
            The city's most advanced futsal booking system. Find verified grounds, check live schedules, and secure your slot in seconds.
          </p>

          <button 
            onClick={() => navigate('/login')}
            className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-emerald-200 active:scale-95 w-full sm:w-fit"
          >
            Explore Now
            <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
          </button>
        </div>

        {/* Right Content - Image Grid */}
        <div className={`relative grid grid-cols-2 gap-4 h-full transition-all duration-1000 delay-300 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="space-y-4 pt-12">
            <div className="group overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white rotate-[-2deg] hover:rotate-0 transition-all duration-500">
              <img src={futsal1} alt="Pitch" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="group overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white">
              <img src={futsal2} alt="Arena" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="group overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white">
              <img src={futsal3} alt="Game" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="group overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white rotate-[2deg] hover:rotate-0 transition-all duration-500">
              <img src={futsal4} alt="Turf" className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/20 blur-[100px] -z-10 rounded-full"></div>
        </div>
      </header>

      {/* --- Features Grid --- */}
      <div className="bg-slate-50 py-24 rounded-[4rem] mx-4 mb-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left">
          <Feature 
            icon={<Calendar className="text-emerald-600" size={32} />}
            title="Live Scheduling"
            desc="No more calling. View real-time availability and book your slot instantly."
          />
          <Feature 
            icon={<MapPin className="text-emerald-600" size={32} />}
            title="Nearby Arenas"
            desc="Find the best grounds in your local area with accurate maps and details."
          />
          <Feature 
            icon={<ShieldCheck className="text-emerald-600" size={32} />}
            title="Verified Quality"
            desc="Every pitch on our platform is hand-verified for surface quality and amenities."
          />
        </div>
      </div>

      <footer className="py-12 text-center border-t border-slate-100 mx-8">
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
          © 2026 FutsalConnect Platform • Crafted for Champions
        </p>
      </footer>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="space-y-4 p-4">
    <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto md:mx-0 border border-slate-100">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-800">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;