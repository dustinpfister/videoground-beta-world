
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/trees/tree1.dae'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    // CAMERA
    camera.position.set(0, 30, -35);
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

    let tree = scene.userData.tree = VIDEO.daeResults[0].scene;
/*
    tree.material = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#00ff00'),
        emissive: new THREE.Color('#5a5a5a'),
        emissiveIntensity: 0.1
    });
*/


console.log(VIDEO.daeResults[0]);

    scene.add(tree);

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
 
};

