'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getConcertById } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

export default function ConcertDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [concert, setConcert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchConcert();
  }, [params.id, user, router]);

  const fetchConcert = async () => {
    try {
      const data = await getConcertById(params.id);
      setConcert(data);
    } catch (error) {
      console.error('Failed to fetch concert:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin w-12 h-12 border-4 border-dashed border-perforation border-t-stamp-red rounded-full"></div>
      </div>
    );
  }

  if (!concert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Concert not found</p>
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-ink text-paper font-bold">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-4 border-dashed border-perforation bg-paper p-8 ticket-shadow"
      >
        <div className="mb-8">
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="inline-block px-4 py-2 bg-stamp-red text-paper text-xs font-bold tracking-widest mb-4"
          >
            ★ EVENT DETAILS ★
          </motion.div>
          
          <h1 className="text-5xl font-bold mb-4">{concert.name}</h1>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6 font-mono text-sm">
            <div className="space-y-2">
              <div className="flex gap-4">
                <span className="opacity-60 font-bold">VENUE:</span>
                <span>{concert.location}</span>
              </div>
              <div className="flex gap-4">
                <span className="opacity-60 font-bold">DATE:</span>
                <span>{new Date(concert.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex gap-4">
                <span className="opacity-60 font-bold">TIME:</span>
                <span>{concert.time}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-4">
                <span className="opacity-60 font-bold">ORGANIZER:</span>
                <span>{concert.organizer_name}</span>
              </div>
              <div className="flex gap-4">
                <span className="opacity-60 font-bold">CONTACT:</span>
                <span>{concert.organizer_phone}</span>
              </div>
            </div>
          </div>

          {concert.description && (
            <div className="border-l-4 border-stamp-red pl-4">
              <p className="opacity-80">{concert.description}</p>
            </div>
          )}
        </div>

        <div className="perforation-line my-8"></div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Tickets</h2>
          
          <div className="grid gap-4">
            {concert.ticket_categories && concert.ticket_categories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ x: 4 }}
                className="border-2 border-dashed border-perforation p-6 bg-white relative overflow-hidden"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{category.category_name}</h3>
                    <div className="flex items-baseline gap-4">
                      <span className="text-3xl font-bold text-stamp-red">
                        Rp {category.selling_price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-sm opacity-60 line-through">
                        Rp {category.base_price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-sm font-mono mt-2 opacity-60">
                      Available: {category.available_quantity} tickets
                    </p>
                  </div>

                  {category.available_quantity > 0 ? (
                    <Link href={`/booking/${concert.id}?category=${category.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-ink text-paper font-bold tracking-wider hover:bg-stamp-red transition-colors"
                      >
                        BUY NOW
                      </motion.button>
                    </Link>
                  ) : (
                    <div className="px-8 py-4 bg-gray-400 text-paper font-bold tracking-wider">
                      SOLD OUT
                    </div>
                  )}
                </div>

                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-paper border-2 border-perforation"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-paper border-2 border-perforation"></div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="perforation-line my-8"></div>

        <Link href="/dashboard">
          <motion.button
            whileHover={{ x: -4 }}
            className="px-6 py-3 border-2 border-dashed border-perforation hover:bg-ink hover:text-paper transition-all font-bold"
          >
            ← BACK TO CONCERTS
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}