
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Search, X, Info } from 'lucide-react';
import { videoService, VideoInfo } from '../services/videoService';
import { Button } from './ui/button';

export interface VideoFormProps {
  onMetadataReceived: (metadata: VideoInfo) => void;
  onLoading: (isLoading: boolean) => void;
  onUrlChange?: (url: string) => void;
  onSearch?: (url: string) => Promise<void>;
  isLoading?: boolean;
}

const VideoForm: React.FC<VideoFormProps> = ({ 
  onMetadataReceived, 
  onLoading,
  onUrlChange,
  onSearch,
  isLoading: externalIsLoading
}) => {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClear = () => {
    setUrl('');
    if (onUrlChange) {
      onUrlChange('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    if (onUrlChange) {
      onUrlChange(url);
    }
    
    if (onSearch) {
      await onSearch(url);
      return;
    }
    
    setIsSubmitting(true);
    onLoading(true);
    
    try {
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

  const isLoadingState = externalIsLoading !== undefined ? externalIsLoading : isSubmitting;

  return (
    <motion.div
      className="w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="search-container relative flex items-center w-full">
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (onUrlChange) {
                onUrlChange(e.target.value);
              }
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            className="search-input w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoadingState}
          />
          
          {url && (
            <button 
              type="button" 
              className="absolute right-16 text-gray-500 hover:text-gray-700"
              onClick={handleClear}
            >
              <X size={20} />
            </button>
          )}
          
          <Button
            type="submit"
            className="search-button absolute right-0 rounded-r-lg bg-blue-400 hover:bg-blue-500 text-white h-full px-6"
            disabled={isLoadingState || !url.trim()}
          >
            <Search size={24} />
          </Button>
        </div>
        
        {/* Copyright notice */}
        <div className="flex justify-center items-center text-sm text-gray-500 space-x-1">
          <span>Copyrighted content is not available for download with this tool.</span>
          <Info size={16} className="text-gray-400" />
        </div>
      </form>
    </motion.div>
  );
};

export default VideoForm;
