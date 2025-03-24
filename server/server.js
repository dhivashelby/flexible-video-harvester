
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3001;

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(downloadsDir));

// Endpoint to get video info
app.post('/api/video-info', (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  const ytdlp = spawn('yt-dlp', [
    '--dump-json',
    url
  ]);
  
  let output = '';
  let errorOutput = '';
  
  ytdlp.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  ytdlp.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });
  
  ytdlp.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: errorOutput || 'Failed to fetch video info' });
    }
    
    try {
      const videoInfo = JSON.parse(output);
      return res.json({ videoInfo });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to parse video info' });
    }
  });
});

// Endpoint to download video
app.post('/api/download', (req, res) => {
  const { url, formatId, videoTitle } = req.body;
  
  if (!url || !formatId) {
    return res.status(400).json({ error: 'URL and format ID are required' });
  }
  
  const sanitizedTitle = videoTitle 
    ? videoTitle.replace(/[^\w\s]/gi, '_').substring(0, 30)
    : 'video';
  
  const outputPath = path.join(downloadsDir, `${sanitizedTitle}_${formatId}.mp4`);
  
  // Set up SSE for progress updates
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const ytdlp = spawn('yt-dlp', [
    '-f', formatId,
    '-o', outputPath,
    '--newline',
    url
  ]);
  
  let progress = 0;
  
  ytdlp.stdout.on('data', (data) => {
    const output = data.toString();
    const progressMatch = output.match(/(\d+\.\d+)%/);
    
    if (progressMatch && progressMatch[1]) {
      progress = parseFloat(progressMatch[1]);
      res.write(`data: ${JSON.stringify({ progress, status: output.trim() })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ progress, status: output.trim() })}\n\n`);
    }
  });
  
  ytdlp.stderr.on('data', (data) => {
    const error = data.toString();
    res.write(`data: ${JSON.stringify({ error })}\n\n`);
  });
  
  ytdlp.on('close', (code) => {
    if (code === 0) {
      const relativePath = `/downloads/${path.basename(outputPath)}`;
      res.write(`data: ${JSON.stringify({ progress: 100, status: 'Download complete', outputPath: relativePath })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Download failed' })}\n\n`);
    }
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
