'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { register as registerApi } from '../../lib/api';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await registerApi(formData);
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="border-4 border-dashed border-perforation bg-paper p-8 ticket-shadow">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block stamp-effect bg-ink text-paper px-6 py-3 mb-4"
            >
              <div className="font-bold text-2xl">NEW</div>
              <div className="text-xs tracking-widest">MEMBER</div>
            </motion.div>
            <h1 className="text-2xl font-bold">Registration Form</h1>
            <p className="text-sm opacity-60 font-mono mt-2">Complete all fields to register</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-stamp-red text-paper text-sm font-mono"
              >
                ⚠ {error}
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold tracking-wide mb-2 opacity-60">
                  USERNAME *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wide mb-2 opacity-60">
                  EMAIL *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wide mb-2 opacity-60">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wide mb-2 opacity-60">
                  PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide mb-2 opacity-60">
                PASSWORD *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-ink text-paper font-bold tracking-wider hover:bg-stamp-red transition-colors disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : 'REGISTER'}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-dashed border-perforation text-center">
            <p className="text-sm opacity-60 mb-2">Already have an account?</p>
            <Link href="/login">
              <motion.span
                whileHover={{ x: 2 }}
                className="text-stamp-red font-bold hover:underline cursor-pointer"
              >
                Login Here →
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}