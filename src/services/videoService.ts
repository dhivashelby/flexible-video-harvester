// Mock video service for frontend demo
// In a real application, this would connect to the backend API

// Mock video formats with more detailed information
const mockFormats = [
  { 
    id: '137+140', 
    quality: 'HD', 
    resolution: '1080p', 
    extension: 'MP4', 
    size: '150-300 MB',
    videoCodec: 'H.264',
    audioCodec: 'AAC',
    bitrate: '10 Mbps',
    fps: '30'
  },
  { 
    id: '136+140', 
    quality: 'HD', 
    resolution: '720p', 
    extension: 'MP4', 
    size: '80-150 MB',
    videoCodec: 'H.264',
    audioCodec: 'AAC',
    bitrate: '5 Mbps',
    fps: '30'
  },
  { 
    id: '135+140', 
    quality: 'SD', 
    resolution: '480p', 
    extension: 'MP4', 
    size: '40-80 MB',
    videoCodec: 'H.264',
    audioCodec: 'AAC',
    bitrate: '2.5 Mbps',
    fps: '30'
  },
  { 
    id: '134+140', 
    quality: 'SD', 
    resolution: '360p', 
    extension: 'MP4', 
    size: '20-40 MB',
    videoCodec: 'H.264',
    audioCodec: 'AAC',
    bitrate: '1.5 Mbps',
    fps: '30'
  },
  { 
    id: '133+140', 
    quality: 'Low', 
    resolution: '240p', 
    extension: 'MP4', 
    size: '10-20 MB',
    videoCodec: 'H.264',
    audioCodec: 'AAC',
    bitrate: '0.7 Mbps',
    fps: '30'
  },
  { 
    id: '160+140', 
    quality: 'Lowest', 
    resolution: '144p', 
    extension: 'MP4', 
    size: '5-10 MB',
    videoCodec: 'H.264',
    audioCodec: 'AAC',
    bitrate: '0.3 Mbps',
    fps: '30'
  },
];

// Mock playlist videos
const mockPlaylistVideos = [
  {
    id: 'video1',
    title: 'Introduction to Web Development',
    thumbnail: 'https://picsum.photos/seed/video1/320/180',
    duration: '12:34'
  },
  {
    id: 'video2',
    title: 'HTML Basics - Structure and Semantics',
    thumbnail: 'https://picsum.photos/seed/video2/320/180',
    duration: '8:25'
  },
  {
    id: 'video3',
    title: 'CSS Fundamentals - Styling Your First Page',
    thumbnail: 'https://picsum.photos/seed/video3/320/180',
    duration: '15:41'
  },
  {
    id: 'video4',
    title: 'JavaScript Essentials for Beginners',
    thumbnail: 'https://picsum.photos/seed/video4/320/180',
    duration: '22:15'
  },
  {
    id: 'video5',
    title: 'Responsive Design Principles',
    thumbnail: 'https://picsum.photos/seed/video5/320/180',
    duration: '18:07'
  },
  {
    id: 'video6',
    title: 'Building Your First Interactive Website',
    thumbnail: 'https://picsum.photos/seed/video6/320/180',
    duration: '28:30'
  },
];

// This is a simplification for demo purposes
// In a real app, this would call actual backend APIs
export const videoService = {
  // Get video metadata (mock)
  getVideoMetadata: async (url: string): Promise<any> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if it's a playlist URL (simplified check)
    const isPlaylist = url.includes('playlist') || url.includes('list=');
    
    if (isPlaylist) {
      return {
        type: 'playlist',
        title: 'Web Development Fundamentals',
        channelName: 'Code Academy',
        videos: mockPlaylistVideos,
        formats: mockFormats,
        videoCount: mockPlaylistVideos.length,
        totalDuration: '1:45:22',
        fetchDate: new Date().toISOString(),
      };
    } else {
      // Check for YouTube URL pattern
      const isYouTube = url.includes('youtube.com/') || url.includes('youtu.be/');
      
      // Extract video ID (simplified)
      let videoId = '';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      // Use videoId as part of the mock response
      return {
        type: 'video',
        videoId: videoId || 'dQw4w9WgXcQ', // Default to a known video ID if extraction fails
        title: isYouTube ? `YouTube Video: ${videoId || 'Unknown ID'}` : 'Learn Web Development in 2023',
        channelName: 'Code Academy',
        thumbnail: isYouTube ? `https://i.ytimg.com/vi/${videoId || 'dQw4w9WgXcQ'}/maxresdefault.jpg` : 'https://picsum.photos/seed/thumbnail/640/360',
        duration: '15:25',
        formats: mockFormats,
        views: '1.2M',
        publishedDate: '2023-01-15',
        fetchDate: new Date().toISOString(),
      };
    }
  },
  
  // Download video (mock)
  downloadVideo: async (formatId: string, videoIds: string[]): Promise<any> => {
    // In a real app, this would trigger backend processing
    // For demo, we'll simulate progress updates
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Download complete',
          outputPath: '/downloads/video.mkv',
        });
      }, 5000);
    });
  },
  
  // Get download progress (mock)
  getDownloadProgress: async (): Promise<number> => {
    // In a real app, this would get actual progress from backend
    return Promise.resolve(Math.floor(Math.random() * 100));
  }
};
