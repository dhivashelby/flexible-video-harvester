import axios from 'axios';

// Set the API URL - in development it's localhost, but in production it might be different
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface VideoFormat {
  format_id: string;
  format_note: string;
  ext: string;
  resolution: string;
  fps: number;
  vcodec: string;
  acodec: string;
  filesize: number;
  filesize_approx?: number;
  
  // Additional properties needed by FormatSelector
  quality?: string;
  size: string;
  videoCodec?: string;
  audioCodec?: string;
  bitrate?: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  formats: VideoFormat[];
}

// Fetch video info from the backend
export const fetchVideoInfo = async (url: string): Promise<VideoInfo> => {
  try {
    console.log(`Attempting to connect to API at: ${API_URL}/video-info`);
    const response = await axios.post(`${API_URL}/video-info`, { url });
    const { videoInfo } = response.data;
    
    // Process formats to add better descriptions and match the Format interface
    const formats = videoInfo.formats
      .filter((format: any) => format.resolution !== 'audio only' && format.vcodec !== 'none')
      .map((format: any) => ({
        // Original properties
        format_id: format.format_id,
        format_note: format.format_note || 'unknown',
        ext: format.ext || 'mp4',
        resolution: format.resolution || 'unknown',
        fps: format.fps || 30,
        vcodec: format.vcodec || 'unknown',
        acodec: format.acodec || 'unknown',
        filesize: format.filesize || format.filesize_approx || 0,
        filesize_approx: format.filesize_approx || 0,
        
        // Additional properties
        quality: format.format_note || `${format.resolution}`,
        size: formatFileSize(format.filesize || format.filesize_approx || 0),
        videoCodec: format.vcodec || 'unknown',
        audioCodec: format.acodec || 'unknown',
        bitrate: format.tbr ? `${format.tbr} Kbps` : 'unknown',
      }));
    
    return {
      id: videoInfo.id,
      title: videoInfo.title,
      description: videoInfo.description,
      thumbnail: videoInfo.thumbnail,
      duration: videoInfo.duration,
      formats: formats
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    
    // Provide more specific error messages based on error type
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error(`Cannot connect to the backend server at ${API_URL}. Please check:\n1. Is the server running? (Run 'npm run dev:all' in the server directory)\n2. Is yt-dlp installed? (Check setup-guide.txt)\n3. Are you using the correct port?`);
      } else if (error.response.status === 400) {
        throw new Error('Please provide a valid YouTube URL');
      } else if (error.response.status === 500) {
        const errorMsg = error.response.data?.error || 'Server error processing your request';
        throw new Error(`Server error: ${errorMsg}`);
      }
    }
    
    throw new Error('Failed to fetch video information. Make sure the backend server is running and yt-dlp is installed.');
  }
};

// Function to download a video with progress updates
export const downloadVideo = (url: string, formatId: string, videoTitle: string) => {
  const eventSource = new EventSource(`${API_URL}/download?url=${encodeURIComponent(url)}&formatId=${formatId}&videoTitle=${encodeURIComponent(videoTitle)}`);
  
  return {
    eventSource,
    startDownload: async () => {
      try {
        await axios.post(`${API_URL}/download`, { url, formatId, videoTitle });
      } catch (error) {
        console.error('Error starting download:', error);
        throw new Error('Failed to start download');
      }
    }
  };
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Mock function for getting download status
export const getDownloadStatus = (progress: number): string => {
  if (progress === 0) return 'Initializing download...';
  if (progress < 20) return 'Extracting video information...';
  if (progress < 40) return 'Connecting to media servers...';
  if (progress < 60) return 'Downloading video stream...';
  if (progress < 80) return 'Downloading audio stream...';
  if (progress < 95) return 'Merging audio and video...';
  return 'Finalizing download...';
};

// Create a videoService object for compatibility with VideoForm
export const videoService = {
  getVideoMetadata: async (url: string): Promise<VideoInfo> => {
    return fetchVideoInfo(url);
  }
};
