/*   video13 - testing out new guy2 dae file
 */
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/guy2/guy2.dae'
];

VIDEO.scripts = [
  '../js/dae-helpers.js',
  '../js/canvas.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){

    // GRID HELPER AND BACKGROUND
    scene.background = new THREE.Color('black');
    scene.add(new THREE.GridHelper(10, 10));

    // loading home1
    let guyDAE = scene.userData.guyDAE = VIDEO.daeResults[0].scene.children[2];
    guyDAE.position.set(0, 0.25, 0);
    // !!! if guy has textures then use this to make them emmisve maps with the standard material
    DAEHelpers.reMapGroup(guyDAE);
    scene.add(guyDAE);

    // get by name
/*
    var head = guyDAE.getObjectByName('head'); 
    head.rotation.z = Math.PI / 180 * 120;
    console.log(guyDAE);
*/


};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    camera.position.set(-4 + 8 * sm.bias, 2, 9);
    camera.lookAt(1, 0, 0);
};

