/* world-position-basic.js - testing out some things with positioning of object in the world.dae file
 *
 */
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/world/world.dae'
];

VIDEO.scripts = [
  '../js/world-position.js',
  '../js/canvas.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){

    // CAMERA
    camera.position.set(0, 0, 35);

    // LIGHT
    let light = scene.userData.light = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 20, 20),
        new THREE.MeshStandardMaterial({
            emissive: 0xffffff
        }));
    light.add(new THREE.PointLight(0xdfdfdf, 0.8));
    light.position.set(0, 50, 50);
    scene.add(light);

    // WORLD MESH
    let world = scene.userData.world = utils.DAE.getMesh( VIDEO.daeResults[0] );
    world.material = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#00ff00'),
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.2
    });
    scene.add(world);

    // OBJECT 1 MESH
    var obj1 = scene.userData.obj1 = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 3), new THREE.MeshNormalMaterial());
    scene.add(obj1);

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    let world = scene.userData.world,
    obj1 = scene.userData.obj1;

    //world.rotation.y = Math.PI * 2 * sm.per;

    // up and down lon
    var v = WorldPos.fromSea(world, 0.5, sm.bias, 8);
    obj1.position.copy(v);

    camera.lookAt(obj1.position);
};

