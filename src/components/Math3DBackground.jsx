import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MATH_SYMBOLS = ['∑', 'π', '∞', '√', '∫', 'Δ', 'θ', '+', '÷', '±', 'λ', 'Ω', 'α', 'β', 'ƒ'];

export default function Math3DBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.015);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountNode.appendChild(renderer.domElement);

    // Lighting (dim, non-intrusive for WCAG compliance)
    const ambientLight = new THREE.AmbientLight(0x6366f1, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xa855f7, 2, 80);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 80);
    pointLight2.position.set(-20, -20, 10);
    scene.add(pointLight2);

    // Generate Textures for 3D Symbols
    const createSymbolTexture = (symbol, color = '#a5b4fc') => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, 256, 256);
      
      // Radial glow
      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
      grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      // Symbol Text
      ctx.font = 'bold 110px "Inter", "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 20;
      ctx.fillText(symbol, 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    // Create Mesh Objects for Symbols
    const symbolGroup = new THREE.Group();
    const symbolItems = [];
    const symbolCount = 45;

    const colors = ['#818cf8', '#c084fc', '#22d3ee', '#f472b6', '#38bdf8'];

    for (let i = 0; i < symbolCount; i++) {
      const symbol = MATH_SYMBOLS[i % MATH_SYMBOLS.length];
      const color = colors[i % colors.length];
      const texture = createSymbolTexture(symbol, color);

      // Double-sided 3D floating plane
      const geometry = new THREE.PlaneGeometry(3.5, 3.5);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Random 3D Positions
      mesh.position.x = (Math.random() - 0.5) * 60;
      mesh.position.y = (Math.random() - 0.5) * 45;
      mesh.position.z = (Math.random() - 0.5) * 40;

      // Random Rotation Speed & Float Parameters
      const rotSpeedX = (Math.random() - 0.5) * 0.015;
      const rotSpeedY = (Math.random() - 0.5) * 0.015;
      const floatSpeed = 0.5 + Math.random() * 1.5;
      const floatOffset = Math.random() * Math.PI * 2;
      const initialY = mesh.position.y;

      symbolItems.push({
        mesh,
        rotSpeedX,
        rotSpeedY,
        floatSpeed,
        floatOffset,
        initialY,
      });

      symbolGroup.add(mesh);
    }
    scene.add(symbolGroup);

    // Background floating particle dust
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 200;
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 70;
      dustPositions[i + 1] = (Math.random() - 0.5) * 70;
      dustPositions[i + 2] = (Math.random() - 0.5) * 50;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x818cf8,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (event) => {
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 4;
      targetMouseY = -(event.clientY / window.innerHeight - 0.5) * 4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX;
      camera.position.y = mouseY;
      camera.lookAt(0, 0, 0);

      // Animate symbols
      symbolItems.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.position.y =
          item.initialY + Math.sin(elapsedTime * item.floatSpeed + item.floatOffset) * 1.5;
      });

      // Slowly rotate dust and symbol group
      symbolGroup.rotation.y = elapsedTime * 0.03;
      dustParticles.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)',
      }}
    />
  );
}
