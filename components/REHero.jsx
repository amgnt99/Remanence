'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

const INFLUENCE_RADIUS = 0.17
const BLUR_INTENSITY   = 0.022
const GRAIN_INTENSITY  = 0.08
const PARTICLE_DENSITY = 0.18
const PARTICLE_OPACITY = 1.00
const RETURN_SPEED     = 0.055

const RE_PATH_STR =
  'M92.8,202.7l-4-6.6-10.2-16.8c-1.1-1.7-3-3-4.4-4.5s-4.2-2.2-6-2.8c-5.9-1.9-15.4,2.5-15.5,9.7l-.4,44c0,3.2-.5,6.5-2,9s-5.4,4-8.6,5c-9.5,3-16.7-1-25.7.8-6,1.2-12.3-1.1-14.4-7C.8,231.4,0,229.2,0,226.8V52c0-3.1,1.5-5.8,2.9-8.1,2.4-3.9,8.3-3,9.4-3.6,1.7-1,3-.7,4.7-.9,7.2-1,12.1.6,14.5.5l14-.8c1.8-.1,3.7.3,5.5.5,6.8,1,12.1-.7,14.5-.5l13.5.8c2.1.1,4.4-.3,6.4-.6,6.4-1,11.5.9,12.7.9l9.7.3c3,0,5.1.5,8.1,1.5l5.6,1.9c8.7,2.9,11.7,3.3,19.7,9.5s6.3,4.8,8.9,3.4,2.8-2.2,3-4.3l1.5-12.5c1.7-14.2,10.6-25.8,22.6-33.3s13.7-3.7,16.1-5,3.4-.3,4.7-.8c3.2-1.3,5.5-.7,8.8-.1l4.9,1c8.4,1.6,12.2,1.1,19.8,7.8l6.4,5.6c5.7,5,8.9,11.5,10.7,18.9s3,15.3-.3,20.1-10.6,7.5-10,10.2,2.7,3.4,4,4.8c4.6,4.7,1.9,11-2.2,16.2s-5.9,6.5-10.3,8.3l-7.9,3.1c-1.8.7-3.2,1.3-5,2-7.1,2.8-13.2-.3-19.4,1l-3.9-.4c-5.4,1.1-14.3-6.8-21-6.9s-5.3,3-5.4,6.3l-.4,13.1c-.8,7.9-3,15.1-6.2,22.3-2.2,4.9-5.8,8.8-8.7,13.2-1,1.6-2.3,2.6-3.5,4.1-1.9,2.3-3.7,4.2-6.2,5.8l-6.3,4c-5,3.2-6.1,8.4-3.1,13.5l4.2,7.2c3.6,6.2,6.9,12.2,10.7,18.3l14.1,22.9c1.6,2.7,3,5.6,3.3,8.6s-1,6.2-3.9,6.7l-10.7,1.9c-6.7,1.2-12.1-1.2-21-.2l-4.6.5c-4.2-.2-9.3-1.8-12-5.2-8.2-10.1-14.2-21.4-20.1-32.9ZM205.3,34.8c.4-2.3-2.5-3.5-3.8-3.2s-3.5,1.6-2.6,3.6,6,1.9,6.5-.4ZM212.6,66.5c.6-.5,1.3-2.1.5-2.7-6.3-4.9-15.9-3.7-15,1.2s9.5,6.4,14.4,1.6ZM102.8,124.3c6.2-3.5,9.9-9.3,10.5-16.6.7-7.6-2.3-16.8-9.1-19.4s-10.5-4.7-16.7-4.7-9.1,1.7-13.6.4h-2.9c-2.8-.6-5.8-1.1-8.4.2-5.3.5-10,4.7-10,10.3v23.3c0,3.6,1.9,7.2,5.3,8.6s9.2-.3,12.7,1h3.3c2.8,1,5.4.5,8.1.2l8.9-1c2.4-.3,6.3.8,11.9-2.4Z'

const PROJECTS = [
  { slug:'labsence-disponible',  video:'/videos/projects/labsence-disponible.mp4' },
  { slug:'lattention-captive',   video:'/videos/projects/lattention-captive.mp4' },
  { slug:'lautre-sous-la-peau',  video:'/videos/projects/lautre-sous-la-peau.mp4' },
  { slug:'la-distance-dissoute', video:'/videos/projects/la-distance-dissoute.mp4' },
  { slug:'la-boucle-affective',  video:'/videos/projects/la-boucle-affective.mp4' },
  { slug:'labsence-insistante',  video:'/videos/projects/labsence-insistante.mp4' },
]

