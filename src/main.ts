import { vec3, vec4, mat3, mat4 } from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import * as fs from 'fs';

import Mesh from './geometry/Mesh';
import Track from './geometry/Track';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';

import { readTextFile } from './globals';
import { setGL } from './globals';

import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import ShaderProgram, { Shader } from './rendering/gl/ShaderProgram';

import Button from './Button';

// import { analyze } from './web-audio-beat-detector';

// analyze(framework.audioSourceBuffer.buffer).then((bpm) => {
//   // the bpm could be analyzed 
//   framework.songBPM = bpm;
// })
// .catch((err) => {
//   // something went wrong 
//   console.log("couldn't detect BPM");
// });

const parseJson = require('parse-json');
let jsonFile: string; //jsonFile name

//list of buttons to create
let buttons = Array<Button>();

let points = 0;
let health = 100;
let startTime = 0;
let epsilon = 0.5;

let startTick = 0;
let endTick = 0;
let tickFrame = 0;

let keyBoard = Array<Mesh>();
let track: Track;
let gameDiff: string;
let startGame = false;
let loaded = false;
let parse = false;

let play = 0;
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

//music 
var JukeBox: AudioContext;

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  Difficulty: "easy",
  Song: "Run",
  'Load Scene': loadScene // A function pointer, essentially
};

function play_music() {
  JukeBox = new AudioContext();
  var musicStr = controls.Song;
  var musicPath = './src/resources/music/mp3/' + musicStr + '.mp3';

  fetch(musicPath)
    .then(r => r.arrayBuffer())
    .then(b => JukeBox.decodeAudioData(b))
    .then(data => {
      const audio_buf = JukeBox.createBufferSource();
      audio_buf.buffer = data;
      audio_buf.loop = false;
      audio_buf.connect(JukeBox.destination);
      audio_buf.start(0);
    });

  console.log(`Music On!` + musicStr);
}

function loadScene() {
  //Mario 
  marioString = readTextFile('./src/resources/obj/wahoo.obj');
  mario = new Mesh(marioString, vec3.fromValues(0, 0, 0));
  mario.translateVertices(vec3.fromValues(0, -5, -20));
  mario.create();

  square = new Square(vec3.fromValues(0, 0, 0));
  square.create();
}

function loadButtonsEasy() {
  buttonSstr = readTextFile('./src/resources/obj/button.obj');
  buttonS = new Mesh(buttonSstr, vec3.fromValues(0, 0, 0));
  buttonS.translateVertices(vec3.fromValues(-7, 0, 0));
  buttonS.create();

  buttonDstr = readTextFile('./src/resources/obj/button.obj');
  buttonD = new Mesh(buttonDstr, vec3.fromValues(0, 0, 0));
  buttonD.translateVertices(vec3.fromValues(-4.5, 0, 0));
  buttonD.create();

  buttonFstr = readTextFile('./src/resources/obj/button.obj');
  buttonF = new Mesh(buttonFstr, vec3.fromValues(0, 0, 0));
  buttonF.translateVertices(vec3.fromValues(-2, 0, 0));
  buttonF.create();

  buttonJstr = readTextFile('./src/resources/obj/button.obj');
  buttonJ = new Mesh(buttonJstr, vec3.fromValues(0, 0, 0));
  buttonJ.translateVertices(vec3.fromValues(2, 0, 0));
  buttonJ.create();

  buttonKstr = readTextFile('./src/resources/obj/button.obj');
  buttonK = new Mesh(buttonKstr, vec3.fromValues(0, 0, 0));
  buttonK.translateVertices(vec3.fromValues(4.5, 0, 0));
  buttonK.create();

  buttonLstr = readTextFile('./src/resources/obj/button.obj');
  buttonL = new Mesh(buttonLstr, vec3.fromValues(0, 0, 0));
  buttonL.translateVertices(vec3.fromValues(7, 0, 0));
  buttonL.create();

  keyBoard.push(buttonS, buttonD, buttonF, buttonJ, buttonK, buttonL);
}

