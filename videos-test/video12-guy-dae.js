/*   video12 - testing out my new guy dae file and how it compares to my old threejs guy
 */
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/guy/guy.dae'
];

VIDEO.scripts = [
  '../js/canvas.js',
  '../js/guy.js',
  '../js/guy-canvas.js',
  '../js/guy-characters.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){

    // gird helper
    scene.add(new THREE.GridHelper(10, 10));

    // CAMERA
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // LIGHT
    var light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(2, 3, 2)
    scene.add(light);

    // loading home1
    let guyDAE = scene.userData.guyDAE = VIDEO.daeResults[0].scene.children[2];
    guyDAE.position.set(0, 0.25, 0);
    scene.add(guyDAE);

    // Guy 1 obj
    GuyCharacters.create(scene, 'guy1');
    var guy1 = scene.userData.guy1;
    guy1.group.position.set(2.5,0,0)

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){

};

