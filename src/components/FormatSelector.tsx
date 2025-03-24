
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VideoFormat } from '@/services/videoService';

interface FormatSelectorProps {
  formats: VideoFormat[];
  selectedFormat: VideoFormat | null;
  onFormatSelect: (format: VideoFormat) => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ formats, selectedFormat, onFormatSelect }) => {
  const handleFormatSelect = (format: VideoFormat) => {
    onFormatSelect(format);
  };

  // Transition variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Variants for each format item
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div 
      className="w-full max-w-3xl mt-8"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <h2 className="text-xl font-medium mb-4">Select Format & Quality</h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        variants={containerVariants}
      >
        {formats.map((format) => (
          <motion.div
            key={format.format_id}
            className={`glass-panel p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedFormat?.format_id === format.format_id 
                ? 'ring-2 ring-primary border-primary/40' 
                : 'hover:shadow-md hover:-translate-y-1'
            }`}
            onClick={() => handleFormatSelect(format)}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <span className="font-medium">{format.quality || format.format_note}</span>
                  {(format.vcodec || format.bitrate) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="ml-1.5 rounded-full bg-secondary/40 flex items-center justify-center h-4 w-4">
                            <Info size={12} className="text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="p-2">
                          <div className="space-y-1 text-xs">
                            {format.vcodec && <p>Video: {format.vcodec}</p>}
                            {format.acodec && <p>Audio: {format.acodec}</p>}
                            {format.bitrate && <p>Bitrate: {format.bitrate}</p>}
                            {format.fps && <p>FPS: {format.fps}</p>}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{format.resolution}</div>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{format.ext}</span>
                  <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{format.size}</span>
                </div>
              </div>
              
              {selectedFormat?.format_id === format.format_id && (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default FormatSelector;