// 3 couches façon Podium — cartes immenses décalées hors cadre,
// overlaps dramatiques, traversée progressive en profondeur.
//
// Phase 1 (p=0→0.8)  : zoom RE, cartes visibles en miniature dans le RE
// Phase 2 (p=0.8→1)  : caméra z=2→-35, traversée des 3 couches :
//   p≈0.89 — couche proche (z=-14/-18) occupe l'écran puis sort par les bords
//   p≈0.95 — couche médiane (z=-26/-30) domine
//   p≈1.00 — couche lointaine (z=-38/-42) révélée au fond
const CARDS = [
  // ch.1 → ch.6 : gauche→droite, haut→bas, proche→loin (z croissant)
  { proj:0, pos:[-10.5,  4.0, -13.0], rot:[ 0.06,-0.08,-0.10], phase:0.0, size:[12.0, 7.5] },  // ch.1 — le plus proche
  { proj:1, pos:[  0.5,  4.5, -17.0], rot:[-0.04, 0.06, 0.04], phase:1.1, size:[11.0, 6.8] },  // ch.2
  { proj:2, pos:[ 10.5,  3.5, -21.0], rot:[ 0.05,-0.07, 0.08], phase:2.2, size:[12.0, 7.5] },  // ch.3
  { proj:3, pos:[ -8.0, -4.0, -24.0], rot:[ 0.07,-0.05,-0.06], phase:0.6, size:[10.5, 6.5] },  // ch.4
  { proj:4, pos:[  1.0, -4.5, -28.0], rot:[ 0.04,-0.06, 0.03], phase:1.7, size:[11.0, 6.8] },  // ch.5
  { proj:5, pos:[  9.5, -3.5, -32.0], rot:[-0.05, 0.08, 0.05], phase:2.8, size:[ 9.5, 5.9] },  // ch.6 — le plus loin
]

const INIT_Z   = 12
const INIT_FOV = 42
const MAX_FOV  = 95

const VERT = /* glsl */`
  varying vec2 vUv;
  void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
`
const CARD_FRAG = /* glsl */`
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uGrayscale;
  void main(){
    vec4 c = texture2D(uMap, vUv);
    float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
    g = clamp((g - 0.5) * 1.4 + 0.5, 0.0, 1.0);
    gl_FragColor = vec4(mix(c.rgb, vec3(g), uGrayscale), c.a);
  }
`
const TRAIL_FRAG = /* glsl */`
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uPrev;
  uniform vec2  uMouse;
  uniform float uFade;
  void main(){
    vec4 prev = texture2D(uPrev,vUv)*uFade;
    float spot = smoothstep(0.060,0.0,length(vUv-uMouse));
    gl_FragColor = clamp(prev+vec4(spot*0.75),0.0,1.0);
  }
`

