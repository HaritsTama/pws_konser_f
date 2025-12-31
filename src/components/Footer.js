'use client';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-20 border-t-2 border-dashed border-perforation bg-paper"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="font-mono text-xs">
          <div className="border-b border-dashed border-perforation pb-4 mb-4">
            <div className="flex justify-between mb-1">
              <span>MERCHANT:</span>
              <span>CONCERT PASS SYSTEM</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>TERMINAL:</span>
              <span>WEB-001</span>
            </div>
            <div className="flex justify-between">
              <span>DATE:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="text-center space-y-1 text-[10px] opacity-60">
            <p>© 2024 CONCERT PASS. ALL RIGHTS RESERVED.</p>
            <p>TICKET SALES ARE FINAL. NO REFUNDS.</p>
            <p>SERIAL NO: {Math.random().toString(36).substr(2, 12).toUpperCase()}</p>
          </div>

          <div className="mt-6 flex justify-center gap-[2px] opacity-40">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="bg-ink"
                style={{
                  width: Math.random() > 0.5 ? '2px' : '4px',
                  height: '40px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}