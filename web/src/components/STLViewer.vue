<template>
  <div class="viewer-wrapper">
    <div ref="container" class="stl-viewer"></div>
    <div v-if="canExportDXF" class="export-controls">
      <button @click="exportToDXF" class="export-btn">Export as DXF</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import DxfParser from 'dxf-parser'

const props = defineProps({
  file: {
    type: File,
    required: true
  }
})

const container = ref(null)
let scene, camera, renderer, controls, mesh
const canExportDXF = ref(false)
let kicadData = null // Store parsed KiCad data for export

const initScene = () => {
  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a1a)

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 100)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  
  // Make middle mouse button act like right mouse button (pan)
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.PAN
  }

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
  directionalLight2.position.set(-1, -1, -1)
  scene.add(directionalLight2)

  // Grid
  const gridHelper = new THREE.GridHelper(200, 20, 0x444444, 0x222222)
  scene.add(gridHelper)

  // Handle window resize
  window.addEventListener('resize', onWindowResize)

  // Animation loop
  animate()
}

const loadSTL = async (file) => {
  // Remove existing mesh if any
  if (mesh) {
    scene.remove(mesh)
    if (mesh.geometry) {
      mesh.geometry.dispose()
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => mat.dispose())
      } else {
        mesh.material.dispose()
      }
    }
  }

  const loader = new STLLoader()
  const reader = new FileReader()

  reader.onload = (event) => {
    const geometry = loader.parse(event.target.result)
    
    // Center the geometry
    geometry.computeBoundingBox()
    const center = new THREE.Vector3()
    geometry.boundingBox.getCenter(center)
    geometry.translate(-center.x, -center.y, -center.z)

    // Create material and mesh
    const material = new THREE.MeshPhongMaterial({
      color: 0x4CAF50,
      specular: 0x111111,
      shininess: 200
    })
    
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Adjust camera based on model size
    const box = new THREE.Box3().setFromObject(mesh)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    camera.position.z = maxDim * 2
    controls.update()
  }

  reader.readAsArrayBuffer(file)
}

const loadDXF = async (file) => {
  // Remove existing mesh if any
  if (mesh) {
    scene.remove(mesh)
    if (mesh.geometry) {
      mesh.geometry.dispose()
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => mat.dispose())
      } else {
        mesh.material.dispose()
      }
    }
  }

  const reader = new FileReader()
  
  reader.onload = (event) => {
    try {
      const parser = new DxfParser()
      const dxf = parser.parseSync(event.target.result)
      
      if (!dxf) {
        console.error('Failed to parse DXF')
        return
      }

      // Create a group to hold all DXF entities
      const group = new THREE.Group()
      
      // Create line material
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x4CAF50,
        linewidth: 2
      })

      // Process entities
      if (dxf.entities) {
        dxf.entities.forEach(entity => {
          if (entity.type === 'LINE') {
            const points = [
              new THREE.Vector3(entity.vertices[0].x, entity.vertices[0].y, entity.vertices[0].z || 0),
              new THREE.Vector3(entity.vertices[1].x, entity.vertices[1].y, entity.vertices[1].z || 0)
            ]
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            const line = new THREE.Line(geometry, lineMaterial)
            group.add(line)
          } else if (entity.type === 'POLYLINE' || entity.type === 'LWPOLYLINE') {
            const points = entity.vertices.map(v => 
              new THREE.Vector3(v.x, v.y, v.z || 0)
            )
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            const line = new THREE.Line(geometry, lineMaterial)
            group.add(line)
          } else if (entity.type === 'CIRCLE') {
            const curve = new THREE.EllipseCurve(
              entity.center.x, entity.center.y,
              entity.radius, entity.radius,
              0, 2 * Math.PI,
              false, 0
            )
            const points = curve.getPoints(50).map(p => 
              new THREE.Vector3(p.x, p.y, entity.center.z || 0)
            )
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            const line = new THREE.Line(geometry, lineMaterial)
            group.add(line)
          } else if (entity.type === 'ARC') {
            const startAngle = entity.startAngle * Math.PI / 180
            const endAngle = entity.endAngle * Math.PI / 180
            const curve = new THREE.EllipseCurve(
              entity.center.x, entity.center.y,
              entity.radius, entity.radius,
              startAngle, endAngle,
              false, 0
            )
            const points = curve.getPoints(50).map(p => 
              new THREE.Vector3(p.x, p.y, entity.center.z || 0)
            )
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            const line = new THREE.Line(geometry, lineMaterial)
            group.add(line)
          }
        })
      }

      // Center the group
      const box = new THREE.Box3().setFromObject(group)
      const center = new THREE.Vector3()
      box.getCenter(center)
      group.position.sub(center)

      mesh = group
      scene.add(mesh)

      // Adjust camera based on model size
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      camera.position.z = maxDim * 2
      controls.update()
    } catch (error) {
      console.error('Error parsing DXF:', error)
    }
  }

  reader.readAsText(file)
}

