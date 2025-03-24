
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

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
}

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  formats: VideoFormat[];
}

export const fetchVideoInfo = async (url: string): Promise<VideoInfo> => {
  try {
    const response = await axios.post(`${API_URL}/video-info`, { url });
    const { videoInfo } = response.data;
    
    // Process formats to add better descriptions
    const formats = videoInfo.formats
      .filter((format: any) => format.resolution !== 'audio only' && format.vcodec !== 'none')
      .map((format: any) => ({
        format_id: format.format_id,
        format_note: format.format_note || 'unknown',
        ext: format.ext || 'mp4',
        resolution: format.resolution || 'unknown',
        fps: format.fps || 30,
        vcodec: format.vcodec || 'unknown',
        acodec: format.acodec || 'unknown',
        filesize: format.filesize || format.filesize_approx || 0,
        filesize_approx: format.filesize_approx || 0
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
    throw new Error('Failed to fetch video information');
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

// Mock function for getting download status - to be removed when backend is implemented
export const getDownloadStatus = (progress: number): string => {
  if (progress === 0) return 'Initializing download...';
  if (progress < 20) return 'Extracting video information...';
  if (progress < 40) return 'Connecting to media servers...';
  if (progress < 60) return 'Downloading video stream...';
  if (progress < 80) return 'Downloading audio stream...';
  if (progress < 95) return 'Merging audio and video...';
  return 'Finalizing download...';
};
