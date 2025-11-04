import cors from 'cors'
import express from 'express'
import { readFileSync } from 'fs'
import { glob } from 'glob'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Get list of STL files
app.get('/api/stl-files', async (req, res) => {
  try {
    const pattern = 'split-tkl/output-left/**/*.stl'
    const files = await glob(pattern, { cwd: rootDir })
    
    const fileList = files.map(file => ({
      path: file,
      name: file.split('/').pop(),
      relativePath: file
    }))
    
    res.json(fileList)
  } catch (error) {
    console.error('Error finding STL files:', error)
    res.status(500).json({ error: 'Failed to find STL files' })
  }
})

// Serve STL file
app.get('/api/stl-file', (req, res) => {
  try {
    const { path } = req.query
    
    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' })
    }
    
    // Security: ensure path doesn't escape the root directory
    const normalizedPath = path.replace(/\\/g, '/')
    if (normalizedPath.includes('..')) {
      return res.status(403).json({ error: 'Invalid path' })
    }
    
    const filePath = join(rootDir, normalizedPath)
    const fileContent = readFileSync(filePath)
    
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="${normalizedPath.split('/').pop()}"`)
    res.send(fileContent)
  } catch (error) {
    console.error('Error reading STL file:', error)
    res.status(404).json({ error: 'File not found' })
  }
})

app.listen(PORT, () => {
  console.log(`STL file server running on http://localhost:${PORT}`)
})
