
// Mock video service for frontend demo
// In a real application, this would connect to the backend API

// Mock video formats
const mockFormats = [
  { 
    id: '137+140', 
    quality: 'HD', 
    resolution: '1080p', 
    extension: 'MP4', 
    size: '150-300 MB' 
  },
  { 
    id: '136+140', 
    quality: 'HD', 
    resolution: '720p', 
    extension: 'MP4', 
    size: '80-150 MB' 
  },
  { 
    id: '135+140', 
    quality: 'SD', 
    resolution: '480p', 
    extension: 'MP4', 
    size: '40-80 MB' 
  },
  { 
    id: '134+140', 
    quality: 'SD', 
    resolution: '360p', 
    extension: 'MP4', 
    size: '20-40 MB' 
  },
  { 
    id: '133+140', 
    quality: 'Low', 
    resolution: '240p', 
    extension: 'MP4', 
    size: '10-20 MB' 
  },
  { 
    id: '160+140', 
    quality: 'Lowest', 
    resolution: '144p', 
    extension: 'MP4', 
    size: '5-10 MB' 
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
      };
    } else {
      return {
        type: 'video',
        title: 'Learn Web Development in 2023',
        channelName: 'Code Academy',
        thumbnail: 'https://picsum.photos/seed/thumbnail/640/360',
        duration: '15:25',
        formats: mockFormats,
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
