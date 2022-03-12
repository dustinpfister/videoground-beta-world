
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/world/test-ico-1.dae'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    // CAMERA
    camera.position.set(0, 0, -4);
    camera.lookAt(0,0,0)

    // LIGHT
    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-5, 10, -5)
    scene.add(light);

    // loading world
    let world = scene.userData.world = utils.DAE.getMesh( VIDEO.daeResults[0] );
    var map = world.material.map;
    world.material = new THREE.MeshStandardMaterial({
        emissive: 0xffffff,
        emissiveMap: map,
        emissiveIntensity: 0.4
    });
    scene.add(world);

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    let world = scene.userData.world;
    world.rotation.y = Math.PI * 2 * sm.per;
};

