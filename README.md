# FaceSnap Gallery Frontend

This is the frontend for the FaceSnap Gallery application, a hybrid full-stack web application for event photographers to share photos with guests using face recognition.

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Dynamic Backend Connection**: Automatically connects to the photographer's local backend via a secure tunnel
- **Selfie Verification**: Allows guests to verify their identity with a selfie
- **Personalized Galleries**: Displays only photos containing the verified guest
- **Download Options**: Allows guests to download individual photos or all photos at once

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Start the development server:

```bash
npm start
# or
yarn start
```

3. Build for production:

```bash
npm run build
# or
yarn build
```

## Deployment

The frontend is designed to be deployed to a service like Vercel, Netlify, or Render. After building the project, you can deploy the contents of the `build` directory to your hosting provider.

### Vercel Deployment

```bash
vercel
```

### Netlify Deployment

```bash
npm install -g netlify-cli
netlify deploy
```

## Backend Connection

The frontend automatically attempts to connect to the local backend at `http://localhost:5000` and will use the tunnel URL provided by the backend if available. If the backend is offline, the frontend will display a message indicating that the photographer's system is currently unavailable.

## Technologies Used

- React
- React Router
- React Bootstrap
- Axios
- React Webcam

## Project Structure

- `src/components/`: Reusable UI components
- `src/pages/`: Page components for different routes
- `src/services/`: API service for backend communication
- `public/`: Static assets and HTML template

## License

This project is licensed under the MIT License - see the LICENSE file for details.