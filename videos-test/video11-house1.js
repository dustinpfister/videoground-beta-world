
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/house1/house1.dae'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){

    scene.add(new THREE.GridHelper(10, 10));
    // CAMERA
    camera.position.set(0, 0, 0);
    camera.lookAt(0.2, 0.0, 0.5);

    // LIGHT
    var light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(0, 0, 0)
    scene.add(light);

    // loading home1
    let home1 = scene.userData.home1 = VIDEO.daeResults[0].scene.children[2];
    home1.position.set(-4,0,0)
    scene.add(home1);

/*
    //var map = world.material.map;
    world.material = new THREE.MeshStandardMaterial({
        emissive: 0xffffff,
        emissiveMap: map,
        emissiveIntensity: 0.4
    });
*/


};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){

};

