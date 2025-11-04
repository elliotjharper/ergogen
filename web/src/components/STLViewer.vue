<template>
  <div ref="container" class="stl-viewer"></div>
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

const loadFile = async (file) => {
  const fileName = file.name.toLowerCase()
  
  if (fileName.endsWith('.stl')) {
    await loadSTL(file)
  } else if (fileName.endsWith('.dxf')) {
    await loadDXF(file)
  } else {
    console.error('Unsupported file type:', fileName)
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
.stl-viewer {
  width: 100%;
  height: 100%;
}
</style>
