
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface PlaylistVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

interface PlaylistSelectorProps {
  videos: PlaylistVideo[];
  onVideosSelected: (selectedVideos: string[]) => void;
}

const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({ videos, onVideosSelected }) => {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(true);

  const toggleVideoSelection = (id: string) => {
    setSelectedVideos(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(videoId => videoId !== id)
        : [...prev, id];
      
      onVideosSelected(newSelection);
      return newSelection;
    });
  };

  const selectAll = () => {
    const allIds = videos.map(video => video.id);
    setSelectedVideos(allIds);
    onVideosSelected(allIds);
  };

  const deselectAll = () => {
    setSelectedVideos([]);
    onVideosSelected([]);
  };

  return (
    <motion.div 
      className="w-full max-w-3xl mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Playlist Videos ({videos.length})</h2>
        <div className="flex space-x-3">
          <button 
            onClick={selectAll}
            className="text-sm text-primary hover:underline"
          >
            Select All
          </button>
          <button 
            onClick={deselectAll}
            className="text-sm text-muted-foreground hover:underline"
          >
            Deselect All
          </button>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-sm flex items-center text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <>
                <span>Collapse</span>
                <ChevronUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                <span>Expand</span>
                <ChevronDown size={16} className="ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            className="glass-panel rounded-xl overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-h-[400px] overflow-y-auto p-1">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className={`flex items-center p-3 rounded-lg mb-1 cursor-pointer transition-all duration-200 ${
                    selectedVideos.includes(video.id) 
                      ? 'bg-primary/10' 
                      : 'hover:bg-secondary/80'
                  }`}
                  onClick={() => toggleVideoSelection(video.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-5 h-5 rounded border border-primary/30 flex items-center justify-center">
                      {selectedVideos.includes(video.id) && (
                        <Check size={12} className="text-primary" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 mr-3">
                    <div className="relative w-16 h-9 rounded overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute right-1 bottom-1 bg-black/70 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{video.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="p-3 bg-secondary/30 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Selected: {selectedVideos.length} of {videos.length} videos
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PlaylistSelector;
