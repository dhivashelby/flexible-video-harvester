import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '../components/Header';
import VideoForm from '../components/VideoForm';
import FormatSelector from '../components/FormatSelector';
import PlaylistSelector from '../components/PlaylistSelector';
import DownloadProgress from '../components/DownloadProgress';
import Footer from '../components/Footer';
import { videoService } from '../services/videoService';

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState<any>(null);
  const [selectedFormat, setSelectedFormat] = useState<any>(null);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleMetadataReceived = (metadata: any) => {
    setVideoMetadata(metadata);
    
    if (metadata.type === 'playlist' && metadata.videos) {
      setSelectedVideos(metadata.videos.map((v: any) => v.id));
    }
  };

  const handleDownload = async () => {
    if (!selectedFormat) {
      toast.error('Please select a format');
      return;
    }
    
    if (videoMetadata.type === 'playlist' && selectedVideos.length === 0) {
      toast.error('Please select at least one video from the playlist');
      return;
    }
    
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStatus(videoService.getDownloadStatusMessage(0));
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        const newProgress = prev + 1;
        setDownloadStatus(videoService.getDownloadStatusMessage(newProgress));
        
        return newProgress;
      });
    }, 120);
    
    try {
      await videoService.downloadVideo(
        selectedFormat.id, 
        videoMetadata.type === 'playlist' ? selectedVideos : ['singleVideo']
      );
      
      setDownloadStatus(videoService.getDownloadStatusMessage(100));
      setTimeout(() => {
        setShowConfirmation(true);
      }, 1000);
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error during download process');
      setIsDownloading(false);
    }
  };

  const resetApp = () => {
    setVideoMetadata(null);
    setSelectedFormat(null);
    setSelectedVideos([]);
    setIsDownloading(false);
    setDownloadProgress(0);
    setDownloadStatus('');
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
        <Header />
        
        <div className="w-full my-8 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!videoMetadata && !isDownloading && (
              <motion.div
                key="video-form"
                className="w-full flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VideoForm 
                  onMetadataReceived={handleMetadataReceived} 
                  onLoading={setLoading} 
                />
              </motion.div>
            )}
            
            {videoMetadata && !isDownloading && (
              <motion.div 
                key="metadata-view"
                className="w-full flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-full max-w-3xl glass-panel rounded-xl p-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {videoMetadata.type === 'video' && videoMetadata.thumbnail && (
                      <div className="flex-shrink-0 w-full md:w-64">
                        <div className="rounded-lg overflow-hidden">
                          <img 
                            src={videoMetadata.thumbnail} 
                            alt={videoMetadata.title}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs mb-2">
                        {videoMetadata.type === 'playlist' ? 'Playlist' : 'Video'}
                      </span>
                      
                      <h2 className="text-xl font-medium mb-2">
                        {videoMetadata.title}
                      </h2>
                      
                      <p className="text-muted-foreground text-sm">
                        {videoMetadata.channelName}
                      </p>
                      
                      {videoMetadata.type === 'playlist' && (
                        <p className="mt-2 text-sm">
                          {videoMetadata.videos.length} videos in playlist
                        </p>
                      )}
                      
                      {videoMetadata.type === 'video' && videoMetadata.duration && (
                        <p className="mt-2 text-sm">
                          Duration: {videoMetadata.duration}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
                
                <FormatSelector 
                  formats={videoMetadata.formats} 
                  onFormatSelected={setSelectedFormat} 
                />
                
                {videoMetadata.type === 'playlist' && (
                  <PlaylistSelector 
                    videos={videoMetadata.videos}
                    onVideosSelected={setSelectedVideos}
                  />
                )}
                
                <motion.div
                  className="mt-8 flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <motion.button 
                    className="btn-secondary"
                    onClick={resetApp}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  
                  <motion.button 
                    className="btn-primary"
                    onClick={handleDownload}
                    disabled={!selectedFormat}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
            
            {isDownloading && (
              <motion.div
                key="download-view"
                className="w-full flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <AnimatePresence>
                  {!showConfirmation ? (
                    <DownloadProgress 
                      isDownloading={isDownloading}
                      progress={downloadProgress}
                      downloadStatus={downloadStatus}
                      selectedFormat={selectedFormat}
                      videoTitle={videoMetadata?.title}
                    />
                  ) : (
                    <motion.div
                      className="glass-panel rounded-xl p-6 mt-8 max-w-md w-full text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-8 w-8 text-primary" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      
                      <h3 className="text-xl font-medium mb-2">Download Complete!</h3>
                      <p className="text-muted-foreground mb-2">
                        Your video has been successfully processed.
                      </p>
                      <p className="text-xs text-muted-foreground/70 mb-4">
                        Note: This is a frontend demo. In a complete implementation, 
                        the video would be available for download.
                      </p>
                      
                      <motion.button 
                        className="btn-primary"
                        onClick={resetApp}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Download Another
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