function loadButtonsHard() {
  buttonAstr = readTextFile('./src/resources/obj/button.obj');
  buttonA = new Mesh(buttonAstr, vec3.fromValues(0, 0, 0));
  buttonA.translateVertices(vec3.fromValues(-9.5, 0, 0));
  buttonA.create();

  buttonSstr = readTextFile('./src/resources/obj/button.obj');
  buttonS = new Mesh(buttonSstr, vec3.fromValues(0, 0, 0));
  buttonS.translateVertices(vec3.fromValues(-7, 0, 0));
  buttonS.create();

  buttonDstr = readTextFile('./src/resources/obj/button.obj');
  buttonD = new Mesh(buttonDstr, vec3.fromValues(0, 0, 0));
  buttonD.translateVertices(vec3.fromValues(-4.5, 0, 0));
  buttonD.create();

  buttonFstr = readTextFile('./src/resources/obj/button.obj');
  buttonF = new Mesh(buttonFstr, vec3.fromValues(0, 0, 0));
  buttonF.translateVertices(vec3.fromValues(-2, 0, 0));
  buttonF.create();

  buttonJstr = readTextFile('./src/resources/obj/button.obj');
  buttonJ = new Mesh(buttonJstr, vec3.fromValues(0, 0, 0));
  buttonJ.translateVertices(vec3.fromValues(2, 0, 0));
  buttonJ.create();

  buttonKstr = readTextFile('./src/resources/obj/button.obj');
  buttonK = new Mesh(buttonKstr, vec3.fromValues(0, 0, 0));
  buttonK.translateVertices(vec3.fromValues(4.5, 0, 0));
  buttonK.create();

  buttonLstr = readTextFile('./src/resources/obj/button.obj');
  buttonL = new Mesh(buttonLstr, vec3.fromValues(0, 0, 0));
  buttonL.translateVertices(vec3.fromValues(7, 0, 0));
  buttonL.create();

  buttonPstr = readTextFile('./src/resources/obj/button.obj');
  buttonP = new Mesh(buttonPstr, vec3.fromValues(0, 0, 0));
  buttonP.translateVertices(vec3.fromValues(9.5, 0, 0));
  buttonP.create();

  keyBoard.push(buttonA, buttonS, buttonD, buttonF, buttonJ, buttonK, buttonL, buttonP);
}

//read the JSON file determined by the user
//currntly doing a test midi json
function parseJSON() {
  var musicStr = controls.Song;
  var musicPath = './src/resources/music/json/' + musicStr + '.json';

  // jsonFile = readTextFile(musicPath);
  const json = "";

  fetch(musicPath)
  .then(response => response.json())
  .then(jsonResponse => parseAfterReading(jsonResponse))   
  }

function parseAfterReading(json : JSON) {
  // console.log("d" + JSON.stringify(json));
    var json2 = JSON.parse(JSON.stringify(json));
    var tracks = json2["tracks"];
    var tracks2 = JSON.parse(JSON.stringify(tracks));
  console.log(tracks2[0]);
    if (controls.Difficulty == 'easy') {
      parseTracksEasy(tracks2);
    } else if (controls.Difficulty == 'hard') {
      parseTracksHard(tracks2);
  }

  // console.log("buttons: " + buttons.length);
  // console.log("parse" + buttons.length);
  buttons.sort(function (a: any, b: any) {
    return a.getTime() - b.getTime();
  });
  console.log("parse" + buttons[0].getLetter());
}

