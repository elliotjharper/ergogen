import { exec } from 'child_process';
import { watch } from 'chokidar';
import cors from 'cors';
import express from 'express';
import { readFileSync } from 'fs';
import { glob } from 'glob';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get list of STL, DXF, and KiCad files
app.get('/api/stl-files', async (req, res) => {
    try {
        const patterns = ['split-tkl/output-*/**/*.stl', 'split-tkl/output-*/**/*.dxf', 'split-tkl/output-*/**/*.kicad_pcb'];

        const allFiles = [];
        for (const pattern of patterns) {
            const files = await glob(pattern, { cwd: rootDir });
            allFiles.push(...files);
        }

        const fileList = allFiles.map((file) => {
            // Handle both forward and backslashes
            const separator = file.includes('\\') ? '\\' : '/';
            return {
                path: file,
                name: file.split(separator).pop(),
                relativePath: file,
            };
        });

        res.json(fileList);
    } catch (error) {
        console.error('Error finding files:', error);
        res.status(500).json({ error: 'Failed to find files' });
    }
});

// Serve STL file
app.get('/api/stl-file', (req, res) => {
    try {
        const { path } = req.query;

        if (!path) {
            return res.status(400).json({ error: 'Path parameter is required' });
        }

        // Security: ensure path doesn't escape the root directory
        const normalizedPath = path.replace(/\\/g, '/');
        if (normalizedPath.includes('..')) {
            return res.status(403).json({ error: 'Invalid path' });
        }

        const filePath = join(rootDir, normalizedPath);
        const fileContent = readFileSync(filePath);

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${normalizedPath.split('/').pop()}"`);
        res.send(fileContent);
    } catch (error) {
        console.error('Error reading STL file:', error);
        res.status(404).json({ error: 'File not found' });
    }
});

app.listen(PORT, () => {
    console.log(`STL file server running on http://localhost:${PORT}`);
});

// Watch for YAML file changes and rebuild
let isBuilding = false;
const buildQueue = new Set();

const runBuild = (script) => {
    return new Promise((resolve, reject) => {
        console.log(`Running npm run ${script}...`);
        exec(`npm run ${script}`, { cwd: rootDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running ${script}:`, error.message);
                reject(error);
            } else {
                console.log(`Finished npm run ${script}`);
                if (stdout) {
                    console.log(stdout);
                }
                resolve();
            }
        });
    });
};

const processBuildQueue = async () => {
    if (isBuilding || buildQueue.size === 0) {
        return;
    }

    isBuilding = true;
    const scripts = Array.from(buildQueue);
    buildQueue.clear();

    try {
        for (const script of scripts) {
            await runBuild(script);
        }
    } catch (error) {
        console.error('Build error:', error);
    } finally {
        isBuilding = false;
        console.log(`Finished build queue.`);
        // Check if new builds were queued while we were running
        if (buildQueue.size > 0) {
            processBuildQueue();
        }
    }
};

const watcher = watch('split-tkl/*.yaml', {
    cwd: rootDir,
    ignoreInitial: true,
    persistent: true,
});

watcher.on('change', (path) => {
    console.log(`Detected change in ${path}`);
    buildQueue.add('left');
    buildQueue.add('right');
    processBuildQueue();
});

watcher.on('ready', () => {
    console.log('Watching split-tkl/*.yaml for changes...');
});

watcher.on('error', (error) => {
    console.error('Watcher error:', error);
});
