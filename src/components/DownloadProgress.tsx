
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface DownloadProgressProps {
  isDownloading: boolean;
  progress: number;
  downloadStatus: string;
  onComplete?: () => void;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ 
  isDownloading, 
  progress, 
  downloadStatus,
  onComplete 
}) => {
  useEffect(() => {
    if (progress === 100 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  if (!isDownloading) return null;

  return (
    <motion.div
      className="w-full max-w-md mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-lg font-medium mb-4">Processing</h3>
        
        <div className="mb-2">
          <div className="progress-bar">
            <motion.div 
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{progress}% complete</span>
          <span>
            {progress < 100 ? 'Processing...' : 'Complete!'}
          </span>
        </div>
        
        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">{downloadStatus}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DownloadProgress;
