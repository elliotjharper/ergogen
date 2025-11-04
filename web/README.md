# Ergogen Web Viewer

A lightweight Vue 3 + Vite web application for previewing STL files with a backend API.

## Setup

```bash
npm install
```

## Development

Run both the backend server and Vite dev server together:

```bash
npm run dev:all
```

Or run them separately:

```bash
# Terminal 1 - Backend API server (port 3001)
npm run server

# Terminal 2 - Vite dev server (port 3000)
npm run dev
```

The app will be available at http://localhost:3000

## Build

```bash
npm run build
```

## Features

- **Vue 3 with Composition API** - Lightweight component framework
- **Vite** - Fast development with hot module replacement
- **Three.js** - 3D STL rendering with orbit controls
- **Backend API** - Express server that:
  - Scans for STL files in `split-tkl/output-left/**/*.stl`
  - Provides dropdown list of available files
  - Serves STL files securely
- **Multiple loading options**:
  - Upload local STL files
  - Select from dropdown of available files
  - Enter custom file paths
- **URL persistence** - Selected files are saved in URL query params for bookmarking/sharing

## API Endpoints

- `GET /api/stl-files` - Returns list of available STL files
- `GET /api/stl-file?path=<path>` - Returns the STL file content

