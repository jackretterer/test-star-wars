"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LightSpeed() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05020f, 0.012);

    const camera = new THREE.PerspectiveCamera(
      72,
      mount.clientWidth / mount.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 1.2, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x05020f, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // ---------- Warp streaks ----------
    const STREAK_COUNT = 1400;
    const streakGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(STREAK_COUNT * 6); // 2 verts per streak
    const colors = new Float32Array(STREAK_COUNT * 6);
    const speeds = new Float32Array(STREAK_COUNT);

    const palette = [
      new THREE.Color(0x66ccff),
      new THREE.Color(0xaa88ff),
      new THREE.Color(0xff77cc),
      new THREE.Color(0xffffff),
      new THREE.Color(0x88ffee),
    ];

    const resetStreak = (i: number, initial = false) => {
      const radius = 2 + Math.random() * 28;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = initial
        ? -Math.random() * 600
        : -600 - Math.random() * 200;
      const len = 6 + Math.random() * 28;

      positions[i * 6 + 0] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z - len;

      const c = palette[Math.floor(Math.random() * palette.length)];
      // head bright, tail dim
      colors[i * 6 + 0] = c.r;
      colors[i * 6 + 1] = c.g;
      colors[i * 6 + 2] = c.b;
      colors[i * 6 + 3] = c.r * 0.05;
      colors[i * 6 + 4] = c.g * 0.05;
      colors[i * 6 + 5] = c.b * 0.05;

      speeds[i] = 6 + Math.random() * 14;
    };

    for (let i = 0; i < STREAK_COUNT; i++) resetStreak(i, true);

    streakGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    streakGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const streakMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const streaks = new THREE.LineSegments(streakGeo, streakMat);
    scene.add(streaks);

    // ---------- Distant stars ----------
    const STAR_COUNT = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3 + 0] = (Math.random() - 0.5) * 400;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 400;
      starPos[i * 3 + 2] = -Math.random() * 800 - 100;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.6,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      })
    );
    scene.add(stars);

    // ---------- Spaceship ----------
    const ship = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xdfe6f5,
      metalness: 0.85,
      roughness: 0.25,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x223355,
      metalness: 0.6,
      roughness: 0.4,
    });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x66ccff });

    // Fuselage
    const fuselage = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.4, 2.4, 24),
      bodyMat
    );
    fuselage.rotation.x = Math.PI / 2;
    ship.add(fuselage);

    // Nose cone
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.9, 24),
      bodyMat
    );
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = -1.65;
    ship.add(nose);

    // Cockpit
    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: 0x66ccff,
        metalness: 0.9,
        roughness: 0.05,
        emissive: 0x113355,
      })
    );
    cockpit.position.set(0, 0.18, -0.6);
    ship.add(cockpit);

    // Wings
    const wingGeo = new THREE.BoxGeometry(2.2, 0.06, 0.7);
    const wings = new THREE.Mesh(wingGeo, bodyMat);
    wings.position.z = 0.2;
    ship.add(wings);

    // Wing accent stripe
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.062, 0.18),
      accentMat
    );
    stripe.position.z = 0.2;
    ship.add(stripe);

    // Tail fin
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.55, 0.5),
      bodyMat
    );
    fin.position.set(0, 0.25, 0.9);
    ship.add(fin);

    // Engines
    const engineGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.5, 20);
    const engineL = new THREE.Mesh(engineGeo, accentMat);
    engineL.rotation.x = Math.PI / 2;
    engineL.position.set(-0.55, 0, 1.05);
    ship.add(engineL);
    const engineR = engineL.clone();
    engineR.position.x = 0.55;
    ship.add(engineR);

    // Engine glow
    const makeGlow = (x: number) => {
      const g = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), glowMat);
      g.position.set(x, 0, 1.32);
      return g;
    };
    const glowL = makeGlow(-0.55);
    const glowR = makeGlow(0.55);
    ship.add(glowL, glowR);

    // Engine point lights
    const lightL = new THREE.PointLight(0x66ccff, 3, 6);
    lightL.position.set(-0.55, 0, 1.4);
    const lightR = new THREE.PointLight(0xaa88ff, 3, 6);
    lightR.position.set(0.55, 0, 1.4);
    ship.add(lightL, lightR);

    ship.position.set(0, -0.4, 2.5);
    ship.rotation.y = Math.PI; // face camera direction of travel
    scene.add(ship);

    // ---------- Lights ----------
    scene.add(new THREE.AmbientLight(0x334466, 0.6));
    const keyLight = new THREE.DirectionalLight(0xaaccff, 1.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xff88cc, 0.8);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // ---------- Animate ----------
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // Move streaks toward camera
      const pos = streakGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < STREAK_COUNT; i++) {
        const v = speeds[i] * dt * 60;
        pos[i * 6 + 2] += v;
        pos[i * 6 + 5] += v;
        if (pos[i * 6 + 5] > 10) {
          resetStreak(i);
        }
      }
      streakGeo.attributes.position.needsUpdate = true;

      // Ship subtle bob + mouse-follow tilt
      const targetX = mouse.x * 1.2;
      const targetY = -mouse.y * 0.6 - 0.4 + Math.sin(t * 1.4) * 0.08;
      ship.position.x += (targetX - ship.position.x) * 0.05;
      ship.position.y += (targetY - ship.position.y) * 0.05;
      ship.rotation.z = -mouse.x * 0.25 + Math.sin(t * 1.2) * 0.04;
      ship.rotation.x = mouse.y * 0.15 + Math.sin(t * 0.9) * 0.02;

      // Engine pulse
      const pulse = 0.85 + Math.sin(t * 20) * 0.15;
      glowL.scale.setScalar(pulse);
      glowR.scale.setScalar(pulse);
      lightL.intensity = 2.5 + pulse;
      lightR.intensity = 2.5 + pulse;

      // Slight camera sway
      camera.position.x = Math.sin(t * 0.3) * 0.15;
      camera.position.y = 1.2 + Math.cos(t * 0.4) * 0.08;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      streakGeo.dispose();
      streakMat.dispose();
      starGeo.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
