/* world-position-obj-wrap.js - working out an object wrap standard
 *
 */
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/world/world.dae'
];

VIDEO.scripts = [
  '../js/world-position.js',
  '../js/canvas.js',
  '../js/guy.js',
  '../js/guy-canvas.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){

    // CAMERA
    camera.position.set(0, 0, 35);
    camera.lookAt(0, 5, 0);

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

    // Guy 1 obj
    var guy1 = new Guy();
    guy1.moveArm('arm_right', 0.75, 0);
    guy1.moveArm('arm_left', 0.75, 0);
    scene.userData.guy1 = guy1;
    scene.userData.obj1 = guy1.group;
    scene.add(guy1.group);

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    let world = scene.userData.world,
    guy1 = scene.userData.guy1,
    obj1 = scene.userData.obj1;

    guy1.moveLegs(sm.per, 4);
    guy1.moveArms(sm.per, 4);

    // update guy position

    //var lat = 0.1,
    //lon = 0.01 + 0.98 * sm.bias,

    var lat = 1 - sm.per,
    lon = 0.35,
    alt = 10;
    var v = WorldPos.fromSea(world, lat, lon, alt);
    obj1.position.copy(v);

    // look at world position
    obj1.lookAt(world.position);
    // adjust so guy is standing up
    obj1.rotateX(-1.57);
    // set heading of guy
    var heading = 1.57;
    obj1.rotateY(heading);

    //camera.position.copy(v.clone().add(new THREE.Vector3(3,0,0)).normalize().multiplyScalar(25));
    //camera.lookAt(obj1.position);
};

