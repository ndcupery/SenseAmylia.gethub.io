import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/shaders/projectPattern";
import { slugToSeed } from "@/lib/shaderSeed";

const cache = new Map<string, string>();

function renderToDataURL(
  slug: string,
  width: number,
  height: number,
  mode: number,
): string {
  const key = `${slug}-${width}x${height}-${mode}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const seed = slugToSeed(slug);

  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(width, height);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const scene = new THREE.Scene();

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_seed1: { value: seed.seed1 },
      u_seed2: { value: seed.seed2 },
      u_seed3: { value: seed.seed3 },
      u_color1: { value: new THREE.Vector3(...seed.colors[0]) },
      u_color2: { value: new THREE.Vector3(...seed.colors[1]) },
      u_color3: { value: new THREE.Vector3(...seed.colors[2]) },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_mode: { value: mode },
    },
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  scene.add(new THREE.Mesh(geometry, material));

  renderer.render(scene, camera);
  const dataURL = renderer.domElement.toDataURL("image/jpeg", 0.85);

  // Cleanup
  geometry.dispose();
  material.dispose();
  renderer.dispose();

  cache.set(key, dataURL);
  return dataURL;
}

export function renderHero(slug: string): string {
  return renderToDataURL(slug, 1920, 800, 0);
}

export function renderThumbnail(slug: string): string {
  return renderToDataURL(slug, 600, 338, 1);
}
