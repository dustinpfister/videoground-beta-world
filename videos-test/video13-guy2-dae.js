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
    scene.background = new THREE.Color('cyan');
    scene.add(new THREE.GridHelper(10, 10));



    // LIGHT
    //var light = new THREE.PointLight(0xffffff, 0.5);
    //light.position.set(2, 3, 2)
    //scene.add(light);

    // loading home1
    let guyDAE = scene.userData.guyDAE = VIDEO.daeResults[0].scene.children[2];
    guyDAE.position.set(0, 0.25, 0);
    // !!! if guy has textures then use this to make them emmisve maps with the standard material
    DAEHelpers.reMapGroup(guyDAE);
    scene.add(guyDAE);

    // get by name works
/*
    var head = guyDAE.getObjectByName('head'); 
    head.rotation.z = Math.PI / 180 * 120;
    console.log(guyDAE);

    var arm2 = guyDAE.getObjectByName('arm2'); 
    arm2.rotation.x = Math.PI / 180 * -45;

    var leg2 = guyDAE.getObjectByName('leg2'); 
    leg2.rotation.x = Math.PI / 180 * -45;
*/

    // Guy 1 obj
    //GuyCharacters.create(scene, 'guy1');
    //var guy1 = scene.userData.guy1;
    //guy1.group.position.set(2.5,0,0);

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    camera.position.set(-4 + 8 * sm.bias, 2, 9);
    camera.lookAt(1, 0, 0);
};

