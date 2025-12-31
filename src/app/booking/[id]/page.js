'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getConcertById, createBooking } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [concert, setConcert] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [attendees, setAttendees] = useState([{ name: '', phone: '' }]);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchConcert();
  }, [params.id, user, router]);

  useEffect(() => {
    const categoryId = searchParams.get('category');
    if (concert && categoryId) {
      const category = concert.ticket_categories.find(c => c.id === parseInt(categoryId));
      setSelectedCategory(category);
    }
  }, [concert, searchParams]);

  useEffect(() => {
    setAttendees(Array(quantity).fill(null).map(() => ({ name: '', phone: '' })));
  }, [quantity]);

  const fetchConcert = async () => {
    try {
      const data = await getConcertById(params.id);
      setConcert(data);
    } catch (error) {
      console.error('Failed to fetch concert:', error);
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      await createBooking(user.id, {
        concert_id: concert.id,
        ticket_category_id: selectedCategory.id,
        quantity,
        payment_method: paymentMethod,
        attendees
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/my-bookings');
      }, 3000);
    } catch (error) {
      alert('Booking failed: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (!concert || !selectedCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin w-12 h-12 border-4 border-dashed border-perforation border-t-stamp-red rounded-full"></div>
      </div>
    );
  }

  const totalPrice = selectedCategory.selling_price * quantity;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: 3, duration: 0.5 }}
              className="border-4 border-dashed border-stamp-red bg-paper p-12 text-center stamp-effect"
            >
              <div className="text-6xl mb-4">✓</div>
              <div className="text-3xl font-bold text-stamp-red mb-2">PAYMENT SUCCESS!</div>
              <p className="font-mono text-sm">Your tickets have been confirmed</p>
              <p className="font-mono text-xs mt-2 opacity-60">Redirecting...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-4 border-dashed border-perforation bg-paper p-8 ticket-shadow"
      >
        <div className="mb-8">
          <div className="inline-block px-4 py-2 bg-ink text-paper text-xs font-bold tracking-widest mb-4">
            BOOKING FORM
          </div>
          <h1 className="text-3xl font-bold">{concert.name}</h1>
          <p className="font-mono text-sm opacity-60 mt-2">
            {concert.location} • {new Date(concert.date).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <motion.div
                animate={{ scale: step === s ? 1.2 : 1 }}
                className={`w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center font-bold ${
                  step >= s ? 'bg-ink text-paper border-ink' : 'border-perforation'
                }`}
              >
                {s}
              </motion.div>
              {s < 3 && <div className="w-12 h-[2px] bg-perforation mx-2"></div>}
            </div>
          ))}
        </div>

        <div className="perforation-line my-8"></div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-bold mb-6">Select Tickets</h2>
            
            <div className="border-2 border-dashed border-perforation p-6 bg-white mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold">{selectedCategory.category_name}</h3>
                  <p className="text-2xl font-bold text-stamp-red">
                    Rp {selectedCategory.selling_price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={selectedCategory.available_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border-2 border-dashed border-perforation font-mono text-lg"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="font-mono">
                <div className="text-sm opacity-60">TOTAL</div>
                <div className="text-3xl font-bold text-stamp-red">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
                className="px-8 py-4 bg-ink text-paper font-bold tracking-wider hover:bg-stamp-red transition-colors"
              >
                NEXT →
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-bold mb-6">Attendee Information</h2>
            
            <div className="space-y-4 mb-6">
              {attendees.map((attendee, index) => (
                <div key={index} className="border-2 border-dashed border-perforation p-4 bg-white">
                  <div className="text-xs font-bold mb-3 opacity-60">TICKET #{index + 1}</div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-2">Name</label>
                      <input
                        type="text"
                        value={attendee.name}
                        onChange={(e) => {
                          const newAttendees = [...attendees];
                          newAttendees[index].name = e.target.value;
                          setAttendees(newAttendees);
                        }}
                        className="w-full px-4 py-2 border-2 border-dashed border-perforation font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2">Phone</label>
                      <input
                        type="tel"
                        value={attendee.phone}
                        onChange={(e) => {
                          const newAttendees = [...attendees];
                          newAttendees[index].phone = e.target.value;
                          setAttendees(newAttendees);
                        }}
                        className="w-full px-4 py-2 border-2 border-dashed border-perforation font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <motion.button
                whileHover={{ x: -4 }}
                onClick={() => setStep(1)}
                className="px-6 py-3 border-2 border-dashed border-perforation font-bold hover:bg-ink hover:text-paper"
              >
                ← BACK
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(3)}
                disabled={attendees.some(a => !a.name || !a.phone)}
                className="px-8 py-4 bg-ink text-paper font-bold tracking-wider hover:bg-stamp-red transition-colors disabled:opacity-50"
              >
                NEXT →
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-bold mb-6">Payment Method</h2>
            
            <div className="space-y-4 mb-6">
              {[
                { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
                { value: 'credit_card', label: 'Credit Card', icon: '💳' },
                { value: 'e_wallet', label: 'E-Wallet', icon: '📱' }
              ].map((method) => (
                <motion.label
                  key={method.value}
                  whileHover={{ x: 4 }}
                  className={`block border-2 border-dashed p-4 cursor-pointer transition-all ${
                    paymentMethod === method.value
                      ? 'border-ink bg-ink text-paper'
                      : 'border-perforation bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <span className="font-bold">{method.label}</span>
                </motion.label>
              ))}
            </div>

            <div className="border-4 border-dashed border-stamp-red p-6 bg-white mb-6">
              <div className="text-sm font-bold mb-4 opacity-60">ORDER SUMMARY</div>
              <div className="space-y-2 font-mono text-sm mb-4">
                <div className="flex justify-between">
                  <span>Concert:</span>
                  <span className="font-bold">{concert.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-bold">{selectedCategory.category_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-bold">{quantity} ticket(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per ticket:</span>
                  <span>Rp {selectedCategory.selling_price.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div className="border-t-2 border-dashed border-perforation pt-4 flex justify-between items-center">
                <span className="font-bold">TOTAL AMOUNT:</span>
                <span className="text-3xl font-bold text-stamp-red">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <motion.button
                whileHover={{ x: -4 }}
                onClick={() => setStep(2)}
                className="px-6 py-3 border-2 border-dashed border-perforation font-bold hover:bg-ink hover:text-paper"
              >
                ← BACK
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBooking}
                disabled={loading}
                className="px-8 py-4 bg-stamp-red text-paper font-bold text-lg tracking-wider hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'PROCESSING...' : 'PAY NOW'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}