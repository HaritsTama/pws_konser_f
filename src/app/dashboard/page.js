'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllConcerts } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import HeroSection from '../../components/HeroSection';
import TicketCard from '../../components/TicketCard';
import SearchBar from '../../components/SearchBar';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [concerts, setConcerts] = useState([]);
  const [filteredConcerts, setFilteredConcerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchConcerts();
    }
  }, [user, authLoading, router]);

  const fetchConcerts = async () => {
    try {
      const data = await getAllConcerts('approved');
      setConcerts(data);
      setFilteredConcerts(data);
    } catch (error) {
      console.error('Failed to fetch concerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredConcerts(concerts);
      return;
    }
    
    const filtered = concerts.filter(concert =>
      concert.name.toLowerCase().includes(query.toLowerCase()) ||
      concert.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredConcerts(filtered);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin w-12 h-12 border-4 border-dashed border-perforation border-t-stamp-red rounded-full"></div>
          <p className="mt-4 font-mono text-sm">LOADING CONCERTS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {concerts.length > 0 && <HeroSection concert={concerts[0]} />}
      <SearchBar onSearch={handleSearch} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <div className="inline-block border-2 border-dashed border-perforation px-6 py-3 bg-ink text-paper">
          <h2 className="text-2xl font-bold tracking-wider">
            {filteredConcerts.length > 0 ? 'AVAILABLE EVENTS' : 'NO EVENTS FOUND'}
          </h2>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredConcerts.map((concert, index) => (
          <motion.div
            key={concert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TicketCard concert={concert} />
          </motion.div>
        ))}
      </motion.div>

      {filteredConcerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="inline-block border-4 border-dashed border-perforation p-12 bg-paper">
            <div className="text-6xl mb-4">🎵</div>
            <p className="font-bold text-xl mb-2">No concerts available</p>
            <p className="text-sm opacity-60 font-mono">Check back later for new events</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}