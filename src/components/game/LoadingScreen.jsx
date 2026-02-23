import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ message = 'Loading...', progress = 0 }) {
  return (
    <div className="fixed inset-0 bg-[#0a0f1e] flex flex-col items-center justify-center p-8 z-50">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-12 text-center"
      >
        <div className="text-5xl mb-3">🏆</div>
        <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Ball Knowing</h1>
        <h2 className="text-xl font-bold text-[#3b82f6] tracking-widest uppercase">Impostor</h2>
      </motion.div>

      {/* Spinner */}
      <div className="relative w-20 h-20 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-[#3b82f6]/20 border-t-[#3b82f6]"
        />
      </div>

      {/* Message */}
      <motion.p
        key={message}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white/70 text-center text-sm mb-6 min-h-[20px]"
      >
        {message}
      </motion.p>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#3b82f6] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}
    </div>
  );
}