const loadKiCad = async (file) => {
  // Remove existing mesh if any
  if (mesh) {
    scene.remove(mesh)
    if (mesh.geometry) {
      mesh.geometry.dispose()
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => mat.dispose())
      } else {
        mesh.material.dispose()
      }
    }
  }

  const reader = new FileReader()
  
  reader.onload = (event) => {
    try {
      const content = event.target.result
      const group = new THREE.Group()
      
      console.log('KiCad file length:', content.length)
      
      // Line material for edges
      const edgeMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00FF00,
        linewidth: 3
      })
      
      // Material for copper/pads
      const copperMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFD700,
        side: THREE.DoubleSide
      })
      
      // Material for silk screen (white)
      const silkMaterial = new THREE.LineBasicMaterial({ 
        color: 0xFFFFFF,
        linewidth: 2
      })
      
      // Parse the s-expression structure
      // Look for modules (KiCad v5) or footprints (KiCad v6+) and their pads
      // KiCad v5 has (at ...) on separate line, v6+ has it inline
      const moduleRegex = /\((module|footprint)\s+[^\n]*[\s\S]*?\(at\s+([-\d.]+)\s+([-\d.]+)(?:\s+([-\d.]+))?\)/g
      const footprints = []
      let match
      
      // Find all footprints/modules with their positions
      while ((match = moduleRegex.exec(content)) !== null) {
        console.log('Found module/footprint:', match[0].substring(0, 100))
        const fpX = parseFloat(match[2])
        const fpY = parseFloat(match[3])
        const fpRot = match[4] ? parseFloat(match[4]) : 0
        
        // Find the end of this footprint
        let depth = 0
        let start = match.index
        let end = start
        for (let i = start; i < content.length; i++) {
          if (content[i] === '(') {
            depth++
          }
          if (content[i] === ')') {
            depth--
          }
          if (depth === 0) {
            end = i
            break
          }
        }
        
        footprints.push({
          x: fpX,
          y: fpY,
          rotation: fpRot,
          content: content.substring(start, end + 1)
        })
      }
      
      console.log('Found', footprints.length, 'footprints')
      
      // Process each footprint
      footprints.forEach(fp => {
        // Find pads within this footprint - handle multiline format
        const padRegex = /\(pad\s+[\s\S]*?\s+(thru_hole|smd|np_thru_hole)\s+(circle|rect|oval|roundrect|trapezoid|custom)[\s\S]*?\(at\s+([-\d.]+)\s+([-\d.]+)(?:\s+([-\d.]+))?\)[\s\S]*?\(size\s+([-\d.]+)\s+([-\d.]+)\)/g
        let padMatch
        let padCount = 0
        
        while ((padMatch = padRegex.exec(fp.content)) !== null) {
          padCount++
          const padType = padMatch[1] // thru_hole, smd, etc.
          const padShape = padMatch[2] // circle, rect, etc.
          const localX = parseFloat(padMatch[3])
          const localY = parseFloat(padMatch[4])
          const localRot = padMatch[5] ? parseFloat(padMatch[5]) : 0
          const width = parseFloat(padMatch[6])
          const height = parseFloat(padMatch[7])
          
          // Transform pad position relative to footprint
          const rotRad = (fp.rotation * Math.PI) / 180
          const worldX = fp.x + localX * Math.cos(rotRad) - localY * Math.sin(rotRad)
          const worldY = fp.y + localX * Math.sin(rotRad) + localY * Math.cos(rotRad)
          const worldRot = fp.rotation + localRot
          
          // Create pad geometry based on shape
          let geometry
          if (padShape === 'circle' || padShape === 'oval') {
            // For circles and ovals
            if (width === height || padShape === 'circle') {
              geometry = new THREE.CircleGeometry(width / 2, 32)
            } else {
              // Oval - use ellipse-like shape
              geometry = new THREE.CircleGeometry(Math.max(width, height) / 2, 32)
              const scaleX = width / Math.max(width, height)
              const scaleY = height / Math.max(width, height)
              geometry.scale(scaleX, scaleY, 1)
            }
          } else {
            // rect, roundrect, trapezoid, custom - use rectangle
            geometry = new THREE.PlaneGeometry(width, height)
          }
          
          const pad = new THREE.Mesh(geometry, copperMaterial)
          pad.position.set(worldX, -worldY, 0) // Flip Y for correct orientation
          pad.rotation.z = -(worldRot * Math.PI) / 180 // Flip rotation
          group.add(pad)
        }
        
        console.log('Footprint had', padCount, 'pads')
      })
      
      // Parse silk screen elements (fp_line on F.SilkS and B.SilkS layers)
      const silkLineRegex = /\(fp_line\s+\(start\s+([-\d.]+)\s+([-\d.]+)\)\s+\(end\s+([-\d.]+)\s+([-\d.]+)\)[\s\S]*?\(layer\s+(F\.SilkS|B\.SilkS)\)/g
      let silkLineCount = 0
      
      footprints.forEach(fp => {
        let silkMatch
        const fpSilkRegex = /\(fp_line\s+\(start\s+([-\d.]+)\s+([-\d.]+)\)\s+\(end\s+([-\d.]+)\s+([-\d.]+)\)[\s\S]*?\(layer\s+(F\.SilkS|B\.SilkS)\)/g
        
        while ((silkMatch = fpSilkRegex.exec(fp.content)) !== null) {
          silkLineCount++
          const localX1 = parseFloat(silkMatch[1])
          const localY1 = parseFloat(silkMatch[2])
          const localX2 = parseFloat(silkMatch[3])
          const localY2 = parseFloat(silkMatch[4])
          
          // Transform to world coordinates
          const cosRot = Math.cos((fp.rotation * Math.PI) / 180)
          const sinRot = Math.sin((fp.rotation * Math.PI) / 180)
          
          const worldX1 = fp.x + localX1 * cosRot - localY1 * sinRot
          const worldY1 = fp.y + localX1 * sinRot + localY1 * cosRot
          const worldX2 = fp.x + localX2 * cosRot - localY2 * sinRot
          const worldY2 = fp.y + localX2 * sinRot + localY2 * cosRot
          
          const points = [
            new THREE.Vector3(worldX1, -worldY1, 0.01),
            new THREE.Vector3(worldX2, -worldY2, 0.01)
          ]
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geometry, silkMaterial)
          group.add(line)
        }
      })
      
      console.log('Found', silkLineCount, 'silk screen lines')
      
      // Parse board edge cuts (Edge.Cuts layer) - support both v5 and v6+ format
      // Collect all edge segments
      const edgeRegex = /\(gr_line\s+\(start\s+([-\d.]+)\s+([-\d.]+)\)\s+\(end\s+([-\d.]+)\s+([-\d.]+)\)[\s\S]*?\(layer\s+"?Edge\.Cuts"?\)/g
      const edgeSegments = []
      while ((match = edgeRegex.exec(content)) !== null) {
        const x1 = parseFloat(match[1])
        const y1 = -parseFloat(match[2]) // Flip Y
        const x2 = parseFloat(match[3])
        const y2 = -parseFloat(match[4]) // Flip Y
        
        edgeSegments.push({
          type: 'line',
          start: new THREE.Vector2(x1, y1),
          end: new THREE.Vector2(x2, y2)
        })
      }
      
      console.log('Found', edgeSegments.length, 'edge line segments')
      
      // Draw each edge segment
      edgeSegments.forEach(seg => {
        if (seg.type === 'line') {
          const points = [
            new THREE.Vector3(seg.start.x, seg.start.y, 0),
            new THREE.Vector3(seg.end.x, seg.end.y, 0)
          ]
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geometry, edgeMaterial)
          group.add(line)
        } else if (seg.type === 'arc') {
          // Draw arc as curve
          const curve = new THREE.EllipseCurve(
            seg.center.x, seg.center.y,
            seg.radius, seg.radius,
            seg.startAngle, seg.endAngle,
            seg.clockwise,
            0 // rotation
          )
          
          const points = curve.getPoints(50)
          const geometry = new THREE.BufferGeometry().setFromPoints(
            points.map(p => new THREE.Vector3(p.x, p.y, 0))
          )
          const line = new THREE.Line(geometry, edgeMaterial)
          group.add(line)
        }
      })
      
      // Parse arcs on Edge.Cuts - support both v5 and v6+ format
      const arcRegex = /\(gr_arc\s+\(start\s+([-\d.]+)\s+([-\d.]+)\)\s+\(end\s+([-\d.]+)\s+([-\d.]+)\)\s+\(angle\s+([-\d.]+)\)[\s\S]*?\(layer\s+"?Edge\.Cuts"?\)/g
      let arcCount = 0
      while ((match = arcRegex.exec(content)) !== null) {
        arcCount++
        // In KiCad: start = center, end = endpoint of the arc
        const centerX = parseFloat(match[1])
        const centerY = -parseFloat(match[2]) // Flip Y
        const endX = parseFloat(match[3])
        const endY = -parseFloat(match[4]) // Flip Y
        const angleDeg = parseFloat(match[5])
        
        // Calculate radius from center to end point
        const radius = Math.sqrt(Math.pow(endX - centerX, 2) + Math.pow(endY - centerY, 2))
        
        // End point angle (from center to end point)
        const endAngleRad = Math.atan2(endY - centerY, endX - centerX)
        
        // KiCad angle: positive = counterclockwise, negative = clockwise
        // The arc goes FROM the calculated start angle TO the end point
        const angleRad = (angleDeg * Math.PI) / 180
        const startAngleRad = endAngleRad - angleRad
        
        edgeSegments.push({
          type: 'arc',
          center: new THREE.Vector2(centerX, centerY),
          radius: radius,
          startAngle: startAngleRad,
          endAngle: endAngleRad,
          clockwise: angleDeg < 0,
          angleDeg: angleDeg,
          // Store original points for debugging
          startPoint: new THREE.Vector2(
            centerX + radius * Math.cos(startAngleRad),
            centerY + radius * Math.sin(startAngleRad)
          ),
          endPoint: new THREE.Vector2(endX, endY)
        })
      }
      
      console.log('Found', arcCount, 'arcs')
      
      // Now draw the arcs we just added
      edgeSegments.filter(seg => seg.type === 'arc').forEach(seg => {
        const curve = new THREE.EllipseCurve(
          seg.center.x, seg.center.y,
          seg.radius, seg.radius,
          seg.startAngle, seg.endAngle,
          seg.clockwise,
          0
        )
        
        const points = curve.getPoints(50)
        const geometry = new THREE.BufferGeometry().setFromPoints(
          points.map(p => new THREE.Vector3(p.x, p.y, 0))
        )
        const line = new THREE.Line(geometry, edgeMaterial)
        group.add(line)
      })
      console.log('Total objects in group:', group.children.length)
      
      // Store data for DXF export
      kicadData = {
        footprints: footprints.map(fp => ({
          x: fp.x,
          y: fp.y,
          rotation: fp.rotation,
          pads: []
        })),
        edgeSegments: edgeSegments,
        center: new THREE.Vector3()
      }
      
      // Re-process footprints to extract pad data for export
      footprints.forEach((fp, fpIndex) => {
        const padRegex = /\(pad\s+[\s\S]*?\s+(thru_hole|smd|np_thru_hole)\s+(circle|rect|oval|roundrect|trapezoid|custom)[\s\S]*?\(at\s+([-\d.]+)\s+([-\d.]+)(?:\s+([-\d.]+))?\)[\s\S]*?\(size\s+([-\d.]+)\s+([-\d.]+)\)/g
        let padMatch
        
        while ((padMatch = padRegex.exec(fp.content)) !== null) {
          const padType = padMatch[1]
          const padShape = padMatch[2]
          const localX = parseFloat(padMatch[3])
          const localY = parseFloat(padMatch[4])
          const localRot = padMatch[5] ? parseFloat(padMatch[5]) : 0
          const width = parseFloat(padMatch[6])
          const height = parseFloat(padMatch[7])
          
          kicadData.footprints[fpIndex].pads.push({
            type: padType,
            shape: padShape,
            localX,
            localY,
            localRot,
            width,
            height
          })
        }
      })

      // Center the group
      const box = new THREE.Box3().setFromObject(group)
      if (box.isEmpty()) {
        console.warn('No geometry found in KiCad file')
        canExportDXF.value = false
        return
      }
      
      const center = new THREE.Vector3()
      box.getCenter(center)
      group.position.sub(center)
      kicadData.center = center

      mesh = group
      scene.add(mesh)
      canExportDXF.value = true

      // Adjust camera based on model size
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      camera.position.z = maxDim * 2
      controls.update()
    } catch (error) {
      console.error('Error parsing KiCad:', error)
    }
  }

  reader.readAsText(file)
}

const loadFile = async (file) => {
  const fileName = file.name.toLowerCase()
  canExportDXF.value = false
  kicadData = null
  
  if (fileName.endsWith('.stl')) {
    await loadSTL(file)
  } else if (fileName.endsWith('.dxf')) {
    await loadDXF(file)
  } else if (fileName.endsWith('.kicad_pcb')) {
    await loadKiCad(file)
  } else {
    console.error('Unsupported file type:', fileName)
  }
}

const exportToDXF = () => {
  if (!kicadData) {
    console.error('No KiCad data to export')
    return
  }
  
  try {
    // Manually create DXF file content
    let dxfContent = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1015
9
$INSUNITS
70
4
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
70
2
0
LAYER
2
0
62
7
6
CONTINUOUS
0
LAYER
2
EDGE_CUTS
62
3
6
CONTINUOUS
0
LAYER
2
PADS
62
1
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
`
    
    // Convert arcs to line segments for DXF export
    const dxfSegments = []
    
    kicadData.edgeSegments.forEach(seg => {
      if (seg.type === 'line') {
        dxfSegments.push({
          start: new THREE.Vector2(seg.start.x, seg.start.y),
          end: new THREE.Vector2(seg.end.x, seg.end.y)
        })
      } else if (seg.type === 'arc') {
        // Approximate arc with line segments (10 segments per arc)
        const steps = 10
        const angleStep = (seg.endAngle - seg.startAngle) / steps
        
        for (let i = 0; i < steps; i++) {
          const angle1 = seg.startAngle + angleStep * i
          const angle2 = seg.startAngle + angleStep * (i + 1)
          
          const x1 = seg.center.x + seg.radius * Math.cos(angle1)
          const y1 = seg.center.y + seg.radius * Math.sin(angle1)
          const x2 = seg.center.x + seg.radius * Math.cos(angle2)
          const y2 = seg.center.y + seg.radius * Math.sin(angle2)
          
          dxfSegments.push({
            start: new THREE.Vector2(x1, y1),
            end: new THREE.Vector2(x2, y2)
          })
        }
      }
    })
    
    // Detect gaps and add connecting lines
    const gapTolerance = 5.0
    const connectionLines = []
    
    for (let i = 0; i < dxfSegments.length; i++) {
      const seg1 = dxfSegments[i]
      let foundConnection = false
      
      // Check if seg1.end connects to any other segment's start
      for (let j = 0; j < dxfSegments.length; j++) {
        if (i === j) {
          continue
        }
        
        const seg2 = dxfSegments[j]
        const dist = seg1.end.distanceTo(seg2.start)
        
        if (dist < 0.1) {
          // Already connected
          foundConnection = true
          break
        } else if (dist < gapTolerance) {
          // Small gap - add connecting line
          connectionLines.push({
            start: new THREE.Vector2(seg1.end.x, seg1.end.y),
            end: new THREE.Vector2(seg2.start.x, seg2.start.y)
          })
          foundConnection = true
          break
        }
      }
    }
    
    // Combine original segments and connection lines
    const allSegments = [...dxfSegments, ...connectionLines]
    
    // Export all segments as lines
    allSegments.forEach(seg => {
      const x1 = seg.start.x - kicadData.center.x
      const y1 = seg.start.y - kicadData.center.y
      const x2 = seg.end.x - kicadData.center.x
      const y2 = seg.end.y - kicadData.center.y
      
      dxfContent += `0
LINE
8
EDGE_CUTS
10
${x1}
20
${y1}
30
0.0
11
${x2}
21
${y2}
31
0.0
`
    })

    
    // Add pads
    kicadData.footprints.forEach(fp => {
      fp.pads.forEach(pad => {
        // Transform pad position relative to footprint
        const rotRad = (fp.rotation * Math.PI) / 180
        const worldX = fp.x + pad.localX * Math.cos(rotRad) - pad.localY * Math.sin(rotRad)
        const worldY = fp.y + pad.localX * Math.sin(rotRad) + pad.localY * Math.cos(rotRad)
        
        // Adjust for centering (Y is already flipped in edgeSegments)
        const x = worldX - kicadData.center.x
        const y = -(worldY) - kicadData.center.y
        
        if (pad.shape === 'circle') {
          // Draw circle
          dxfContent += `0
CIRCLE
8
PADS
10
${x}
20
${y}
30
0.0
40
${pad.width / 2}
`
        } else {
          // Draw rectangle as 4 separate lines for better compatibility
          const hw = pad.width / 2
          const hh = pad.height / 2
          
          // Bottom line
          dxfContent += `0
LINE
8
PADS
10
${x - hw}
20
${y - hh}
30
0.0
11
${x + hw}
21
${y - hh}
31
0.0
`
          // Right line
          dxfContent += `0
LINE
8
PADS
10
${x + hw}
20
${y - hh}
30
0.0
11
${x + hw}
21
${y + hh}
31
0.0
`
          // Top line
          dxfContent += `0
LINE
8
PADS
10
${x + hw}
20
${y + hh}
30
0.0
11
${x - hw}
21
${y + hh}
31
0.0
`
          // Left line
          dxfContent += `0
LINE
8
PADS
10
${x - hw}
20
${y + hh}
30
0.0
11
${x - hw}
21
${y - hh}
31
0.0
`
        }
      })
    })
    
    // Close the DXF file
    dxfContent += `0
ENDSEC
0
EOF
`
    
    // Download the file
    const blob = new Blob([dxfContent], { type: 'application/dxf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = props.file.name.replace(/\.kicad_pcb$/, '.dxf')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('DXF exported successfully')
  } catch (error) {
    console.error('Error exporting DXF:', error)
  }
}

const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

const onWindowResize = () => {
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

onMounted(() => {
  initScene()
  loadFile(props.file)
})

watch(() => props.file, (newFile) => {
  if (newFile) {
    loadFile(newFile)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  if (renderer) {
    renderer.dispose()
  }
  if (controls) {
    controls.dispose()
  }
})
</script>

<style scoped>
.viewer-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.stl-viewer {
  width: 100%;
  height: 100%;
}

.export-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.export-btn {
  padding: 0.75rem 1.5rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: background 0.2s, transform 0.1s;
}

.export-btn:hover {
  background: #1976D2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.export-btn:active {
  transform: translateY(0);
}
</style>
