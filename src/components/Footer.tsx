
import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="py-6 mt-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="text-center text-sm text-muted-foreground">
        <p>Video Harvester &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">For educational and personal use only.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
