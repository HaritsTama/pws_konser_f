'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { login as loginApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginApi(formData);
      login(response.data.token, response.data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="border-4 border-dashed border-perforation bg-paper p-8 ticket-shadow">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block stamp-effect bg-stamp-red text-paper px-6 py-3 mb-4"
            >
              <div className="font-bold text-2xl">ACCESS</div>
              <div className="text-xs tracking-widest">CONTROL</div>
            </motion.div>
            <h1 className="text-2xl font-bold">Member Login</h1>
            <p className="text-sm opacity-60 font-mono mt-2">Enter credentials to proceed</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-stamp-red text-paper text-sm font-mono border-2 border-dashed border-ink"
              >
                ⚠ {error}
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-bold tracking-wide mb-2 opacity-60">
                USERNAME OR EMAIL
              </label>
              <input
                type="text"
                value={formData.usernameOrEmail}
                onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-dashed border-perforation font-mono focus:outline-none focus:border-ink"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide mb-2 opacity-60">
                PASSWORD
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
              {loading ? 'PROCESSING...' : 'LOGIN'}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-dashed border-perforation text-center">
            <p className="text-sm opacity-60 mb-2">Don't have an account?</p>
            <Link href="/register">
              <motion.span
                whileHover={{ x: 2 }}
                className="text-stamp-red font-bold hover:underline cursor-pointer"
              >
                Register Now →
              </motion.span>
            </Link>
          </div>

          <div className="mt-6 text-center text-[10px] font-mono opacity-40">
            FORM ID: {Math.random().toString(36).substr(2, 12).toUpperCase()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}