
import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="py-6 flex justify-center items-center flex-col"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-foreground">
        YouTube Video Downloader
      </h1>
      <p className="text-muted-foreground mt-2 text-center">
        download YouTube videos to mp3 and mp4 online for free
      </p>
    </motion.header>
  );
};

export default Header;
