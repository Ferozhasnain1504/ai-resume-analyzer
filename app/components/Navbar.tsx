import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <nav className='navbar'>
        <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
                {/* Simulated Logo icon */}
                <span className="bg-neon-violet w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="bg-black w-2 h-2 rounded-full"></span>
                </span>
                <p className='text-3xl font-display font-bold text-gradient tracking-tight'>CVIQ</p>
            </Link>
        </div>

        <Link to="/upload" className='flex items-center gap-2 bg-dark-200 text-white font-medium px-6 py-2.5 rounded-full border border-white/10 hover:bg-white/10 transition-all'>
            Upload Resume
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
        </Link>
    </nav>
  )
}

export default Navbar