
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
import * as fs from 'fs';

//import { parseArrayBuffer } from 'midi-json-parser';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  randomize: 2,
  'Load Scene': loadScene // A function pointer, essentially
};

//midi-json-parser
// let buff = new ArrayBuffer(8);

// parseArrayBuffer(buff)
//     .then((json: JSON) => {
//       console.log(json.stringify);
//     });

//midi-parser-js
// var midiParser  = require('midi-parser-js');

// console.log("Reading ./test.mid as base64...")
// fs.readFile('./music/BTS - Boy In Luv.midi', 'base64', function (err: Error, data: string | Buffer) {
//   //if (err) throw new Error(err); 
//   console.log("Done!");
//   console.log("Converting base64 string to structured Array...")
//   var midiArray = midiParser.parse(data);
//   console.log("Done!");
//   console.log(midiArray);
// });

//midi-file-parser
// var midiFileParser = require('midi-file-parser');
// var file = fs.readFileSync('BTS - Boy In Luv.midi', 'binary');
// var midi = midiFileParser(file);

//midiConvert
var MidiConvert = require('./MidiConvert');
//var fs = require('file-system');

fs.readFile("BTS - Boy In Luv.midi", "binary", function(err: Error, midiBlob: ArrayBuffer|string) {
  if (!err) {
    var midi = MidiConvert.parse(midiBlob)
  }
})

// MidiConvert.load("path/to/midi.mid", function(midi : string) {
//   console.log(midi)
// });


//shapes
let icosphere: Icosphere;
let square: Square;
let cube: Cube;

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
  
  const camera = new Camera(vec3.fromValues(10, 30, 0), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.7, 0.7, 0.7, 1);
  gl.enable(gl.DEPTH_TEST);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);
 
  // This function will be called every frame
  function tick() {
    
    //U_tIME
    count++;
    
    let base_color = vec4.fromValues(255/255, 255/255, 255/255, 1);
      camera.update();
      stats.begin();

      var height = controls.randomize;

      gl.viewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.clear();

      lambert.setGeometryColor(base_color);
      renderer.render(camera, lambert, [square]);

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

