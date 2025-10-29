import React, { useCallback, useState, memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Earth.css';

interface EarthProps {
  onClick: () => void;
  isClicking: boolean;
}

export const Earth: React.FC<EarthProps> = memo(({ onClick, isClicking }) => {
  const [clickParticles, setClickParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onClick();
    
    // Create click particle
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    
    const particles = [{
      id: Date.now(),
      x,
      y,
    }];
    
    setClickParticles(particles);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Remove particles after animation
    timeoutRef.current = setTimeout(() => {
      setClickParticles([]);
    }, 1000);
  }, [onClick]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className="earth-wrapper"
      onClick={handleClick}
      animate={{ scale: isClicking ? 1.05 : 1 }}
      transition={{ duration: 0.15 }}
      whileTap={{ scale: 0.98 }}
      style={{ cursor: 'pointer' }}
    >
      <div className="planet-container">
        <div className="night"></div>
        <div className="day"></div>
        <div className="clouds"></div>
        <div className="inner-shadow"></div>
        
        {/* Click flash effect */}
        <AnimatePresence>
          {isClicking && (
            <motion.div
              className="click-flash"
              initial={{ opacity: 0.8, scale: 0.8 }}
              animate={{ opacity: 0, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Click particles */}
      <AnimatePresence>
        {clickParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="click-particle"
            style={{
              left: particle.x,
              top: particle.y,
            }}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1.2, 1.5],
              y: [0, -80],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span>+1 EARTH</span>
            <img src="/earth.webp" alt="EARTH" className="earth-icon" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

Earth.displayName = 'Earth';

