import './style.css'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// 메인 페이지
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="container">
      <canvas id="three-canvas"></canvas>
      
      <header class="header">
        <div class="header-content">
          <div class="logo-container" id="logo-link" style="cursor: pointer;">
            <img src="/logo_tr.png" alt="ROW X402 Logo" class="logo-image" />
            <div class="logo">ROW X402</div>
          </div>
          <nav class="nav">
            <a href="https://x.com/rowx402" target="_blank" class="nav-link">X</a>
            <a href="https://docs.rowx402.com" target="_blank" class="nav-link">DOCS</a>
            <a href="#about" class="nav-link" id="about-link">ABOUT</a>
          </nav>
        </div>
      </header>
      
      <footer class="footer">
        <div class="copyright">© 2025 ROW X402. All rights reserved.</div>
      </footer>
      
      <div class="about-overlay" id="about-overlay">
        <div class="about-content">
          <h1 class="about-title">The Bottleneck of Autonomy</h1>
          <p class="about-text">The promise of the Agent Economy—where AI software operates and transacts autonomously—is currently stifled by legacy financial infrastructure. AI agents cannot use credit cards; they cannot wait days for settlement. They require instant, automated, machine-readable payments.</p>
          <p class="about-text">The X402 protocol provides the necessary universal language for machine-to-machine payments over HTTP. However, implementing X402 at an enterprise scale—managing hundreds of distinct wallets, balancing gas fees, and enforcing compliance rules—creates a new, complex bottleneck.</p>
          <p class="about-text">ROW X402 is the abstraction layer that makes the X402 standard practical. We transform the complexity of on-chain account management into a seamless, single API call, allowing any business to launch a fully financially autonomous AI fleet instantly.</p>
          
          <h2 class="about-subtitle">From Code to Capital in Seconds</h2>
          <p class="about-text">ROW X402 is engineered to be the first and last step in preparing your AI agents for the decentralized economy. We deliver a comprehensive, zero-friction solution for rapid scaling.</p>
          
          <h3 class="about-section-title">What We Solve:</h3>
          <div class="about-feature">
            <h4 class="about-feature-title">Zero-Friction Onboarding</h4>
            <p class="about-text">We eliminate the need for manual seed phrase management, complex signing, and manual gas token acquisition. Agents are provisioned with smart, self-funded wallets in seconds.</p>
          </div>
          <div class="about-feature">
            <h4 class="about-feature-title">Unbroken Compliance</h4>
            <p class="about-text">Our rule-based smart wallets guarantee security. Funds are spent only on whitelisted X402 endpoints and never exceed pre-set spending limits, giving enterprises secure control over their autonomous budgets.</p>
          </div>
          <div class="about-feature">
            <h4 class="about-feature-title">Seamless Gas Abstraction</h4>
            <p class="about-text">Your agents only pay in the settlement currency (e.g., USDC). Our proprietary Row Network handles all native network gas fees, dramatically simplifying financial logic and maintenance.</p>
          </div>
          
          <h2 class="about-subtitle">Architecting the Autonomous Future</h2>
          <p class="about-text">Our vision extends beyond mere payment processing. We aim to be the foundational operating system for every autonomous piece of software that requires financial agency.</p>
          
          <h3 class="about-section-title">We are actively working on:</h3>
          <div class="about-feature">
            <h4 class="about-feature-title">Multi-Chain X402</h4>
            <p class="about-text">Expanding our row network to universally support all X402 standards across major L1s and L2s.</p>
          </div>
          <div class="about-feature">
            <h4 class="about-feature-title">ZK-Audit Layer</h4>
            <p class="about-text">Integrating Zero-Knowledge proofs to allow enterprises to audit compliance and spending rules without revealing sensitive internal usage logs to third parties.</p>
          </div>
          
          <p class="about-cta">Join the Infrastructure Revolution: If you are building an AI service that needs machine payments, or deploying an agent fleet that needs autonomy, ROW X402 is your indispensable partner. We build the ramps; you deploy the future.</p>
        </div>
      </div>
    </div>
  `
  
  // Three.js 초기화는 메인 페이지에서만
  const { camera } = initThreeJS()
  
  // ABOUT 모드 처리
  let isAboutMode = false
  
  const aboutOverlay = document.getElementById('about-overlay')!
  const aboutLink = document.getElementById('about-link')!
  const logoLink = document.getElementById('logo-link')!
  
  // 로고 클릭 시 메인으로 이동
  logoLink.addEventListener('click', () => {
    window.location.hash = ''
  })
  
  // Intersection Observer로 스크롤 시 요소 나타나기
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, observerOptions)
  
  // ABOUT 모드 활성화 시 observer 시작
  const setupAboutObserver = () => {
    if (!isAboutMode) return
    
    const aboutElements = aboutOverlay.querySelectorAll('.about-text, .about-feature, .about-subtitle, .about-section-title, .about-cta, .about-title')
    aboutElements.forEach(el => {
      el.classList.remove('visible')
      observer.observe(el)
    })
  }
  
  // 스크롤 이벤트 처리 (about-overlay의 스크롤 감지)
  let targetScrollProgress = 0
  let currentScrollProgress = 0
  let animationFrameId: number | null = null
  
  const updateCamera = () => {
    if (!isAboutMode || !camera) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
      return
    }
    
    // 부드러운 보간
    currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.1
    
    // 카메라 위치 조정
    const basePos = { x: 5, y: 2, z: 20 }
    const baseLook = { x: 4, y: 2, z: 14 }
    
    // 스크롤에 따라 카메라 이동 (더 강한 움직임)
    camera.position.x = basePos.x + currentScrollProgress * 8
    camera.position.y = basePos.y + currentScrollProgress * 5
    camera.position.z = basePos.z - currentScrollProgress * 12
    
    camera.lookAt(
      baseLook.x + currentScrollProgress * 6,
      baseLook.y + currentScrollProgress * 3,
      baseLook.z - currentScrollProgress * 8
    )
    
    animationFrameId = requestAnimationFrame(updateCamera)
  }
  
  const handleScroll = () => {
    if (!isAboutMode) return
    
    const scrollY = aboutOverlay.scrollTop
    const maxScroll = aboutOverlay.scrollHeight - aboutOverlay.clientHeight
    targetScrollProgress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0
  }
  
  aboutOverlay.addEventListener('scroll', handleScroll)
  
  // 해시 변경 감지
  const checkHash = () => {
    if (window.location.hash === '#about') {
      isAboutMode = true
      aboutOverlay.classList.add('active')
      document.body.style.overflow = 'auto'
      setTimeout(setupAboutObserver, 100)
      // ABOUT 모드 진입 시 초기 카메라 위치 설정 및 애니메이션 시작
      if (camera) {
        const basePos = { x: 5, y: 2, z: 20 }
        const baseLook = { x: 4, y: 2, z: 14 }
        camera.position.set(basePos.x, basePos.y, basePos.z)
        camera.lookAt(baseLook.x, baseLook.y, baseLook.z)
        currentScrollProgress = 0
        targetScrollProgress = 0
        updateCamera()
      }
    } else {
      isAboutMode = false
      aboutOverlay.classList.remove('active')
      document.body.style.overflow = 'hidden'
      currentScrollProgress = 0
      targetScrollProgress = 0
      // 메인 화면으로 복귀 시 카메라 원래 위치로
      if (camera) {
        camera.position.set(5, 2, 20)
        camera.lookAt(4, 2, 14)
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }
  }
  
  checkHash()
  window.addEventListener('hashchange', checkHash)
  
  // ABOUT 링크 클릭 처리
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.hash = '#about'
  })

function initThreeJS() {
  const canvas = document.getElementById('three-canvas') as HTMLCanvasElement
  const container = document.querySelector('.container') as HTMLDivElement

// Three.js 장면 설정
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ 
  canvas, 
  alpha: true,
  antialias: true 
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// 카메라 위치
camera.position.set(5, 2, 20)
camera.lookAt(4, 2, 14)

// 오렌지 땅 (뒤쪽 - 하늘/광원 쪽) - 조명 영향 없는 순수 색상
const orangeGroundGeometry = new THREE.PlaneGeometry(100, 100)
const orangeGroundMaterial = new THREE.MeshBasicMaterial({ 
  color: 0x0052fa
})
const orangeGround = new THREE.Mesh(orangeGroundGeometry, orangeGroundMaterial)
orangeGround.rotation.x = -Math.PI / 2
orangeGround.position.set(0, 0, -50) // 뒤쪽
scene.add(orangeGround)

// 보라색 땅 (앞쪽 - 카메라 쪽) - 조명 영향 없는 순수 색상
// 텍스트(z=0)와 붙은 변을 고정한 채로 2배 크기
const purpleGroundGeometry = new THREE.PlaneGeometry(400, 200)
const purpleGroundMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xeac001
})
const purpleGround = new THREE.Mesh(purpleGroundGeometry, purpleGroundMaterial)
purpleGround.rotation.x = -Math.PI / 2
// 뒤쪽 변이 z=0(텍스트 위치)에 오도록 위치 조정: 중심 z = 크기/2 = 200/2 = 100
purpleGround.position.set(0, 0, 100) // 앞쪽으로 이동하여 뒤쪽 변이 z=0에 고정
scene.add(purpleGround)

// 그림자만 받을 투명 평면 (전체) - 오렌지색 그림자
const shadowPlaneGeometry = new THREE.PlaneGeometry(200, 200)
const shadowPlaneMaterial = new THREE.ShadowMaterial({ 
  opacity: 0.4,
  color: 0x0052fa
})
const shadowPlane = new THREE.Mesh(shadowPlaneGeometry, shadowPlaneMaterial)
shadowPlane.rotation.x = -Math.PI / 2
shadowPlane.position.y = 0.01 // 살짝 위에
shadowPlane.receiveShadow = true
scene.add(shadowPlane)

// 광원 설정 (석양 - 주황색 하늘에서 낮은 각도)
// 카메라(z=20) -> 텍스트(z=0) -> 광원(z=-40) 순서
const light = new THREE.DirectionalLight(0x0052fa, 2.5)
light.position.set(20, 15, -50) // 텍스트 뒤편, 낮은 높이(석양)
light.castShadow = true
light.shadow.mapSize.width = 4096
light.shadow.mapSize.height = 4096
light.shadow.camera.near = 0.5
light.shadow.camera.far = 100
light.shadow.camera.left = -30
light.shadow.camera.right = 30
light.shadow.camera.top = 30
light.shadow.camera.bottom = -30
light.shadow.bias = -0.0001
scene.add(light)

// 환경광
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

// 텍스트 메시 저장
const textMeshes: THREE.Mesh[] = []
let mainTextMesh: THREE.Mesh | null = null

// 폰트 로드 및 3D 텍스트 생성
const fontLoader = new FontLoader()
fontLoader.load(
  'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
  (font) => {
    const text = 'ROW X 402'
    
    // 전체 텍스트를 하나의 메시로 생성
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 0.7,
      depth: 0.15,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
      bevelSegments: 5
    })
    
    textGeometry.computeBoundingBox()
    const bbox = textGeometry.boundingBox!
    const textWidth = bbox.max.x - bbox.min.x
    const rightOffset = textWidth * 0.2 // 우측으로 20% 이동
    // 텍스트 하단을 땅(y=0)에 붙임
    const baseY = -bbox.min.y
    
    const textMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff
    })
    
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.position.set(rightOffset, baseY, 0) // 오렌지/보라 경계선(z=0)에 배치
    textMesh.castShadow = true
    textMesh.receiveShadow = false
    
    scene.add(textMesh)
    textMeshes.push(textMesh)
    mainTextMesh = textMesh
    
    // 각 글자별로 개별 메시도 생성 (호버 효과용)
    const chars = text.split('')
    let xOffset = rightOffset
    
    chars.forEach((char, index) => {
      if (char === ' ') {
        xOffset += 0.28
        return
      }
      
      const charGeometry = new TextGeometry(char, {
        font: font,
        size: 0.7,
        depth: 0.15,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.01,
        bevelSegments: 5
      })
      
      charGeometry.computeBoundingBox()
      const charBbox = charGeometry.boundingBox!
      const charWidth = charBbox.max.x - charBbox.min.x
      const charBaseY = -charBbox.min.y // 땅에 붙임
      
      const charMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0
      })
      
      const charMesh = new THREE.Mesh(charGeometry, charMaterial)
      charMesh.position.set(xOffset, charBaseY, 0.01) // 경계선에 배치
      charMesh.userData.index = index
      charMesh.userData.baseY = charBaseY
      charMesh.userData.baseZ = 0.01
      
      scene.add(charMesh)
      textMeshes.push(charMesh)
      
      xOffset += charWidth + 0.05
    })
  }
)

// 마우스 위치 추적
let mouseX = 0
let mouseY = 0

container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect()
  mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1
  
  // 광원 위치 조정 (마우스 움직임에 따라, 텍스트 뒤편에서)
  light.position.x = 5 + mouseX * 5
  light.position.y = 3 - mouseY * 2
  light.position.z = -40 + mouseX * 12
})

container.addEventListener('mouseleave', () => {
  light.position.set(5, 3, -40)
})

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

  // 리사이즈 처리
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
  
  return { camera, textMesh: mainTextMesh }
}
