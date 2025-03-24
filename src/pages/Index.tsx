
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import VideoForm from '@/components/VideoForm';
import FormatSelector from '@/components/FormatSelector';
import Footer from '@/components/Footer';
import { VideoInfo, VideoFormat, fetchVideoInfo, downloadVideo } from '@/services/videoService';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import DownloadProgress from '@/components/DownloadProgress';
import { toast } from 'sonner';

const Index = () => {
  const [searchUrl, setSearchUrl] = useState<string>('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [downloadStatus, setDownloadStatus] = useState<string>('');
  const [outputPath, setOutputPath] = useState<string>('');
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  
  const handleUrlChange = (url: string) => {
    setSearchUrl(url);
  };
  
  const handleSearch = async (url: string) => {
    setIsLoading(true);
    try {
      const videoData = await fetchVideoInfo(url);
      setVideoInfo(videoData);
      toast.success('Video information retrieved successfully');
    } catch (error: any) {
      toast.error('Failed to load video info.', {
        description: error.message || 'Please check the URL and try again.',
      });
      setVideoInfo(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = async () => {
    if (!selectedFormat || !videoInfo) return;
    
    try {
      setIsDownloading(true);
      setProgress(0);
      
      // Create EventSource for progress updates
      const { eventSource: newEventSource, startDownload } = downloadVideo(
        searchUrl,
        selectedFormat.format_id,
        videoInfo.title
      );
      
      setEventSource(newEventSource);
      
      newEventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.error) {
          toast.error('Download error', {
            description: data.error,
          });
          return;
        }
        
        setProgress(data.progress || 0);
        if (data.status) setDownloadStatus(data.status);
        if (data.outputPath) setOutputPath(data.outputPath);
      };
      
      newEventSource.onerror = () => {
        toast.error('Connection error', {
          description: 'Lost connection to the download server',
        });
        newEventSource.close();
      };
      
      // Start the download
      await startDownload();
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed', {
        description: 'Could not start download. Is the backend server running?',
      });
      setIsDownloading(false);
    }
  };
  
  // Clean up EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);
  
  const handleDownloadComplete = () => {
    if (eventSource) {
      eventSource.close();
    }
    // Don't reset states here so user can see the completed download
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      
      <VideoForm 
        onUrlChange={handleUrlChange}
        onSearch={handleSearch}
        isLoading={isLoading}
        onMetadataReceived={setVideoInfo}
        onLoading={setIsLoading}
      />
      
      {videoInfo && (
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{videoInfo.title}</h2>
            <p className="text-gray-600">{videoInfo.description}</p>
          </div>
          
          <FormatSelector 
            formats={videoInfo.formats}
            selectedFormat={selectedFormat}
            onFormatSelect={setSelectedFormat}
          />
          
          <div className="mt-6 flex justify-center">
            <Button 
              size="lg" 
              onClick={handleDownload}
              disabled={isDownloading || !selectedFormat}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Video
            </Button>
          </div>
        </div>
      )}
      
      <DownloadProgress 
        isDownloading={isDownloading}
        progress={progress}
        downloadStatus={downloadStatus}
        onComplete={handleDownloadComplete}
        selectedFormat={selectedFormat}
        videoTitle={videoInfo?.title}
        outputPath={outputPath}
      />
      
      <Footer />
    </div>
  );
};

export default Index;