//easy version
function parseTracksEasy(tracks: any) {
  //tracks are in an array
  for (let track of tracks) {
    console.log("track" + track.length);
    //track's notes are in an array
    let notes = [];
    notes = track["notes"];
    var notes2 = JSON.parse(JSON.stringify(notes));
    console.log("notes" + notes2[0].get);
    //if the track has notes to be played
    if (notes2.length > 0) {
      var currTime = 0;
      for (let note of notes2) {
        //name, midi, time, velocity, duration
        //time passed per note
        var time = note["time"];
        var deltaTime = time - currTime;
        currTime = time;
        var number = note["midi"];
        var duration = note["duration"];

        // console.log("duration: " + duration);
        //for buttons that happen 0.3
        //connect - 0.35
        //run - 0.25
        //if the time difference between one note and the other is :
        if (deltaTime > 0.5) {
          //cutoffs: 28, 40, 52, 64, 76, 88, 100
          if (number > 0 && number < 55) {
            //console.log("15 to 40"); 
            // console.log("parse S" + " time: " + time);
            var b = new Button("S", time);
            buttons.push(b);
          } else if (number > 55 && number < 65) {
            //console.log("40 to 52");
            // console.log("parse D" + " time: " + time);
            var b = new Button("D", time);
            buttons.push(b);
          } else if (number > 65 && number < 70) {
            //console.log("64 to 76");
            // console.log("parse F" + " time: " + time);
            var b = new Button("F", time);
            buttons.push(b);
          } else if (number > 70 && number < 75) {
            // console.log("parse J" + " time: " + time);
            var b = new Button("J", time);
            buttons.push(b);
          } else if (number > 75 && number < 83) {
            // console.log("parse K" + " time: " + time);
            var b = new Button("K", time);
            buttons.push(b);
          } else if (number > 83 && number < 127) {
            // console.log("parse L" + " time: " + time);
            var b = new Button("L", time);
            buttons.push(b);
          }
        }
      }
    }
  }
}

//easy version
function parseTracksHard(tracks: any) {
  //tracks are in an array
  for (let track of tracks) {
    // console.log("track" + track.length);
    //track's notes are in an array
    let notes = [];
    notes = track["notes"];
    //if the track has notes to be played
    if (notes.length > 0) {
      var currTime = 0;
      for (let note of notes) {
        //name, midi, time, velocity, duration
        //time passed per note
        var time = note["time"];
        var deltaTime = time - currTime;
        currTime = time;

        var number = note["midi"];
        var duration = note["duration"];

        //for buttons that happen 0.3
        //connect - 0.35
        //run - 0.25
        var max = 3;
        var min = -3;
        var rand = Math.random() * (max - min) + min;
        if (deltaTime > 0.4) {
          if (number > 0 + rand && number < 66 + rand) {
            var b = new Button("A", time);
            buttons.push(b);
          } else if (number > 66 + rand && number < 69 + rand) {
            var b = new Button("S", time);
            buttons.push(b);
          } else if (number > 69 + rand && number < 73 + rand) {
            var b = new Button("D", time);
            buttons.push(b);
          } else if (number > 73 + rand && number < 77 + rand) {
            var b = new Button("F", time);
            buttons.push(b);
          } else if (number > 77 + rand && number < 79 + rand) {
            var b = new Button("J", time);
            buttons.push(b);
          } else if (number > 79 + rand && number < 82 + rand) {
            var b = new Button("K", time);
            buttons.push(b);
          } else if (number > 82 + rand && number < 85 + rand) {
            var b = new Button("L", time);
            buttons.push(b);
          } else if (number > 85 + rand && number < 127) {
            var b = new Button(";", time);
            buttons.push(b);
          }
        }
      }
    }
  }
}

function loadTrack() {
  //track 
  track = new Track(vec3.fromValues(0, 0, 0));
  if (controls.Difficulty == "easy") {
    //loadTrackEasy();
    loadInitialPositionsEasy();
    loadOnly10Easy();
  } else if (controls.Difficulty == "hard") {
    //loadTrackHard();
    loadInitialPositionsHard();
    loadOnly10Hard();
  }
  track.create();
}

