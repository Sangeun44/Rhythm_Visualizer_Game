import {vec3, vec4, mat3, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import * as fs from 'fs';

import Mesh from './geometry/Mesh';
import Track from './geometry/Track';
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

//list of buttons to create
let buttons = Array<any>();
let keyBoard = Array<Mesh>();
let track: Track;
let gameDiff: string;
let startGame = false;

//shapes
let cube: Cube;
let square: Square;

//time
let count: number = 0.0;

//objects
let marioString: string; //objString name
let mario: Mesh;

let buttonAstr: string;
let buttonA: Mesh;
let downA: boolean;

let buttonFstr: string;
let buttonF: Mesh;
let downF: boolean;

let buttonSstr: string;
let buttonS: Mesh;
let downS: boolean;

let buttonDstr: string;
let buttonD: Mesh;
let downD: boolean;

let buttonJstr: string;
let buttonJ: Mesh;
let downJ: boolean;

let buttonKstr: string;
let buttonK: Mesh;
let downK: boolean;

let buttonLstr: string;
let buttonL: Mesh;
let downL: boolean;

let buttonPstr: string;
let buttonP: Mesh;
let downP: boolean;

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  Difficulty: "easy",
  'Load Scene': loadScene // A function pointer, essentially
};

function play_music() {
  var JukeBox = new AudioContext();
  fetch('./resources/music/mp3/bts - run.mp3')
    .then(r=>r.arrayBuffer())
    .then(b=>JukeBox.decodeAudioData(b))
    .then(data=>{
        const audio_buf = JukeBox.createBufferSource();
        audio_buf.buffer = data;
        audio_buf.loop = true;
        audio_buf.connect(JukeBox.destination);
        audio_buf.start(0);
        });

        console.log(`Music On!`);
}

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
  buttonS.translateVertices(vec3.fromValues(-7,0,0));
  buttonS.create();

  buttonDstr = readTextFile('./resources/obj/button.obj');
  buttonD = new Mesh(buttonDstr, vec3.fromValues(0,0,0));
  buttonD.translateVertices(vec3.fromValues(-4.5,0,0));
  buttonD.create();

  buttonFstr = readTextFile('./resources/obj/button.obj');
  buttonF = new Mesh(buttonFstr, vec3.fromValues(0,0,0));
  buttonF.translateVertices(vec3.fromValues(-2,0,0));
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

  keyBoard.push(buttonS, buttonD, buttonF, buttonJ, buttonK, buttonL);
}

function loadButtonsHard() {
  buttonAstr = readTextFile('./resources/obj/button.obj');
  buttonA = new Mesh(buttonAstr, vec3.fromValues(0,0,0));
  buttonA.translateVertices(vec3.fromValues(-8.5,0,0));
  buttonA.create();

  buttonSstr = readTextFile('./resources/obj/button.obj');
  buttonS = new Mesh(buttonSstr, vec3.fromValues(0,0,0));
  buttonS.translateVertices(vec3.fromValues(-7,0,0));
  buttonS.create();

  buttonDstr = readTextFile('./resources/obj/button.obj');
  buttonD = new Mesh(buttonDstr, vec3.fromValues(0,0,0));
  buttonD.translateVertices(vec3.fromValues(-4.5,0,0));
  buttonD.create();

  buttonFstr = readTextFile('./resources/obj/button.obj');
  buttonF = new Mesh(buttonFstr, vec3.fromValues(0,0,0));
  buttonF.translateVertices(vec3.fromValues(-2,0,0));
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

  buttonPstr = readTextFile('./resources/obj/button.obj');
  buttonP = new Mesh(buttonPstr, vec3.fromValues(0,0,0));
  buttonP.translateVertices(vec3.fromValues(8.5,0,0));
  buttonP.create();

  keyBoard.push(buttonA, buttonS, buttonD, buttonF, buttonJ, buttonK, buttonL, buttonP);
}

//read the JSON file determined by the user
//currntly doing a test midi json
function parseJSON() {
  jsonFile = readTextFile('./resources/music/json/BTS - RUN.json');
  const json = jsonFile;
  
  var midi = parseJson(json);
  console.log(midi);
  var tracks = midi["tracks"];
  console.log("midi" + tracks.length);
  parseTracks(tracks);
}