const RE_FRAG = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTrail;
  uniform sampler2D uReMask;
  uniform float     uTime;
  uniform float     uCamZ;

  uniform vec2  uMouseUV;
  uniform float uInfluenceRadius;
  uniform float uBlurIntensity;
  uniform float uGrainIntensity;
  uniform float uParticleDensity;
  uniform float uParticleOpacity;

  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
  float vn(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){float v=0.;float a=.5;
    for(int i=0;i<4;i++){v+=a*vn(p);p*=2.1;a*=.5;}return v;}

  const vec3 CREAM = vec3(0.961,0.957,0.941);

  void main(){
    vec2 uv = vUv;

    float trail = texture2D(uTrail,uv).r;
    float nx = fbm(uv*3.8+uTime*0.065)-0.5;
    float ny = fbm(uv*3.8-uTime*0.055+6.9)-0.5;
    vec2 d = vec2(nx,ny)*0.014 + vec2(nx,ny)*trail*0.11;
    vec2 distUv = clamp(uv+d,0.001,0.999);

    float mDist      = length(uv - uMouseUV);
    float mInfluence = smoothstep(uInfluenceRadius, 0.0, mDist);
    float mfx = fbm(uv*7.5+uTime*0.10)-0.5;
    float mfy = fbm(uv*7.5+uTime*0.09+4.3)-0.5;
    vec2  mD  = vec2(mfx,mfy) * mInfluence * uBlurIntensity;
    vec2  finalDistUv = clamp(distUv+mD, 0.001, 0.999);

    float mask0 = texture2D(uReMask, distUv).r;
    float mask1 = texture2D(uReMask, finalDistUv).r;
    float mask  = mix(mask0, mask1, mInfluence*0.70);

    float edgeG      = vn(distUv*520.+uTime*13.)*0.15-0.075;
    float smooth_mask = smoothstep(0.33+edgeG, 0.67+edgeG, mask);
    float edgeDist   = abs(mask-0.5);

    float reBound = smoothstep(0.28, 0.0, edgeDist);

    float localFX = mInfluence * max(reBound, smooth_mask*0.30);
    float microG  = (vn(uv*700.+uTime*18.)-0.5) * localFX * uGrainIntensity;

    float mInfl2 = max(smooth_mask, reBound) * mInfluence;

    float g1 = step(1.0 - uParticleDensity*0.55, vn(uv*300.+uTime*3.1));
    float g2 = step(1.0 - uParticleDensity*0.40, vn(uv*160.+uTime*2.3+3.7));
    float g3 = step(1.0 - uParticleDensity*0.30, vn(uv*80. +uTime*1.7+7.3));
    float gEdge = step(1.0 - uParticleDensity*0.70, vn(uv*45. +uTime*4.1+1.9));
    float gFly  = step(1.0 - uParticleDensity*0.25, vn(uv*240.+uTime*5.2+9.1));

    float mouseOnRe = max(smooth_mask, reBound) * mInfluence;

    float gate     = step(vn(uv*32.+uTime*0.07), mouseOnRe);
    float edgeGate = step(vn(uv*28.+uTime*0.05+4.2), mouseOnRe*reBound*1.5);

    float cursor_dust = clamp(
        g1 * gate +
        g2 * gate +
        g3 * gate +
        gEdge * edgeGate,
        0.0, 1.0
    );

    float gTrail    = step(1.0 - uParticleDensity*0.85, vn(uv*190.0 + uTime*2.5 + 2.2));
    float trailGate = step(vn(uv*22.0 + uTime*0.04 + 5.0), trail);
    float trail_dust = gTrail * trailGate * step(0.25, reBound);

    float dustHoles = min(cursor_dust + trail_dust, 1.0);

    vec3 color = CREAM + microG;

    float proximity = smoothstep(0.0,3.0,uCamZ);
    float alpha     = (1.0 - smooth_mask) * proximity;
    alpha = max(0.0, alpha - dustHoles * uParticleOpacity * proximity);

    gl_FragColor = vec4(color, alpha);
  }