function loadTrackEasy() {
  //console.log("buttons: " + buttons.length);
  //since you have a list of buttons, lets create them all at once
  //the user will travel forward on the line
  for (let one of buttons) {
    var letter = one.getLetter();
    var time = one.getTime();
    var spacing = -1;
    // console.log("parse letters to make into:" + letter);

    let buttonStr = readTextFile('./src/resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    var pos = vec3.fromValues(0,0,0);

    if (letter == 'S') {
      pos = vec3.fromValues(-7, 0, time * spacing);
    } else if (letter == 'D') {
      pos = vec3.fromValues(-4.5, 0, time * spacing);
    } else if (letter == 'F') {
      pos = vec3.fromValues(-2, 0, time * spacing);
    } else if (letter == 'J') {
      pos = vec3.fromValues(2, 0, time * spacing);
    } else if (letter == 'K') {
      pos = vec3.fromValues(4.5, 0, time * spacing);
    } else if (letter == 'L') {
      pos = vec3.fromValues(7, 0, time * spacing);
    }
    button.translateVertices(pos);
    one.setPosition(pos);

    track.addMesh(button);
  }
}

function loadTrackHard() {
  // console.log("buttons: " + buttons.length);
   //since you have a list of buttons, lets create them all at once
   //the user will travel forward on the line
   for (let one of buttons) {
    var letter = one.getLetter();
    var time = one.getTime();
    var spacing = -1;
 
     let buttonStr = readTextFile('./src/resources/obj/button.obj');
     let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));
 
     //connect = 
     //bts run = -5
     var pos = vec3.fromValues(0,0,0);
 
     if(letter == 'A') {
       pos = vec3.fromValues(-9.5, 0, time * spacing);
     } else if (letter == 'S') {
       pos = vec3.fromValues(-7, 0, time * spacing);
     } else if (letter == 'D') {
       pos = vec3.fromValues(-4.5, 0, time * spacing);
     } else if (letter == 'F') {
       pos = vec3.fromValues(-2, 0, time * spacing);
     } else if (letter == 'J') {
       pos = vec3.fromValues(2, 0, time * spacing);
     } else if (letter == 'K') {
       pos = vec3.fromValues(4.5, 0, time * spacing);
     } else if (letter == 'L') {
       pos = vec3.fromValues(7, 0, time * spacing);
     } else if (letter == ';') {
       pos = vec3.fromValues(9.5, 0, time * spacing);
     }
 
    button.translateVertices(pos);
    one.setPosition(pos);
    
    track.addMesh(button);
   }
 }

