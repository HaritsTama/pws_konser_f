'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createConcert } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function SellTicket() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [organizerInfo, setOrganizerInfo] = useState({
    full_name: '',
    email: '',
    phone: ''
  });

  const [concertInfo, setConcertInfo] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    time: '',
    image_url: ''
  });

  const [ticketCategories, setTicketCategories] = useState([
    { category_name: '', base_price: '', available_quantity: '' }
  ]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setOrganizerInfo({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || ''
    });
  }, [user, router]);

  const addCategory = () => {
    setTicketCategories([...ticketCategories, { category_name: '', base_price: '', available_quantity: '' }]);
  };

  const removeCategory = (index) => {
    if (ticketCategories.length > 1) {
      const newCategories = ticketCategories.filter((_, i) => i !== index);
      setTicketCategories(newCategories);
    }
  };

  const updateCategory = (index, field, value) => {
    const newCategories = [...ticketCategories];
    newCategories[index][field] = value;
    setTicketCategories(newCategories);
  };

  const calculateSellingPrice = (basePrice) => {
    return Math.round(basePrice * 1.20);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formattedCategories = ticketCategories.map(cat => ({
        category_name: cat.category_name,
        base_price: parseFloat(cat.base_price),
        available_quantity: parseInt(cat.available_quantity)
      }));

      await createConcert(user.id, {
        ...concertInfo,
        ticket_categories: formattedCategories
      });

      alert('Concert created successfully! Waiting for admin approval.');
      router.push('/dashboard');
    } catch (error) {
      alert('Failed to create concert: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-4 border-dashed border-perforation bg-paper p-8 ticket-shadow"
      >
        <div className="mb-8">
          <div className="inline-block px-4 py-2 bg-stamp-red text-paper text-xs font-bold tracking-widest mb-4">
            ★ CREATE EVENT ★
          </div>
          <h1 className="text-3xl font-bold mb-2">Sell Your Concert Tickets</h1>
          <p className="font-mono text-sm opacity-60">Fill in the details to create your event</p>
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
          >
            <h2 className="text-xl font-bold mb-6">Organizer Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2 opacity-60">FULL NAME *</label>
                <input
                  type="text"
                  value={organizerInfo.full_name}
                  onChange={(e) => setOrganizerInfo({...organizerInfo, full_name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 opacity-60">EMAIL *</label>
                <input
                  type="email"
                  value={organizerInfo.email}
                  onChange={(e) => setOrganizerInfo({...organizerInfo, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink bg-gray-100"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 opacity-60">PHONE NUMBER *</label>
                <input
                  type="tel"
                  value={organizerInfo.phone}
                  onChange={(e) => setOrganizerInfo({...organizerInfo, phone: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
                disabled={!organizerInfo.full_name || !organizerInfo.email || !organizerInfo.phone}
                className="px-8 py-4 bg-ink text-paper font-bold tracking-wider hover:bg-stamp-red transition-colors disabled:opacity-50"
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
          >
            <h2 className="text-xl font-bold mb-6">Concert Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2 opacity-60">CONCERT NAME *</label>
                <input
                  type="text"
                  value={concertInfo.name}
                  onChange={(e) => setConcertInfo({...concertInfo, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 opacity-60">DESCRIPTION</label>
                <textarea
                  value={concertInfo.description}
                  onChange={(e) => setConcertInfo({...concertInfo, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink h-24"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 opacity-60">LOCATION *</label>
                <input
                  type="text"
                  value={concertInfo.location}
                  onChange={(e) => setConcertInfo({...concertInfo, location: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 opacity-60">DATE *</label>
                  <input
                    type="date"
                    value={concertInfo.date}
                    onChange={(e) => setConcertInfo({...concertInfo, date: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2 opacity-60">TIME *</label>
                  <input
                    type="time"
                    value={concertInfo.time}
                    onChange={(e) => setConcertInfo({...concertInfo, time: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 opacity-60">IMAGE URL (Optional)</label>
                <input
                  type="url"
                  value={concertInfo.image_url}
                  onChange={(e) => setConcertInfo({...concertInfo, image_url: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <motion.button
                whileHover={{ x: -4 }}
                onClick={() => setStep(1)}
                className="px-6 py-3 border-2 border-dashed border-perforation font-bold hover:bg-ink hover:text-paper"
              >
                ← BACK
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setStep(3)}
                disabled={!concertInfo.name || !concertInfo.location || !concertInfo.date || !concertInfo.time}
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
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Ticket Categories</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={addCategory}
                className="px-4 py-2 bg-stamp-red text-paper font-bold text-sm"
              >
                + ADD CATEGORY
              </motion.button>
            </div>

            <div className="space-y-6">
              {ticketCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-dashed border-perforation p-4 bg-white relative"
                >
                  {ticketCategories.length > 1 && (
                    <button
                      onClick={() => removeCategory(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-stamp-red text-paper font-bold text-xs rounded-full"
                    >
                      ×
                    </button>
                  )}

                  <div className="text-xs font-bold mb-3 opacity-60">CATEGORY #{index + 1}</div>
                  
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-2">Category Name *</label>
                      <input
                        type="text"
                        value={category.category_name}
                        onChange={(e) => updateCategory(index, 'category_name', e.target.value)}
                        placeholder="e.g., VVIP, VIP, Regular"
                        className="w-full px-4 py-2 border-2 border-dashed border-perforation font-mono"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-2">Base Price (Rp) *</label>
                        <input
                          type="number"
                          value={category.base_price}
                          onChange={(e) => updateCategory(index, 'base_price', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-dashed border-perforation font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-2">Selling Price (+20%)</label>
                        <div className="w-full px-4 py-2 border-2 border-dashed border-stamp-red bg-paper font-mono font-bold text-stamp-red">
                          {category.base_price ? `Rp ${calculateSellingPrice(parseFloat(category.base_price)).toLocaleString('id-ID')}` : 'Rp 0'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-2">Quantity *</label>
                        <input
                          type="number"
                          value={category.available_quantity}
                          onChange={(e) => updateCategory(index, 'available_quantity', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-dashed border-perforation font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="perforation-line my-8"></div>

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
                onClick={handleSubmit}
                disabled={loading || ticketCategories.some(c => !c.category_name || !c.base_price || !c.available_quantity)}
                className="px-8 py-4 bg-stamp-red text-paper font-bold text-lg tracking-wider hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'SUBMITTING...' : 'SUBMIT FOR VERIFICATION'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}