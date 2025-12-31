'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiHome, FiTag, FiSettings } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-paper border-b-2 border-dashed border-perforation shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/dashboard">
            <motion.div
              whileHover={{ rotate: 2, scale: 1.05 }}
              className="relative"
            >
              <div className="stamp-effect bg-stamp-red text-paper px-6 py-3 font-bold text-xl tracking-wider">
                CONCERT<br/>PASS
              </div>
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-stamp-red rounded-full"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-stamp-red rounded-full"></div>
            </motion.div>
          </Link>

          <div className="flex items-center gap-4">
            <NavTab href="/dashboard" icon={<FiHome />} label="Concerts" />
            <NavTab href="/sell-ticket" icon={<FiTag />} label="Sell Ticket" />
            <NavTab href="/my-bookings" icon={<FiUser />} label="My Tickets" />
            
            {user?.role === 'admin' && (
              <NavTab href="/admin" icon={<FiSettings />} label="Admin" />
            )}

            {user && (
              <motion.div
                whileHover={{ y: -2 }}
                className="relative ml-4 px-4 py-2 bg-ink text-paper border-2 border-dashed border-perforation"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
              >
                <div className="text-xs font-bold tracking-wide">{user.username}</div>
                <div className="text-[10px] opacity-70">{user.role?.toUpperCase()}</div>
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-paper border-2 border-perforation"></div>
              </motion.div>
            )}

            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-3 bg-stamp-red text-paper rounded-sm hover:bg-red-700 transition-colors"
              >
                <FiLogOut size={20} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
      <div className="perforation-line"></div>
    </motion.nav>
  );
}

function NavTab({ href, icon, label }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        className="relative px-4 py-2 border-2 border-dashed border-perforation bg-paper hover:bg-ink hover:text-paper transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-2 font-medium text-sm tracking-wide">
          {icon}
          <span>{label}</span>
        </div>
        <div className="absolute top-0 left-0 w-2 h-2 bg-paper transform -translate-x-1 -translate-y-1 rotate-45"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-paper transform translate-x-1 -translate-y-1 rotate-45"></div>
      </motion.div>
    </Link>
  );
}