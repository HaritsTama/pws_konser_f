'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function TicketCard({ concert }) {
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setTiltX((y - 0.5) * 20);
    setTiltY((x - 0.5) * -20);
  };

  const handleMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
  };

  const minPrice = concert.ticket_categories?.length > 0
    ? Math.min(...concert.ticket_categories.map(c => c.selling_price))
    : 0;

  return (
    <Link href={`/concerts/${concert.id}`}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tiltX,
          rotateY: tiltY,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ perspective: 1000 }}
        className="relative h-full cursor-pointer"
      >
        <motion.div
          whileHover={{ y: -8 }}
          className="relative bg-paper border-2 border-dashed border-perforation h-full ticket-shadow overflow-hidden"
          style={{
            clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(50% - 12px), calc(100% - 8px) 50%, 100% calc(50% + 12px), 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 calc(50% + 12px), 8px 50%, 0 calc(50% - 12px))',
          }}
        >
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-paper border-2 border-perforation z-10"></div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-paper border-2 border-perforation z-10"></div>

          <div className="flex h-full">
            <div className="w-2/5 relative bg-ink p-4 flex items-center justify-center">
              <div className="text-paper text-center">
                <div className="text-6xl font-bold mb-2">🎵</div>
                <div className="text-xs font-mono">LIVE</div>
              </div>
            </div>

            <div className="w-[2px] bg-perforation relative">
              <div className="absolute inset-0 perforation-line rotate-90 origin-center"></div>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <motion.div
                  whileHover={{ x: 2 }}
                  className="inline-block px-2 py-1 bg-stamp-red text-paper text-[10px] font-bold tracking-wider mb-2"
                >
                  ADMIT ONE
                </motion.div>

                <h3 className="text-lg font-bold mb-2 line-clamp-2">{concert.name}</h3>

                <div className="space-y-1 text-xs font-mono mb-3">
                  <div className="flex justify-between">
                    <span className="opacity-60">VENUE:</span>
                    <span className="font-semibold text-right line-clamp-1">{concert.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">DATE:</span>
                    <span className="font-semibold">{new Date(concert.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">FROM:</span>
                    <span className="font-bold text-stamp-red">
                      Rp {minPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="border-t border-dashed border-perforation pt-2 mt-2">
                  <div className="flex gap-[1px] mb-2 h-6">
                    {[...Array(25)].map((_, i) => (
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
                    SERIAL: {Math.random().toString(36).substr(2, 10).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {concert.status === 'pending' && (
            <div className="absolute top-2 right-2 px-3 py-1 bg-yellow-500 text-ink text-xs font-bold tracking-wider transform rotate-12">
              PENDING
            </div>
          )}
        </motion.div>
      </motion.div>
    </Link>
  );
}