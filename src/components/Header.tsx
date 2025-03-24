
import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="py-6 px-8 flex justify-center items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-foreground">
          Video Harvester
        </h1>
        <p className="text-muted-foreground mt-2 text-center max-w-md">
          Download and convert videos with exceptional quality
        </p>
      </div>
    </motion.header>
  );
};

export default Header;
