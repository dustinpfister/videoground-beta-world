
// the dae files to use for this video
VIDEO.daePaths = [
  './dae/world/world.dae'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){

    // LIGHT
    let light = scene.userData.light = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 20, 20),
        new THREE.MeshStandardMaterial({
            emissive: 0xffffff
        }));
    light.add(new THREE.PointLight(0xafafaf, 1));
    light.position.set(0, 50, -50);
    scene.add(light);

    let obj = utils.DAE.getMesh( VIDEO.daeResults[0] );
    scene.add(obj);

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    camera.position.z = -30 + 30 * sm.bias;
    camera.lookAt(0, 0, 0);
};