`

export default function REHero({ scrollRef }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return
    const vw = window.innerWidth
    const vh = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(vw, vh)
    renderer.setClearColor(0x0a0a0a)
    Object.assign(renderer.domElement.style, {
      position:'absolute',top:0,left:0,width:'100%',height:'100%',
    })
    container.appendChild(renderer.domElement)

    const maskCanvas = document.createElement('canvas')
    maskCanvas.width  = vw
    maskCanvas.height = vh
    const mctx    = maskCanvas.getContext('2d')
    const reSize  = Math.min(vw,vh)*0.58
    const reScale = reSize/Math.min(250.1,240.9)
    mctx.fillStyle='white'
    mctx.save()
    mctx.translate((vw-250.1*reScale)/2,(vh-240.9*reScale)/2)
    mctx.scale(reScale,reScale)
    mctx.fill(new Path2D(RE_PATH_STR),'evenodd')
    mctx.restore()
    const maskTex = new THREE.CanvasTexture(maskCanvas)

    const fovRad = INIT_FOV*Math.PI/180
    const planeH = 2*Math.tan(fovRad/2)*INIT_Z
    const planeW = planeH*(vw/vh)

    const fbOpts = { minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter }
    const TRES   = 512
    let trailRead  = new THREE.WebGLRenderTarget(TRES,TRES,fbOpts)
    let trailWrite = new THREE.WebGLRenderTarget(TRES,TRES,fbOpts)
    const trailScene = new THREE.Scene()
    const trailCam   = new THREE.OrthographicCamera(-1,1,1,-1,0,1)
    const trailUnis  = {
      uPrev:  { value: trailRead.texture },
      uMouse: { value: new THREE.Vector2(-2,-2) },
      uFade:  { value: 0.968 },
    }
    trailScene.add(new THREE.Mesh(
      new THREE.PlaneGeometry(2,2),
      new THREE.ShaderMaterial({ uniforms:trailUnis, vertexShader:VERT, fragmentShader:TRAIL_FRAG })
    ))

    const scene  = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0a)
    // Brouillard très léger — les couches lointaines restent lisibles
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.010)

    const camera = new THREE.PerspectiveCamera(INIT_FOV, vw/vh, 0.1, 500)
    camera.position.z = INIT_Z

    const smoothedMouse = new THREE.Vector2(-2,-2)
    const reUnis = {
      uTrail:           { value: trailRead.texture },
      uReMask:          { value: maskTex },
      uTime:            { value: 0.0 },
      uCamZ:            { value: INIT_Z },
      uMouseUV:         { value: smoothedMouse },
      uInfluenceRadius: { value: INFLUENCE_RADIUS },
      uBlurIntensity:   { value: BLUR_INTENSITY },
      uGrainIntensity:  { value: GRAIN_INTENSITY },
      uParticleDensity: { value: PARTICLE_DENSITY },
      uParticleOpacity: { value: PARTICLE_OPACITY },
    }
    const reMat = new THREE.ShaderMaterial({
      transparent:true, depthWrite:false, side:THREE.DoubleSide,
      uniforms:reUnis, vertexShader:VERT, fragmentShader:RE_FRAG,
    })
    const reMesh = new THREE.Mesh(new THREE.PlaneGeometry(planeW,planeH),reMat)
    reMesh.renderOrder = 10
    scene.add(reMesh)

    const meshes=[], videos=[]
    CARDS.forEach((card) => {
      const proj = PROJECTS[card.proj]
      // Géométrie individuelle — taille définie par carte
      const geo = new THREE.PlaneGeometry(card.size[0], card.size[1])

      // VideoTexture — autoplay muted loop
      const vid = document.createElement('video')
      vid.src         = proj.video
      vid.autoplay    = true
      vid.muted       = true
      vid.loop        = true
      vid.playsInline = true
      vid.crossOrigin = 'anonymous'
      vid.play().catch(() => {})

      const tex = new THREE.VideoTexture(vid)
      tex.colorSpace = THREE.SRGBColorSpace

      const mat = new THREE.ShaderMaterial({
        uniforms: { uMap: { value: tex }, uGrayscale: { value: 1.0 } },
        vertexShader: VERT,
        fragmentShader: CARD_FRAG,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...card.pos)
      mesh.rotation.set(...card.rot)
      mesh.userData.baseY = card.pos[1]
      mesh.userData.phase = card.phase
      mesh.userData.slug  = proj.slug
      scene.add(mesh); meshes.push(mesh); videos.push(vid)
    })

    const raycaster   = new THREE.Raycaster()
    const mouse2D     = new THREE.Vector2()
    const hoverState  = new Map(meshes.map(m=>([m,{cur:1,tgt:1,gsCur:1.0,gsTgt:1.0}])))
    let   hoveredMesh = null

    const mouseClient={x:-1,y:-1}
    const computeUV=()=>{
      const cz=camera.position.z
      if(cz<=0.05){trailUnis.uMouse.value.set(-2,-2);return}
      const fRad=camera.fov*Math.PI/180
      const halfH=Math.tan(fRad/2), halfW=halfH*(vw/vh)
      const ndcX=(mouseClient.x/vw)*2-1, ndcY=-(mouseClient.y/vh)*2+1
      const u=ndcX*halfW*cz/planeW+0.5, v=ndcY*halfH*cz/planeH+0.5
      if(u>0.01&&u<0.99&&v>0.01&&v<0.99) trailUnis.uMouse.value.set(u,v)
      else trailUnis.uMouse.value.set(-2,-2)
    }
    const onMove=e=>{
      mouseClient.x=e.clientX; mouseClient.y=e.clientY
      mouse2D.x=(e.clientX/vw)*2-1
      mouse2D.y=-(e.clientY/vh)*2+1
      raycaster.setFromCamera(mouse2D,camera)
      const hits=raycaster.intersectObjects(meshes)
      const hit=hits.length>0?hits[0].object:null
      renderer.domElement.style.cursor=hit?'pointer':'default'
      if(hit!==hoveredMesh){
        if(hoveredMesh){
          hoverState.get(hoveredMesh).tgt=1.0
          hoverState.get(hoveredMesh).gsTgt=1.0
        }
        hoveredMesh=hit
        if(hit){
          hoverState.get(hit).tgt=1.07
          hoverState.get(hit).gsTgt=0.0
        }
      }
    }
    const onLeaveCanvas=()=>{
      if(hoveredMesh){
        hoverState.get(hoveredMesh).tgt=1.0
        hoverState.get(hoveredMesh).gsTgt=1.0
        hoveredMesh=null
      }
      renderer.domElement.style.cursor='default'
    }
    const onClick=e=>{
      mouse2D.x=(e.clientX/vw)*2-1
      mouse2D.y=-(e.clientY/vh)*2+1
      raycaster.setFromCamera(mouse2D,camera)
      const hits=raycaster.intersectObjects(meshes)
      if(hits.length>0){
        const slug=hits[0].object.userData.slug
        if(slug) window.location.href=`/projects/${slug}`
      }
    }
    const onLeave=()=>{trailUnis.uMouse.value.set(-2,-2);onLeaveCanvas()}
    window.addEventListener('mousemove',onMove)
    window.addEventListener('mouseleave',onLeave)
    container.addEventListener('click',onClick)

    const clock=new THREE.Clock()
    let camZ=INIT_Z, camFOV=INIT_FOV, rafId

    // Phase 1 (p=0→0.8) : zoom RE — caméra z=12→2, FOV=42°→95° (inchangé)
    // Phase 2 (p=0.8→1) : traversée Podium — caméra z=2→-35 (37 unités)
    //   → passe couche proche (z=-14/-18) à p≈0.886/0.908
    //   → passe couche médiane (z=-26/-30) à p≈0.951/0.973
    //   → révèle couche lointaine (z=-38/-42) à p=1.00 (3-7 unités devant)
    const getTargetZ = p =>
      p <= 0.8
        ? INIT_Z - (p/0.8) * (INIT_Z - 2)
        : 2 - ((p-0.8)/0.2) * 37

    const tick=()=>{
      rafId=requestAnimationFrame(tick)
      const t=clock.getElapsedTime(), p=scrollRef.current||0

      computeUV()
      trailUnis.uPrev.value=trailRead.texture
      renderer.setRenderTarget(trailWrite)
      renderer.render(trailScene,trailCam)
      const tmp=trailRead; trailRead=trailWrite; trailWrite=tmp

      const tx=trailUnis.uMouse.value.x, ty=trailUnis.uMouse.value.y
      const onPlane=tx>0.01&&tx<0.99&&ty>0.01&&ty<0.99
      if(onPlane){
        smoothedMouse.x+=(tx-smoothedMouse.x)*RETURN_SPEED
        smoothedMouse.y+=(ty-smoothedMouse.y)*RETURN_SPEED
      } else {
        smoothedMouse.x+=(-2-smoothedMouse.x)*RETURN_SPEED*0.35
        smoothedMouse.y+=(-2-smoothedMouse.y)*RETURN_SPEED*0.35
      }

      const ss=p*p*(3-2*p)
      camZ+=(getTargetZ(p)-camZ)*0.08
      camFOV+=(INIT_FOV+ss*(MAX_FOV-INIT_FOV)-camFOV)*0.07
      camera.position.z=camZ
      if(Math.abs(camera.fov-camFOV)>0.02){camera.fov=camFOV;camera.updateProjectionMatrix()}
      meshes.forEach(m=>{
        m.position.y=m.userData.baseY+Math.sin(t*0.25+m.userData.phase)*0.10
        const hs=hoverState.get(m)
        hs.cur+=(hs.tgt-hs.cur)*0.07
        hs.gsCur+=(hs.gsTgt-hs.gsCur)*0.06
        m.scale.setScalar(hs.cur)
        m.material.uniforms.uGrayscale.value=hs.gsCur
      })

      reUnis.uTrail.value=trailRead.texture
      reUnis.uTime.value=t
      reUnis.uCamZ.value=camZ

      renderer.setRenderTarget(null)
      renderer.render(scene,camera)
    }
    tick()

    return()=>{
      cancelAnimationFrame(rafId)
      meshes.forEach(m=>{m.geometry.dispose();m.material.dispose()})
      videos.forEach(v=>{v.pause();v.src='';v.load()})
      trailRead.dispose();trailWrite.dispose()
      maskTex.dispose();reMat.dispose();renderer.dispose()
      window.removeEventListener('mousemove',onMove)
      window.removeEventListener('mouseleave',onLeave)
      container.removeEventListener('click',onClick)
      if(container.contains(renderer.domElement))container.removeChild(renderer.domElement)
    }
  },[])

  return <div ref={mountRef} style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />
}
