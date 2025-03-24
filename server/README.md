
# Video Downloader Backend

This is the backend server for the Video Downloader application. It handles the actual downloading of videos using yt-dlp.

## Prerequisites

Before running this server, you need to install:

1. **Node.js & npm**: Download and install from [nodejs.org](https://nodejs.org/)

2. **yt-dlp**: A command-line program to download videos from YouTube and other sites

   - On Windows:
     ```
     pip install yt-dlp
     ```

   - On macOS (using Homebrew):
     ```
     brew install yt-dlp
     ```

   - On Linux:
     ```
     sudo apt install python3-pip
     pip3 install yt-dlp
     ```

## Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

The server will run on http://localhost:3001

## API Endpoints

- `POST /api/video-info`: Get information about a video
- `POST /api/download`: Download a video in a specific format

## Downloading Files

Downloaded files will be stored in the `downloads` directory inside the server folder.
