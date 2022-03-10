
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/world/world-texture-1.dae'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    // CAMERA
    camera.position.set(0, 0, -35);
    camera.lookAt(0,0,0)


    // LIGHT
    let light = scene.userData.light = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 20, 20),
        new THREE.MeshStandardMaterial({
            emissive: 0xffffff
        }));
    light.add(new THREE.PointLight(0xdfdfdf, 0.8));
    light.position.set(0, 50, -50);
    scene.add(light);

    let world = scene.userData.world = utils.DAE.getMesh( VIDEO.daeResults[0] );
    scene.add(world);

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    let world = scene.userData.world;
    world.rotation.y = Math.PI * 2 * sm.per;
};

