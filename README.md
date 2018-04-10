# Final Procedural Project  
# Music Visualizer - BTS Super Star/Guitar Hero 


# OBJ loading
[webgl-obj-loader](https://www.npmjs.com/package/webgl-obj-loader)

1) Loaded Button Objects
2) Visulization models (sphere, cube)

## WRITE UP
Pennkey: eunsang
Name: Sang Lee
demo:

# Summary 
This project is an experiment to recreat BTS Super Star by Dalcomm Soft and takes inspiration from Guitar Hero.

Design Document: https://docs.google.com/document/d/1Lr6PYYaQb-z2wbhG3Rc8ZG_MI8Hfo2A5I6ClWHpsIXM/edit?usp=sharing

# Music Reader
User can input a music file (mp3, midi).

The program reads in the music file and analyzes the frequency and beats to create a sequence of keys to press.


# User Interface
The player can choose between two difficulties: Easy & Hard

Easy Mode: This mode only uses 6 keys on the keyboard. S, D, F, J, K, L

Hard Mode: This mode only uses 8 keys on the keyboard. A, S, D, F, J, K, L, ;

# Start
The user chooses a difficulty mode and a music file.

The game starts. The program reads through the sequences of keys created beforehand. 
A button to smash will show on the screen like guitar hero. 
The user has to tap the correct key at the correct time. 

# Visulization Decoration
The background moves according to the music.
It might be a bit distracting

# Sources
Grace Xu Final Music Visualizer:  https://github.com/gracexu94/FinalProject
* Web Audio API
* Three.js
* Node.js
* web-audio-beat-detector

Audio Vis : https://github.com/willianjusten/awesome-audio-visualization



