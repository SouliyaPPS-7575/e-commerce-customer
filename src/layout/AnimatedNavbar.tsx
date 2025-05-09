import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navbar from './navbar';

// Animated version of Navbar using Framer Motion
export const AnimatedNavbar = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shouldShow, setShouldShow] = useState(true);

  // Track scrolling direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up or at the top
      if (currentScrollY <= 10 || currentScrollY < lastScrollY) {
        setShouldShow(true);
      }
      // Hide navbar when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 64) {
        setShouldShow(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Animation variants
  const navbarVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: '-100%', opacity: 0.8 },
  };

  return (
    <motion.div
      initial="visible"
      animate={shouldShow ? 'visible' : 'hidden'}
      variants={navbarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
      }}
    >
      <Navbar />
    </motion.div>
  );
};
