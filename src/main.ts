import {vec3, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Mesh from './geometry/Mesh';

import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';

import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
//import * as fs from 'fs';


// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  randomize: 2,
  'Load Scene': loadScene // A function pointer, essentially
};

//shapes
let icosphere: Icosphere;
let square: Square;
let cube: Cube;

let iteration: number;
let axiom: string;
let height: number;
//time
let count: number = 0.0;

function loadScene() {
  square = new Square(vec3.fromValues(0,0,0));
  square.create();
}

function main() {
    
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.addColor(controls, 'color');
  gui.add(controls, 'shaders', ['lambert']);
  gui.add(controls, 'randomize', 0, 3).step(1);
  gui.add(controls, 'iterations', 0, 5).step(1);
  gui.add(controls, 'shape', ['coral']);
  gui.add(controls, 'Load Scene');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();
  
  const camera = new Camera(vec3.fromValues(-1000, 500, -1000), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.3, 0.7, 0.9, 1);
  gl.enable(gl.DEPTH_TEST);


  const base_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/base-lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/base-lambert-frag.glsl')),
  ]);
 
  // This function will be called every frame
  function tick() {
    
    //U_tIME
    count++;
    
    let base_color = vec4.fromValues(64/255, 255/255, 255/255, 1);
      camera.update();
      stats.begin();

      var height = controls.randomize;

      gl.viewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.clear();

      base_lambert.setGeometryColor(base_color);
      renderer.render(camera, base_lambert, [square]);

    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();

