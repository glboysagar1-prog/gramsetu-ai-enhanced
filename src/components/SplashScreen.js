import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background */}
      <div className="splash-bg">
        <div className="splash-gradient"></div>
        <div className="splash-particles"></div>
      </div>

      {/* Content */}
      <div className="splash-content">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="splash-logo"
        >
          <div className="logo-circle">
            <span className="logo-icon">🧠</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="splash-title"
        >
          GramSetu AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="splash-subtitle"
        >
          From Citizen Voice to National Intelligence
        </motion.p>

        {/* Tagline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="splash-tagline"
        >
          <span className="tagline-badge">🏆 IIT Bombay Techfest – Aarohan 2025</span>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '300px', opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="splash-progress-container"
        >
          <div className="splash-progress-bar">
            <motion.div 
              className="splash-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="splash-loading-text">Initializing AI Systems... {progress}%</p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="splash-features"
        >
          <span className="feature-pill">🔒 Blockchain Secured</span>
          <span className="feature-pill">🤖 AI-Powered</span>
          <span className="feature-pill">🇮🇳 Digital India</span>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="splash-decorations">
        <motion.div 
          className="deco-ring ring-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="deco-ring ring-2"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
