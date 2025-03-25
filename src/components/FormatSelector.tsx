
import React from 'react';
import { motion } from 'framer-motion';
import { Download, Volume2, Video } from 'lucide-react';
import { VideoFormat } from '@/services/videoService';

interface FormatSelectorProps {
  formats: VideoFormat[];
  selectedFormat: VideoFormat | null;
  onFormatSelect: (format: VideoFormat) => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ formats, selectedFormat, onFormatSelect }) => {
  if (!formats || formats.length === 0) return null;
  
  // Group formats by type (audio/video)
  const audioFormats = formats.filter(format => 
    format.vcodec === 'none' || format.format_note.toLowerCase().includes('audio')
  );
  
  const videoFormats = formats.filter(format => 
    format.vcodec !== 'none' && !format.format_note.toLowerCase().includes('audio')
  );
  
  // Sort formats by quality (resolution for video, bitrate for audio)
  const sortedVideoFormats = [...videoFormats].sort((a, b) => {
    const resA = parseInt(String(a.resolution?.split('x')[1] || '0'));
    const resB = parseInt(String(b.resolution?.split('x')[1] || '0'));
    return resB - resA;
  });
  
  const sortedAudioFormats = [...audioFormats].sort((a, b) => {
    const bitrateA = typeof a.bitrate === 'string' ? parseFloat(a.bitrate) : 0;
    const bitrateB = typeof b.bitrate === 'string' ? parseFloat(b.bitrate) : 0;
    return bitrateB - bitrateA;
  });

  const getFormatSize = (format: VideoFormat) => {
    const filesize = format.filesize || 0;
    if (filesize === 0) return 'Unknown';
    
    const sizeMB = filesize / (1024 * 1024);
    return sizeMB.toFixed(2) + 'M';
  };

  const handleSelectFormat = (format: VideoFormat) => {
    onFormatSelect(format);
  };
  
  return (
    <motion.div 
      className="w-full max-w-3xl mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="formats-table border border-gray-300 rounded-md overflow-hidden">
        {/* Audio Formats */}
        <div className="formats-section">
          <div className="bg-gray-100 p-3 flex items-center">
            <Volume2 className="mr-2" size={18} />
            <span className="font-medium">Audio</span>
          </div>
          
          <table className="w-full">
            <tbody>
              {sortedAudioFormats.slice(0, 2).map((format) => (
                <tr 
                  key={format.format_id} 
                  className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectFormat(format)}
                >
                  <td className="py-3 px-4 border-r border-gray-200 w-1/3">
                    {format.format_note || 'MP3'}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-200 w-1/3 text-center">
                    {getFormatSize(format)}
                  </td>
                  <td className="py-3 px-4 w-1/3">
                    <button 
                      className={`w-full py-2 px-3 rounded flex items-center justify-center ${
                        selectedFormat?.format_id === format.format_id 
                          ? 'bg-blue-400 text-white' 
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      <Download size={16} className="mr-2" />
                      DOWNLOAD
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Video Formats */}
        <div className="formats-section">
          <div className="bg-gray-100 p-3 flex items-center border-t border-gray-300">
            <Video className="mr-2" size={18} />
            <span className="font-medium">Video</span>
          </div>
          
          <table className="w-full">
            <tbody>
              {sortedVideoFormats.slice(0, 5).map((format) => {
                const isHD = parseInt(String(format.resolution?.split('x')[1] || '0')) >= 720;
                const resolution = format.resolution?.split('x')[1] || format.format_note;
                
                return (
                  <tr 
                    key={format.format_id} 
                    className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectFormat(format)}
                  >
                    <td className="py-3 px-4 border-r border-gray-200 w-1/3 flex items-center">
                      <span>{resolution}p</span>
                      {format.acodec !== 'none' && <Volume2 size={14} className="ml-2" />}
                    </td>
                    <td className="py-3 px-4 border-r border-gray-200 w-1/3 text-center">
                      {getFormatSize(format)}
                    </td>
                    <td className="py-3 px-4 w-1/3">
                      <button 
                        className={`w-full py-2 px-3 rounded flex items-center justify-center ${
                          selectedFormat?.format_id === format.format_id 
                            ? 'bg-blue-400 text-white' 
                            : isHD ? 'bg-orange-400 text-white' : 'bg-green-500 text-white'
                        }`}
                      >
                        <Download size={16} className="mr-2" />
                        DOWNLOAD
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {sortedVideoFormats.length > 5 && (
                <tr className="border-t border-gray-200">
                  <td colSpan={3} className="py-3 px-4">
                    <button className="w-full py-2 bg-green-500 text-white rounded">
                      SHOW MORE
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default FormatSelector;
