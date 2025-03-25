
# YouTube Video Downloader

A web application built with React, TypeScript, and Node.js that allows you to download YouTube videos in various formats.

## Project info

**URL**: https://lovable.dev/projects/019bc48c-7b2e-4449-8c53-56a0a2b659af

## Features

- Fetch metadata for YouTube videos
- Select video quality and format
- Download videos directly to your device
- Real-time download progress tracking

## Setup Guide

Follow these steps to get the application running on your local machine:

### Prerequisites

Before proceeding, make sure you have the following installed:

#### 1. Node.js and npm
```bash
# Check if installed
node -v
npm -v
```
If not installed, download and install from [nodejs.org](https://nodejs.org/)

#### 2. Python (required for yt-dlp)
```bash
# Check if installed
python --version
# OR on some systems:
python3 --version
```
If not installed:
- **Windows**: Download from [python.org](https://www.python.org/downloads/)
- **macOS**: `brew install python3`
- **Linux**: `sudo apt install python3`

#### 3. pip (Python package manager)
```bash
# Check if installed
pip --version
# OR
pip3 --version
```
If not installed:
- **Windows**: It should come with Python
- **macOS**: `brew install pip3`
- **Linux**: `sudo apt install python3-pip`

#### 4. yt-dlp (core dependency for video downloading)
```bash
# Check if installed
yt-dlp --version
```
If not installed:
- **Windows**: `pip install yt-dlp`
- **macOS**: `brew install yt-dlp` or `pip3 install yt-dlp`
- **Linux**: `pip3 install yt-dlp`

### Installation

#### 1. Clone the repository
```bash
# Clone the repository using the project's Git URL
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>
```

#### 2. Install Frontend Dependencies
```bash
# From the project root directory:
npm install
```

#### 3. Install Backend Dependencies
```bash
# Navigate to the server directory:
cd server
npm install
```

### Running the Application

#### Option 1: Run Both Frontend and Backend Together
```bash
# From the server directory:
npm run dev:all
```

This command will start:
- Backend server on http://localhost:3001
- Frontend application on http://localhost:8080

#### Option 2: Run Frontend and Backend Separately

If you need to run them separately:

```bash
# For backend (from server directory):
cd server
npm run dev

# For frontend (from project root in a new terminal):
npm run dev
```

### Verifying Your Setup

1. Open your browser and navigate to http://localhost:8080
2. Enter a YouTube URL in the input field
3. Click "Analyze Video"
4. Select a format and download

### Troubleshooting

#### If yt-dlp is not working:
- Try updating it: `pip install -U yt-dlp` or `pip3 install -U yt-dlp`
- Make sure it's in your system PATH

#### If you get "command not found" for yt-dlp:
- **Windows**: Try reinstalling with `pip install --force-reinstall yt-dlp`
- **macOS/Linux**: Try `which yt-dlp` to find its location, then add to PATH

#### If server fails to start:
- Check if port 3001 is already in use:
  - **macOS/Linux**: `lsof -i :3001`
  - **Windows**: `netstat -ano | findstr :3001`
- Kill the process using that port if needed

#### If the frontend cannot connect to the backend:
- Ensure backend is running
- Check for CORS errors in browser console
- Verify the API URL in the frontend config

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/019bc48c-7b2e-4449-8c53-56a0a2b659af) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Express.js
- yt-dlp

## Deployment

To deploy this project:

1. Open [Lovable](https://lovable.dev/projects/019bc48c-7b2e-4449-8c53-56a0a2b659af) and click on Share -> Publish.

2. For custom domains, we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## License

This project is available for your personal use. Please review our terms of service for more information.
