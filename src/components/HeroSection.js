'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection({ concert }) {
  if (!concert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-12"
    >
      <div className="relative bg-ink text-paper p-8 border-4 border-dashed border-stamp-red ticket-shadow overflow-hidden">
        <div className="absolute -left-4 top-20 w-8 h-8 rounded-full bg-paper border-2 border-stamp-red"></div>
        <div className="absolute -right-4 top-20 w-8 h-8 rounded-full bg-paper border-2 border-stamp-red"></div>
        <div className="absolute -left-4 bottom-20 w-8 h-8 rounded-full bg-paper border-2 border-stamp-red"></div>
        <div className="absolute -right-4 bottom-20 w-8 h-8 rounded-full bg-paper border-2 border-stamp-red"></div>

        <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="inline-block px-4 py-1 bg-stamp-red text-paper text-xs font-bold tracking-widest mb-4"
            >
              ★ FEATURED EVENT ★
            </motion.div>

            <h1 className="text-5xl font-bold mb-4 tracking-tight">{concert.name}</h1>
            
            <div className="space-y-2 text-sm font-mono border-l-4 border-stamp-red pl-4 mb-6">
              <div className="flex gap-4">
                <span className="opacity-60">VENUE:</span>
                <span className="font-bold">{concert.location}</span>
              </div>
              <div className="flex gap-4">
                <span className="opacity-60">DATE:</span>
                <span className="font-bold">{new Date(concert.date).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-4">
                <span className="opacity-60">TIME:</span>
                <span className="font-bold">{concert.time}</span>
              </div>
            </div>

            <Link href={`/concerts/${concert.id}`}>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-stamp-red text-paper font-bold text-lg tracking-wider border-4 border-dashed border-paper hover:bg-red-600 transition-colors"
              >
                GET TICKETS NOW
              </motion.button>
            </Link>
          </div>

          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="border-4 border-dashed border-paper p-6 bg-paper text-ink"
            >
              <div className="text-xs font-mono mb-2 opacity-60">ADMIT ONE</div>
              <div className="text-2xl font-bold mb-4">{concert.name}</div>
              
              <div className="flex gap-[2px] mb-4">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-ink"
                    style={{
                      width: Math.random() > 0.5 ? '3px' : '6px',
                      height: '50px',
                    }}
                  />
                ))}
              </div>

              <div className="text-[10px] font-mono">
                SERIAL: {Math.random().toString(36).substr(2, 12).toUpperCase()}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}