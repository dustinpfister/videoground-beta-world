/*   video14 - testing out weird-face-1 dae file
 */
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/weird-face-1/weird-face-1.dae'
];

VIDEO.scripts = [
  '../js/dae-helpers.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){

    // GRID HELPER AND BACKGROUND
    scene.background = new THREE.Color('black');
    //scene.add(new THREE.GridHelper(10, 10));

    // LIGHT
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 2, 3);
    scene.add(light);
    var ambient = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambient);

    // loading werid face one
    let wf = scene.userData.wf = VIDEO.daeResults[0].scene.children[2];
    wf.position.set(0, 0.25, 0);
    // !!! if werid face one has textures then use this to make them emmisve maps with the standard material
    //DAEHelpers.reMapGroup(guyDAE);
    scene.add(wf);

    // get by name
    var mouth = wf.getObjectByName('mouth');
    // !!! doing the quick temp fix for messed up normals on the mouth
    //mouth.material.side = THREE.DoubleSide;
    console.log(mouth);



};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    camera.position.set(2 - 4 * bias, 0, 2);
    camera.lookAt(0, 0, 0);
};

