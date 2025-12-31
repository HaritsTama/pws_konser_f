'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="mb-8"
    >
      <div className="relative max-w-2xl mx-auto">
        <div className="relative border-2 border-dashed border-perforation bg-paper p-4 ticket-shadow">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-dashed border-perforation">
            <div className="w-2 h-2 rounded-full bg-stamp-red"></div>
            <span className="text-xs font-bold tracking-wider opacity-60">SEARCH SYSTEM</span>
          </div>

          <div className="relative flex items-center gap-2">
            <FiSearch className="absolute left-3 text-perforation" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter concert name or location..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-dashed border-perforation font-mono text-sm focus:outline-none focus:border-ink"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-ink text-paper font-bold tracking-wider hover:bg-stamp-red transition-colors"
            >
              SEARCH
            </motion.button>
          </div>

          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-ink"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-ink"></div>
        </div>
      </div>
    </motion.form>
  );
}