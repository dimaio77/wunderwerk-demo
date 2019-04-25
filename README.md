Wunderwerk
==========

*Wunderwerk* is a multi-platform game engine for the web written in Typescript and using WebGL. Its features include dynamic lighting and shadows, collision detection, advanced visibility determination, space partitioning and skeletal animation. It has no third-party dependencies apart from WebGL.

I have been working on this project on and off since the initial release of the Typescript language in 2012 but, being a hopeless perfectionist, never deemed it sufficiently complete for a public release.

I'm finally finding the time to clean up the API and to port the project to Typescript 2.x and WebGL 2.0 and will upload the updated source code to this repository over the course of the following days and weeks, one class at a time. I will start with the foundation classes (array list and hash map implementations, the scene graph, etc.) and will then continue with the rendering system, resource and input management, and finally visibility determination, collision detection and the skeletal animation system.

As soon as enough classes have been uploaded to compile the project and use it to create simple visualizations, I will write a few step-by-step guides and provide a few sample assets so you can start developing your own demos.

During all this, your feedback is very appreciated.

Blender plug-in
---------------

The game engine is complemented by a Python plug-in for [Blender 3D](https://www.blender.org/) which exports scenes, models, materials and animations to a custom, web-optimized file format. I will soon release this plug-in as a separate project.

Screenshots
-----------
![](https://github.com/matthiasferch/wunderwerk-demo/blob/master/Screenshots/01.jpg)
![](https://github.com/matthiasferch/wunderwerk-demo/blob/master/Screenshots/02.jpg)
![](https://github.com/matthiasferch/wunderwerk-demo/blob/master/Screenshots/03.jpg)
![](https://github.com/matthiasferch/wunderwerk-demo/blob/master/Screenshots/04.jpg)
![](https://github.com/matthiasferch/wunderwerk-demo/blob/master/Screenshots/05.jpg)
