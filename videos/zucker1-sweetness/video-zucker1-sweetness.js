
// sweet-baby-rays baby...ohhhh yeahhhh
VIDEO.daePaths = [
  '../../dae/sweet-baby-rays/sweet-baby-rays.dae'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    // CAMERA
    camera.position.set(0, 0, 5);
    camera.lookAt(0,0.25,0);
    // SWEETNESS
    let sweet = scene.userData.sweet = utils.DAE.getMesh( VIDEO.daeResults[0] );
    let map = sweet.material.map;
    sweet.material = new THREE.MeshStandardMaterial({
        emissive: new THREE.Color('#ffffff'),
        emissiveMap: map,
        emissiveIntensity: 1
    });
    scene.add(sweet);
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    let sweet = scene.userData.sweet;
    sweet.rotation.z = Math.PI - Math.PI * 2 * sm.per;
};

