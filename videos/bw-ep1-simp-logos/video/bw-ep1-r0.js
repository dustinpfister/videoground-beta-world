
// the dae files to use for this video
VIDEO.daePaths = [
    '../../../dae/house1-bedroom/h1-b1-full.dae',
    '../../../dae/guy2/guy2.dae'
];

VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/dae-helpers.js',
   '../../../js/sequences.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    // loading home1-bedroom
    let home1 = scene.userData.home1 = VIDEO.daeResults[0].scene.children[0];
    DAEHelpers.reMapGroup(home1);
    home1.position.set(0, 0, 0);
    scene.add(home1);

    let mrg1 = scene.userData.mrg1 = VIDEO.daeResults[1].scene.children[2];
    DAEHelpers.reMapGroup(mrg1);
    mrg1.position.set(-2, 4.0, 0);
    mrg1.rotation.set(Math.PI * 1.5, 0, Math.PI * 1.0);
    scene.add(mrg1);
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    // camera
    camera.position.set(4.5, 7.25, 2.5 - 6 * bias);
    camera.lookAt(-4, 2, -4 + 4 * bias);
};

