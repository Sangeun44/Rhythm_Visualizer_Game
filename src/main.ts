
import {vec3, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Mesh from './geometry/Mesh';

import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import {readTextFile} from './globals';

import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import * as fs from 'fs';

const parseJson = require('parse-json');

let jsonFile: string;
let obj0: string;
let mesh0: Mesh;


// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  randomize: 2,
  'Load Scene': loadScene // A function pointer, essentially
};


//a button representation of a note
var button = {
  letter: "",
  duration: 0,
  color: vec3,
}

//list of buttons to create
let buttons = Array<Object>();

//shapes
let icosphere: Icosphere;
let square: Square;
let cube: Cube;

//time
let count: number = 0.0;

function loadScene() {
  cube = new Cube(vec3.fromValues(0,0,0));
  cube.create();
  mesh0 = new Mesh(obj0, vec3.fromValues(0, 0, 0));
  mesh0.create();
}

//read the JSON file determined by the user
//currntly doing a test midi json
function parseJSON() {
  jsonFile = readTextFile('./resources/music/json/BTS - RUN.json');
  const json = jsonFile;
  
  var midi = parseJson(json);
  var tracks = midi["tracks"];
  parseTracks(tracks);
}

//easy version
function parseTracks(tracks : any) {
//tracks are in an array
for(let track of tracks) {
  //track's notes are in an array
  let notes = [];
  notes = track["notes"];
    //if the track has notes to be played
    if(notes.length > 0) {
      var currTime = 0;
      for(let note of notes) {
        //name, midi, time, velocity, duration
        //time passed per note
        var time = note["time"];
        var deltaTime = time - currTime;
        currTime = time;

        var number = note["midi"];
        
        var duration = note ["duration"];

        //for buttons that happen 0.3
        if(deltaTime > 0.28) {
          //cutoffs: 28, 40, 52, 64, 76, 88, 100
          if(number > 28 && number < 40) {
            var obj = {
              letter: "A",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
            console.log(obj.mark);
            console.log(obj.letter);
          } else if(number > 40 && number < 52) {
            var obj = {
              letter: "S", 
              mark: time,
              duration: duration
            }
            buttons.push(obj);
            console.log(obj.mark);
            console.log(obj.letter);
          } else if(number > 52 && number < 64) {
            var obj = {
              letter: "D", 
              mark: time,
              duration: duration
            }
            buttons.push(obj);
            console.log(obj.mark);
            console.log(obj.letter);
          } else if(number > 64 && number < 76) {
            var obj = {
              letter: "J", 
              mark: time,
              duration: duration
            }
            buttons.push(obj);
            console.log(obj.mark);
            console.log(obj.letter);
          } else if(number > 76 && number < 88) {
            var obj = {
              letter: "K", 
              mark: time,
              duration: duration
            }
            buttons.push(obj);
            console.log(obj.mark);
            console.log(obj.letter);
          } else if(number > 88 && number < 100) {
            var obj = {
              letter: "L", 
              mark: time,
              duration: duration
            }
            buttons.push(obj);
            console.log(obj.mark);
            console.log(obj.letter);
          }
        }
      }
    }
  }  
}


function createButtons() {
  //since you have a list of buttons, 
}

function main() { 
  //parse JSON and get buttons
  parseJSON();


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

  //scene 
  obj0 = readTextFile('./resources/obj/wahoo.obj');

  // Initial call to load scene
  loadScene();
  
  const camera = new Camera(vec3.fromValues(0, 15, 30), vec3.fromValues(0, 0, 0));

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

      gl.viewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.clear();

      lambert.setGeometryColor(base_color);
      renderer.render(camera, lambert, [cube, mesh0]);

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

