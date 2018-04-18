
import {vec3, vec4, mat3, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import * as fs from 'fs';

import Mesh from './geometry/Mesh';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';

import {readTextFile} from './globals';
import {setGL} from './globals';

import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';

const parseJson = require('parse-json');
let jsonFile: string; //jsonFile name

//objects
let marioString: string; //objString name
let mario: Mesh;

let buttonAstr: string;
let buttonA: Mesh;

let buttonFstr: string;
let buttonF: Mesh;

let buttonSstr: string;
let buttonS: Mesh;

let buttonDstr: string;
let buttonD: Mesh;

let buttonJstr: string;
let buttonJ: Mesh;

let buttonKstr: string;
let buttonK: Mesh;

let buttonLstr: string;
let buttonL: Mesh;
// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  'Load Scene': loadScene // A function pointer, essentially
};

//list of buttons to create
let buttons = Array<any>();
//shapes
let cube: Cube;
let square: Square;
//time
let count: number = 0.0;

function loadScene() {
  //Mario 
  marioString = readTextFile('./resources/obj/wahoo.obj');
  mario = new Mesh(marioString, vec3.fromValues(0, 0, 0));
  mario.translateVertices(vec3.fromValues(0,-5,-20));
  mario.create();

  square = new Square(vec3.fromValues(0,0,0));
  square.create();
}

function loadButtonsEasy() {
  buttonSstr = readTextFile('./resources/obj/button.obj');
  buttonS = new Mesh(buttonSstr, vec3.fromValues(0,0,0));
  buttonS.translateVertices(vec3.fromValues(-2,0,0));
  buttonS.create();

  buttonDstr = readTextFile('./resources/obj/button.obj');
  buttonD = new Mesh(buttonDstr, vec3.fromValues(0,0,0));
  buttonD.translateVertices(vec3.fromValues(-4.5,0,0));
  buttonD.create();

  buttonFstr = readTextFile('./resources/obj/button.obj');
  buttonF = new Mesh(buttonFstr, vec3.fromValues(0,0,0));
  buttonF.translateVertices(vec3.fromValues(-7,0,0));
  buttonF.create();

  buttonJstr = readTextFile('./resources/obj/button.obj');
  buttonJ = new Mesh(buttonJstr, vec3.fromValues(0,0,0));
  buttonJ.translateVertices(vec3.fromValues(2,0,0));
  buttonJ.create();

  buttonKstr = readTextFile('./resources/obj/button.obj');
  buttonK = new Mesh(buttonKstr, vec3.fromValues(0,0,0));
  buttonK.translateVertices(vec3.fromValues(4.5,0,0));
  buttonK.create();

  buttonLstr = readTextFile('./resources/obj/button.obj');
  buttonL = new Mesh(buttonLstr, vec3.fromValues(0,0,0));
  buttonL.translateVertices(vec3.fromValues(7,0,0));
  buttonL.create();
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
          if(number > 15 && number < 40) {
            let obj = {
              letter: "S",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if(number > 40 && number < 52) {
            let obj = {
              letter: "D", 
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if(number > 52 && number < 64) {
            let obj = {
              letter: "F", 
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if(number > 64 && number < 76) {
            let obj = {
              letter: "J", 
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if(number > 76 && number < 88) {
            let obj = {
              letter: "K", 
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if(number > 88 && number < 120) {
            let obj = {
              letter: "L", 
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          }
        }
      }
    }
  }  
}

function createButtons() {
  //since you have a list of buttons, lets create them all at once
  //the user will travel forward on the line
  for(let one of buttons) {
    var letter = one.letter;
    var duration = one.duration;
    var time = one.mark;
  }
}

function main() { 
  //parse JSON and get buttons
  parseJSON();

  //buttons
  createButtons();

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
  loadButtonsEasy();
  
  const camera = new Camera(vec3.fromValues(0, 5, 7), vec3.fromValues(0, 0, 0));
  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.4, 0.3, 0.9, 1);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  const button_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/button-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/button-frag.glsl')),  
  ]);

  const plate_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/plate-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/plate-frag.glsl')),  
  ]);

  //change fov
  camera.fovy = 1.5;

  // This function will be called every frame
  function tick() {
    //disable rollover controls
    // camera.controls.rotationSpeed = 0;
    // camera.controls.translationSpeed = 0;
    // camera.controls.zoomSpeed = 0;    
    
    //U_tIME
    count ++;  
      camera.update();
      stats.begin();

      gl.viewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.clear();
     
      //mario
     let base_color = vec4.fromValues(200/255, 60/255, 200/255, 1);
     lambert.setGeometryColor(base_color);
     renderer.render(camera, lambert, [mario]);
    //plate
    base_color = vec4.fromValues(150/255, 240/255, 255/255, 1);
    plate_lambert.setGeometryColor(base_color);
    renderer.render(camera, plate_lambert, [square]);

     //current easy buttons
      base_color = vec4.fromValues(200/255, 60/255, 200/255, 1);
      button_lambert.setGeometryColor(base_color);
      renderer.render(camera, button_lambert, [buttonS, buttonF, buttonJ, buttonK, buttonL]);
      base_color = vec4.fromValues(100/255, 160/255, 200/255, 1);
      button_lambert.setGeometryColor(base_color);
      renderer.render(camera, button_lambert, [buttonD, buttonF, buttonJ, buttonK, buttonL]);

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

this.rotationMatrix = function (axis: vec3, angle: number) {
  axis = vec3.normalize(axis, axis);
  var s = Math.sin(angle);
  var c = Math.cos(angle);
  var oc = 1.0 - c;

  return mat4.fromValues(oc * axis[0] * axis[0] + c, oc * axis[0] * axis[1] - axis[2] * s, oc * axis[2] * axis[0] + axis[1] * s, 0.0,
        oc * axis[0] * axis[1] + axis[2] * s, oc * axis[1] * axis[1] + c, oc * axis[1] * axis[2] - axis[0] * s, 0.0,
        oc * axis[2] * axis[0] - axis[1] * s, oc * axis[1] * axis[2] + axis[0] * s, oc * axis[2] * axis[2] + c, 0.0,
        0.0, 0.0, 0.0, 1.0);
}
