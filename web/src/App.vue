<template>
  <div class="app">
    <header class="header">
      <h1>Ergogen STL Viewer</h1>
      <div class="controls">
        <input 
          type="file" 
          accept=".stl,.dxf"
          @change="handleFileUpload"
          ref="fileInput"
          style="display: none"
        />
        <button @click="$refs.fileInput.click()" class="btn">
          Load File
        </button>
        <select 
          v-model="selectedFile"
          @change="handleFileSelect"
          class="file-select"
          :disabled="!availableFiles.length"
        >
          <option value="">{{ availableFiles.length ? 'Select a file...' : 'Loading files...' }}</option>
          <optgroup 
            v-for="folder in fileTree" 
            :key="folder.name"
            :label="folder.name"
          >
            <option 
              v-for="file in folder.files" 
              :key="file.path"
              :value="file.path"
            >
              {{ file.displayName }}
            </option>
          </optgroup>
        </select>
        <input 
          v-model="stlPath"
          @keyup.enter="loadFromPath(stlPath)"
          type="text"
          placeholder="Or enter custom path..."
          class="path-input"
        />
        <button 
          @click="loadFromPath(stlPath)" 
          :disabled="!stlPath"
          class="btn btn-secondary"
        >
          Load from Path
        </button>
      </div>
    </header>
    <main class="viewer-container">
      <STLViewer 
        v-if="stlFile"
        :file="stlFile"
      />
      <div v-else class="placeholder">
        <p>Click "Load STL File" to preview a 3D model</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import STLViewer from './components/STLViewer.vue'

const API_BASE = 'http://localhost:3001/api'

const stlFile = ref(null)
const stlPath = ref(null)
const fileInput = ref(null)
const availableFiles = ref([])
const selectedFile = ref('')

// Organize files into a folder tree structure
const fileTree = computed(() => {
  const tree = {}
  
  availableFiles.value.forEach(file => {
    // Detect path separator (\ or /)
    const separator = file.path.includes('\\') ? '\\' : '/'
    const parts = file.path.split(separator)
    // Get the folder structure (everything except the filename)
    const folderPath = parts.slice(0, -1).join(separator)
    // Get just the filename
    const fileName = parts[parts.length - 1]
    
    if (!tree[folderPath]) {
      tree[folderPath] = {
        name: folderPath,
        files: []
      }
    }
    
    tree[folderPath].files.push({
      ...file,
      displayName: fileName
    })
  })
  
  // Convert to array and sort by folder name
  return Object.values(tree).sort((a, b) => a.name.localeCompare(b.name))
})

const fetchAvailableFiles = async () => {
  try {
    const response = await fetch(`${API_BASE}/stl-files`)
    if (!response.ok) {
      throw new Error('Failed to fetch file list')
    }
    const files = await response.json()
    availableFiles.value = files
  } catch (error) {
    console.error('Error fetching available files:', error)
    availableFiles.value = []
  }
}

const updateUrlParam = (path) => {
  const url = new URL(window.location)
  if (path) {
    url.searchParams.set('model', path)
  } else {
    url.searchParams.delete('model')
  }
  window.history.replaceState({}, '', url)
}

const loadFromBackend = async (path) => {
  try {
    const response = await fetch(`${API_BASE}/stl-file?path=${encodeURIComponent(path)}`)
    if (!response.ok) {
      throw new Error('Failed to load file from backend')
    }
    
    const blob = await response.blob()
    const fileName = path.split('/').pop()
    const file = new File([blob], fileName, { type: 'application/octet-stream' })
    
    stlFile.value = file
    stlPath.value = path
    updateUrlParam(path)
  } catch (error) {
    console.error('Error loading STL from backend:', error)
    stlFile.value = null
    stlPath.value = null
    updateUrlParam(null)
  }
}

const loadFromPath = async (path) => {
  try {
    const response = await fetch(path)
    if (!response.ok) {
      throw new Error('Failed to load file')
    }
    
    const blob = await response.blob()
    if (blob.type === 'text/html') {
      throw new Error('Invalid STL file')
    }
    const fileName = path.split('/').pop()
    const file = new File([blob], fileName, { type: 'application/octet-stream' })

    stlFile.value = file
    stlPath.value = path
    updateUrlParam(path)
  } catch (error) {
    console.error('Error loading STL from path:', error)
    stlFile.value = null
    stlPath.value = null
    updateUrlParam(null)
  }
}

const handleFileSelect = () => {
  if (selectedFile.value) {
    loadFromBackend(selectedFile.value)
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && (file.name.endsWith('.stl') || file.name.endsWith('.dxf'))) {
    stlFile.value = file
    stlPath.value = null
    selectedFile.value = ''
    updateUrlParam(null)
  }
}

onMounted(async () => {
  // Fetch available files from backend
  await fetchAvailableFiles()
  
  // Check if there's a model path in URL params
  const urlParams = new URLSearchParams(window.location.search)
  const modelPath = urlParams.get('model')
  
  if (modelPath) {
    // Check if it's one of the available files
    const isAvailable = availableFiles.value.some(f => f.path === modelPath)
    if (isAvailable) {
      selectedFile.value = modelPath
      loadFromBackend(modelPath)
    } else {
      loadFromPath(modelPath)
    }
  }
})
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  background: #2a2a2a;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.file-select {
  min-width: 250px;
  padding: 0.5rem;
  background: #1a1a1a;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}

.file-select optgroup {
  background: #2a2a2a;
  color: #4CAF50;
  font-weight: 600;
  font-style: normal;
  padding: 0.25rem 0;
}

.file-select option {
  background: #1a1a1a;
  color: white;
  padding: 0.25rem 0.5rem;
}

.file-select:focus {
  outline: none;
  border-color: #4CAF50;
}

.file-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.path-input {
  flex: 1;
  padding: 0.5rem;
  background: #1a1a1a;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 0.9rem;
}

.path-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.btn {
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn:hover {
  background: #45a049;
}

.btn-secondary {
  background: #2196F3;
}

.btn-secondary:hover {
  background: #1976D2;
}

.btn:disabled {
  background: #666;
  cursor: not-allowed;
  opacity: 0.5;
}

.viewer-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  font-size: 1.2rem;
}
</style>