function loadInitialPositionsEasy() {
  for (let one of buttons) {
    var letter = one.getLetter();
    var time = one.getTime();
    var spacing = -1;
    console.log("parse letters to make into:" + letter);

    let buttonStr = readTextFile('./src/resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    var pos = vec3.fromValues(0, 0, 0);
    if (letter == 'S') {
      pos = vec3.fromValues(-7, 0, time * spacing);
    } else if (letter == 'D') {
      pos = vec3.fromValues(-4.5, 0, time * spacing);
    } else if (letter == 'F') {
      pos = vec3.fromValues(-2, 0, time * spacing);
    } else if (letter == 'J') {
      pos = vec3.fromValues(2, 0, time * spacing);
    } else if (letter == 'K') {
      pos = vec3.fromValues(4.5, 0, time * spacing);
    } else if (letter == 'L') {
      pos = vec3.fromValues(7, 0, time * spacing);
    }
    button.translateVertices(pos);
    one.setPosition(pos);
    console.log("set positions initally: " + pos);
    // track.addMesh(button);
  }
}

function loadOnly10Easy() {
  //from the list of buttons
  //only load 10 onto the track
  //update each time
  for (var i = 0; i < 10; i++) {
    var currButt = buttons[i];
    // var letter = currButt.getLetter();
    //console.log("parse letters to make into:" + letter);

    let buttonStr = readTextFile('./src/resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));
    
    var pos = currButt.getPosition();
    button.translateVertices(pos);
    buttons[i].setPosition(pos);

    // console.log("get time: " + i + " " + currButt.getTime());
    // console.log("set positions: " + i  + " " + pos);
    
    track.addMesh(button);
  }
}

function loadInitialPositionsHard() {
  //set the initial position of the buttons
  for (let one of buttons) {
    var letter = one.getLetter();
    var time = one.getTime();
    var spacing = -1;

    let buttonStr = readTextFile('./src/resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    var pos = vec3.fromValues(0, 0, 0);

    if (letter == 'A') {
      pos = vec3.fromValues(-9.5, 0, time * spacing);
    } else if (letter == 'S') {
      pos = vec3.fromValues(-7, 0, time * spacing);
    } else if (letter == 'D') {
      pos = vec3.fromValues(-4.5, 0, time * spacing);
    } else if (letter == 'F') {
      pos = vec3.fromValues(-2, 0, time * spacing);
    } else if (letter == 'J') {
      pos = vec3.fromValues(2, 0, time * spacing);
    } else if (letter == 'K') {
      pos = vec3.fromValues(4.5, 0, time * spacing);
    } else if (letter == 'L') {
      pos = vec3.fromValues(7, 0, time * spacing);
    } else if (letter == ';') {
      pos = vec3.fromValues(9.5, 0, time * spacing);
    }

    button.translateVertices(pos);
    one.setPosition(pos);
   // console.log("set positions initally: " + pos);
    // track.addMesh(button);
  }
}

function loadOnly10Hard() {
  //from the list of buttons
  //only load 10 onto the track
  for (var i = 0; i < 10; i++) {
    var currButt = buttons[i];
    // var letter = currButt.getLetter();
    // console.log("parse letters to make into:" + letter);

    let buttonStr = readTextFile('./src/resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    var pos = currButt.getPosition();
    button.translateVertices(pos);

    buttons[i].setPosition(pos);
    //console.log("set positions initally: " + pos);
    track.addMesh(button);
  }
}

function main() {
  //debugger;
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
  gui.add(controls, 'Song', ['Run', 'Connect', 'Connect-Goofy', 'Cheerup', 'Megalovania']);
  gui.add(controls, 'Load Scene');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const gl = <WebGL2RenderingContext>canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 5, 15), vec3.fromValues(0, 0, 0));
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
    startTick = Date.now();

    var timeRightNow = Date.now();
    var timeSinceStart = timeRightNow - startTime;
    var timeSinceStartSec = timeSinceStart / 1000;
    //console.log("time counting: " + timeSinceStartSec);

    if (!startGame && controls.Difficulty == "easy") {
      // console.log("load easy mesh buttons");
      //load easy mesh buttons
      loadButtonsEasy();
      loaded = true;
    } else if (!startGame && controls.Difficulty == "hard") {
      //load 
      // console.log("load hard mesh buttons");
      loadButtonsHard();
      loaded = true;
    }

    //disable rollover controls
    camera.controls.rotationSpeed = 0;
    camera.controls.translationSpeed = 0;
    camera.controls.zoomSpeed = 0;

    camera.update();
    stats.begin();

    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();

    let base_color = vec4.fromValues(200 / 255, 60 / 255, 200 / 255, 1);

    //mario
    lambert.setGeometryColor(base_color);
    renderer.render(camera, lambert, [mario]);

    //plate
    base_color = vec4.fromValues(150 / 255, 240 / 255, 255 / 255, 1);
    plate_lambert.setGeometryColor(base_color);
    renderer.render(camera, plate_lambert, [square]);

    //buttons
    base_color = vec4.fromValues(255 / 255, 160 / 255, 200 / 255, 1);
    button_lambert.setGeometryColor(base_color);

    //user has not started game
    if (!startGame && controls.Difficulty == "easy") {
      button_lambert.setGeometryColor(base_color);
      renderer.render(camera, button_lambert, [buttonS, buttonD, buttonF, buttonK, buttonJ, buttonL]);
    } else if (!startGame && controls.Difficulty == "hard") {
      button_lambert.setGeometryColor(base_color);
      renderer.render(camera, button_lambert, [buttonA, buttonS, buttonD, buttonF, buttonK, buttonJ, buttonL, buttonP]);
    }

    //user starts game
    if (startGame) {
      //calculate the buttons positions as the track moves across
      var rate = 0.05;
      var distance = tickFrame * rate;
      console.log("tick: " + tickFrame);
      //render track
      base_color = vec4.fromValues(65 / 255, 105 / 255, 225 / 255, 1);
      track_lambert.setGeometryColor(base_color);
      renderer.render(camera, track_lambert, [track]);

      //update the position of all buttons
      // for (let button of buttons) {
      //   var originalPos = button.getPosition();
      //   var newPos = vec3.fromValues(originalPos[0], originalPos[1], originalPos[2] + distance);
      //   button.setPosition(newPos);
      //   // console.log("new Positions: " + newPos);
      // }
      // track.translateVertices(vec3.fromValues(0, 0, distance));
      //reload the track
      // if(controls.Difficulty == 'easy') {
      //   loadOnly10Easy();
      // } else {
      //   loadOnly10Hard();
      // }

      for (var i = 0; i < 5; i++) {
        var curr = buttons[i];
        // console.log("check: " + curr.getLetter() + " " + curr.getPosition());
        var position = curr.getPosition();
        if (position[2] >= 0 - epsilon && position[2] <= 0 + epsilon) {
          // console.log("new: " + position[2]);
          // console.log("a button passed z: " + position + " " + letter);
          var letter = curr.getLetter();
          if (letter == 'A') {
            if (downA) {
              points++;
            } else {
              health--;
            }
          }
          if (letter == 'S') {
            if (downS) {
              points++;
            } else {
              health--;
            }
          }
          if (letter == 'D') {
            if (downD) {
              points++;
            } else {
              health--;
            }
          }
          if (letter == 'F') {
            if (downF) {
              points++;
            } else {
              health--;
            }
          }
          if (letter == 'J') {
            if (downJ) {
              console.log("point: " + points);
              points++;
            } else {
              health--;
            }
          }
          if (letter == 'K') {
            if (downK) {
              console.log("point: " + points);
              points++;
            } else {
              health--;
            }
          }
          if (letter == 'L') {
            if (downL) {
              console.log("point: " + points);
              points++;
            } else {
              health--;
            }
          }
          if (letter == ';') {
            if (downP) {
              points++;
            } else {
              health--;
            }
          }

          document.getElementById("health").innerHTML = "Health: " + health;
          document.getElementById("points").innerHTML = "Score: " + points;
          
          if (health <= 0) {
            console.log("health IS zero");
            document.getElementById("game").innerHTML = "YOU LOSE!";
            startGame = false;
            JukeBox.close();
          }
          // buttons.shift();
        }
      }

      //  //current easy buttons
      if (controls.Difficulty == "easy") {
        if (downS) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonS]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonS]);
        }
        if (downD) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonD]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonD]);
        }

        if (downF) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonF]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonF]);
        }

        if (downJ) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonJ]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonJ]);
        }

        if (downK) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonK]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonK]);
        }

        if (downL) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonL]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonL]);
        }
      } else if (controls.Difficulty == "hard") {
        if (downA) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonA]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonA]);
        }
        if (downS) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonS]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonS]);
        }
        if (downD) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonD]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonD]);
        }

        if (downF) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonF]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonF]);
        }

        if (downJ) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonJ]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonJ]);
        }

        if (downK) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonK]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonK]);
        }

        if (downL) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonL]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonL]);
        }

        if (downP) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonP]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonP]);
        }
      }
    }

    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
    endTick = Date.now();
  }

  tickFrame = endTick - startTick;

  window.addEventListener('resize', function () {
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
  switch (event.keyCode) {
    case 65:
      //A
      downA = false;
      break;
    case 83:
      //S
      downS = false;
      break;
    case 68:
      //D
      downD = false;
      break;
    case 70:
      //F
      downF = false;
      break;
    case 74:
      //J
      downJ = false;
      break;
    case 75:
      //K
      downK = false;
      break;
    case 76:
      //L
      downL = false;
      break;
    case 186:
      //;
      downP = false;
      break;
  }
}

function keyPressed(event: KeyboardEvent) {
  switch (event.keyCode) {
    case 65:
      //A
      downA = true;
      break;
    case 83:
      //S
      downS = true;
      break;
    case 68:
      //D
      downD = true;
      break;
    case 70:
      //F
      downF = true;
      break;
    case 74:
      //J
      downJ = true;
      break;
    case 75:
      //K
      downK = true;
      break;
    case 76:
      //L
      downL = true;
      break;
    case 186:
      //;
      downP = true;
      break;
    case 32:
      //space bar
      //pause
      startGame = false;
      break;
    case 86:
      if (play == 0) {
        //start music
        play_music();
        //parse JSON file
        parseJSON();

        //create track mesh
        loadTrack();
        console.log("load track create");
      }

      if (controls.Difficulty == "easy") {
        epsilon = .2;
      }
      else if (controls.Difficulty == "hard") {
        epsilon = .2;
      }

      //display status
      document.getElementById("game").innerHTML = "In progress: " + controls.Song;
      document.getElementById("health").innerHTML = "Health: " + health;
      document.getElementById("points").innerHTML = "Score: " + points;

      var d = Date.now();
      startTime = d;

      play++;

      document.getElementById('visualizerInfo').style.visibility = "hidden";

      startGame = true;
      break;
  }
}

