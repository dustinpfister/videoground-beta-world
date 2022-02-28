
// the dae files to use for this video
VIDEO.daePaths = [
  './dae/obj/obj.dae'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    // GRID HELPER
    scene.add(new THREE.GridHelper(12, 12));

    // LIGHT
    let light = scene.userData.light = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 20, 20),
        new THREE.MeshStandardMaterial({
            emissive: 0xffffff
        }));
    light.add(new THREE.PointLight());
    light.position.set(0, 5, -5);
    scene.add(light);


    let obj = utils.DAE.getMesh( VIDEO.daeResults[0] );
    scene.add(obj);

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    camera.position.z = -10 + 20 * sm.bias;
    camera.lookAt(0,0,0);
};

