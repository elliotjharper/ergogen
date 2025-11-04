<template>
  <div ref="container" class="stl-viewer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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
    mesh.geometry.dispose()
    mesh.material.dispose()
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
  loadSTL(props.file)
})

watch(() => props.file, (newFile) => {
  if (newFile) {
    loadSTL(newFile)
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
