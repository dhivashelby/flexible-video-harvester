
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadProgressProps {
  isDownloading: boolean;
  progress: number;
  downloadStatus: string;
  onComplete?: () => void;
  selectedFormat?: any;
  videoTitle?: string;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ 
  isDownloading, 
  progress, 
  downloadStatus,
  onComplete,
  selectedFormat,
  videoTitle
}) => {
  const [outputPath, setOutputPath] = useState<string>('');
  
  useEffect(() => {
    if (progress === 100 && onComplete) {
      const timer = setTimeout(() => {
        // Generate a mock file path with video title and format
        const sanitizedTitle = videoTitle ? 
          videoTitle.replace(/[^\w\s]/gi, '_').substring(0, 30) : 
          'video';
        
        const resolution = selectedFormat?.resolution || '720p';
        setOutputPath(`/downloads/${sanitizedTitle}_${resolution}.mkv`);
        
        onComplete();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete, selectedFormat, videoTitle]);

  if (!isDownloading) return null;

  const handleSaveInfoClick = () => {
    // In a real app, this would be a real download link
    // For now, let's provide feedback via toast
    toast.info("This is a frontend demo", {
      description: "In a complete implementation, this would download the actual video file.",
      duration: 5000,
    });
  };

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
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{progress}% complete</span>
          <span>
            {progress < 100 ? 'Processing...' : 'Complete!'}
          </span>
        </div>
        
        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">{downloadStatus}</p>
          {progress > 0 && progress < 100 && (
            <div className="mt-1 text-xs text-muted-foreground/70">
              Estimated time remaining: {Math.ceil((100 - progress) / 10)} minutes
            </div>
          )}
        </div>

        {progress === 100 && (
          <div className="mt-6 border-t pt-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-medium text-foreground">Note:</span> This is a frontend demo. In a complete implementation, the file would be available at:
              </p>
              <div className="flex items-center gap-2 bg-secondary/30 p-2 rounded text-sm overflow-x-auto">
                <code className="text-xs">{outputPath}</code>
              </div>
              
              <div className="mt-3 flex gap-2 justify-center">
                <Button size="sm" variant="outline" onClick={handleSaveInfoClick}>
                  <Download size={16} className="mr-1" />
                  Simulate Download
                </Button>
                
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => window.open("https://github.com/yt-dlp/yt-dlp", "_blank")}
                >
                  <ExternalLink size={16} className="mr-1" />
                  Learn about yt-dlp
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DownloadProgress;
