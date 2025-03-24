
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { videoService } from '../services/videoService';

interface VideoFormProps {
  onMetadataReceived: (metadata: any) => void;
  onLoading: (isLoading: boolean) => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ onMetadataReceived, onLoading }) => {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    setIsSubmitting(true);
    onLoading(true);
    
    try {
      // This would be an actual API call in a production app
      const metadata = await videoService.getVideoMetadata(url);
      onMetadataReceived(metadata);
      toast.success('Video information retrieved successfully');
    } catch (error) {
      console.error('Error fetching video metadata:', error);
      toast.error('Failed to retrieve video information');
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/70">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL or playlist link"
            className="glass-input w-full pl-10 pr-4 py-3 rounded-full"
            disabled={isSubmitting}
          />
        </div>
        
        <motion.button
          type="submit"
          className="btn-primary mx-auto"
          disabled={isSubmitting || !url.trim()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Analyze Video'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default VideoForm;
