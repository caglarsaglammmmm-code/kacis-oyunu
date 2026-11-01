// Three.js'in yalnızca kullanılan parçalarını tek klasik betik yapar: çevrimdışı ve file:// üzerinde çalışır.
import { build } from 'esbuild';
await build({
  stdin: {
    contents: `export { Scene, Group, Mesh, PerspectiveCamera, OrthographicCamera, WebGLRenderer, WebGLRenderTarget, BufferGeometry, Float32BufferAttribute, BoxGeometry, SphereGeometry, CylinderGeometry, CircleGeometry, PlaneGeometry, TorusGeometry, RingGeometry, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, ShaderMaterial, SpriteMaterial, Sprite, Points, PointsMaterial, CanvasTexture, Color, PMREMGenerator, HemisphereLight, DirectionalLight, SpotLight, PointLight, AmbientLight, Vector3, SRGBColorSpace, ACESFilmicToneMapping, BackSide, DoubleSide, AdditiveBlending, RepeatWrapping, Fog } from 'three';`,
    resolveDir: process.cwd(),
    loader: 'js',
  },
  bundle: true, minify: true, format: 'iife', globalName: 'THREE', target: 'es2020', outfile: 'vendor/three.min.js', legalComments: 'none',
});
console.log('vendor/three.min.js hazır');