//easy version
function parseTracks(tracks : any) {
  //tracks are in an array
  for(let track of tracks) {
    console.log("track" + track.length);
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
          if(deltaTime > 0.24) {
            //cutoffs: 28, 40, 52, 64, 76, 88, 100
            if(number > 15 && number < 40) {
              console.log("15 to 40");
              let obj = {
               letter: "S",
                mark: time,
                duration: duration
              }
              buttons.push(obj);
            } else if(number > 40 && number < 52) {
              console.log("40 to 52");
              let obj = {
                letter: "D", 
                mark: time,
                duration: duration
              }
              buttons.push(obj);
            } else if(number > 52 && number < 64) {
              console.log("64 to 76");
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

function loadTrack() {
  //track 
  track = new Track(vec3.fromValues(0,0,0));
  loadTrackEasy();
  console.log("track loads");
  track.create();
  //console.log("track positions" + track.pos);
}

function loadTrackEasy() {
  console.log("buttons: " + buttons.length);
  //since you have a list of buttons, lets create them all at once
  //the user will travel forward on the line
  for(let one of buttons) {
    var letter = one.letter;
    var duration = one.duration;
    var time = one.mark;

    let buttonStr = readTextFile('./resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0,0,0));

    if(letter == 'S') {
      button.translateVertices(vec3.fromValues(-7,0, time * -6.0));
    } else if(letter == 'D') {
      button.translateVertices(vec3.fromValues(-4.5,0, time * -6.0));
    } else if(letter == 'F') {
      button.translateVertices(vec3.fromValues(-2,0, time * -6.0));
    } else if(letter == 'J') {
      button.translateVertices(vec3.fromValues(2,0, time * -6.0));
    } else if(letter == 'K') {
      button.translateVertices(vec3.fromValues(4.5,0, time * -6.0));
    } else if(letter == 'L') {
      button.translateVertices(vec3.fromValues(7,0, time * -6.0));
    } 

    track.addMesh(button);
  }
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
  gui.add(controls, 'Difficulty', ['easy', 'hard']);
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
  loadTrack();
  //play_music();

  const camera = new Camera(vec3.fromValues(0, 10, 15), vec3.fromValues(0, 0, 0));
  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.4, 0.3, 0.9, 1);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  //mario
  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  //key buttons
  const button_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/button-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/button-frag.glsl')),  
  ]);

  //the track buttons
  const track_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/track-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/track-frag.glsl')),  
  ]);

  //transparent
  const plate_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/plate-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/plate-frag.glsl')),  
  ]);

  //change fov
  //camera.fovy = 1.5;

  // This function will be called every frame
  function tick() {
    //disable rollover controls
    camera.controls.rotationSpeed = 0;
    camera.controls.translationSpeed = 0;
    camera.controls.zoomSpeed = 0;    
    
    //U_tIME
    count ++;  
    
    camera.update();
    stats.begin();

    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();

    let base_color = vec4.fromValues(200/255, 60/255, 200/255, 1);
    
    //mario
    lambert.setGeometryColor(base_color);
    renderer.render(camera, lambert, [mario]);

    //plate
    base_color = vec4.fromValues(150/255, 240/255, 255/255, 1);
    plate_lambert.setGeometryColor(base_color);
    renderer.render(camera, plate_lambert, [square]);

    //buttons
    base_color = vec4.fromValues(255/255, 160/255, 200/255, 1);
    button_lambert.setGeometryColor(base_color);
       
    //  //current easy buttons
    if(controls.Difficulty == "easy") {
       if(downS) {
        button_lambert.setPressed(1);
        renderer.render(camera, button_lambert, [buttonS]);
       } else {
        button_lambert.setPressed(0);
        renderer.render(camera, button_lambert, [buttonS]);
       }
       if(downD) {
        button_lambert.setPressed(1);
        renderer.render(camera, button_lambert, [buttonD]);
      } else {
         button_lambert.setPressed(0);
         renderer.render(camera, button_lambert, [buttonD]);
       }

      if(downF) {
        button_lambert.setPressed(1);
        renderer.render(camera, button_lambert, [buttonF]);       
      } else {
         button_lambert.setPressed(0);
         renderer.render(camera, button_lambert, [buttonF]);       
       }

       if(downJ) {
        button_lambert.setPressed(1);
        renderer.render(camera, button_lambert, [buttonJ]);       
       } else {
         button_lambert.setPressed(0);
         renderer.render(camera, button_lambert, [buttonJ]);       
       }

       if(downK) {
        button_lambert.setPressed(1);
        renderer.render(camera, button_lambert, [buttonK]);       
       } else {
         button_lambert.setPressed(0);
         renderer.render(camera, button_lambert, [buttonK]);       
       }

       if(downL) {
        button_lambert.setPressed(1);
        renderer.render(camera, button_lambert, [buttonL]);       
       } else {
        button_lambert.setPressed(0);
        renderer.render(camera, button_lambert, [buttonL]);       
       }
      }

    //render track
    base_color = vec4.fromValues(65/255, 105/255, 225/255, 1);
    track_lambert.setTime(count);
    track_lambert.setGeometryColor(base_color);
    renderer.render(camera, track_lambert, [track]);

    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  //listen to key press
  window.addEventListener('keydown', keyPressed, false);
  window.addEventListener('keyup', keyReleased, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();

function keyReleased(event: KeyboardEvent) {
  console.log("key released");
  console.log("key released" + event.keyCode);
  switch(event.keyCode) {
    case 65 : 
      //A
      downA = false;
      break;
    case 83 :
      //S
      downS = false;
      break;
    case 68 :
      //D
      downD = false;
      break;
    case 70 :
      //F
      downF = false;
      break;
    case 74 : 
      //J
      downJ = false;
      break;
    case 75 : 
      //K
      downK = false;
      break;
    case 76 :
      //L
      downL = false;
      break;
    case 186 : 
      //;
      downP = false;
      break;
  }
}

function keyPressed(event: KeyboardEvent) {
  console.log("key pressed");
  console.log("key pressed" + event.keyCode);
  switch(event.keyCode) {
    case 65 : 
      //A
      downA = true;
      break;
    case 83 :
      //S
      downS = true;
      break;
    case 68 :
      //D
      downD = true;
      break;
    case 70 :
      //F
      downF = true;
      break;
    case 74 : 
      //J
      downJ = true;
      break;
    case 75 : 
      //K
      downK = true;
      break;
    case 76 :
      //L
      downL = true;
      break;
    case 186 : 
      //;
      downP = true;
      break;
  }
}

