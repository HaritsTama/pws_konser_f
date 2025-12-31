'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getUserBookings } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function MyBookings() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, [user, router]);

  const fetchBookings = async () => {
    try {
      const data = await getUserBookings(user.id);
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="inline-block border-2 border-dashed border-perforation px-6 py-3 bg-ink text-paper">
          <h1 className="text-3xl font-bold tracking-wider">MY TICKETS</h1>
        </div>
      </motion.div>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="inline-block border-4 border-dashed border-perforation p-12 bg-paper">
            <div className="text-6xl mb-4">🎫</div>
            <p className="font-bold text-xl mb-2">No bookings yet</p>
            <p className="text-sm opacity-60 font-mono mb-6">Start booking your first concert!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-ink text-paper font-bold hover:bg-stamp-red transition-colors"
            >
              BROWSE CONCERTS
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-4 border-dashed border-perforation bg-paper p-6 ticket-shadow relative overflow-hidden"
            >
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-paper border-2 border-perforation z-10"></div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-paper border-2 border-perforation z-10"></div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="inline-block px-3 py-1 bg-stamp-red text-paper text-xs font-bold tracking-widest mb-2">
                        {booking.status.toUpperCase()}
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{booking.concert_name}</h2>
                      <div className="space-y-1 font-mono text-sm">
                        <div className="flex gap-4">
                          <span className="opacity-60">VENUE:</span>
                          <span className="font-semibold">{booking.location}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="opacity-60">DATE:</span>
                          <span className="font-semibold">{new Date(booking.date).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="opacity-60">TIME:</span>
                          <span className="font-semibold">{booking.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="perforation-line my-4"></div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold opacity-60">TICKET HOLDERS:</div>
                    {booking.attendees && booking.attendees.map((attendee, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white border border-dashed border-perforation text-sm font-mono">
                        <span className="font-semibold">{attendee.name}</span>
                        <span className="opacity-60">{attendee.phone}</span>
                        <span className="text-xs bg-ink text-paper px-2 py-1">{attendee.ticket_number}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-l-2 border-dashed border-perforation pl-6">
                  <div className="text-xs font-bold mb-2 opacity-60">PAYMENT DETAILS</div>
                  <div className="space-y-2 font-mono text-sm mb-4">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-bold">{booking.category_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-bold">{booking.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="font-bold capitalize">{booking.payment_method.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-dashed border-perforation pt-4 mb-4">
                    <div className="text-xs opacity-60 mb-1">TOTAL PAID</div>
                    <div className="text-2xl font-bold text-stamp-red">
                      Rp {booking.total_price.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div className="flex gap-[1px] h-12 mb-2">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-ink flex-1"
                        style={{
                          opacity: Math.random() > 0.3 ? 1 : 0,
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-[9px] font-mono opacity-60">
                    ORDER: #{booking.id}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}