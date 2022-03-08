/* world-position-obj-adjust.js - working out a standard for adjusting an object
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

    // testing out the adjust object method
    var lat = 1 - sm.per,
    lon = 0.35,
    alt = 10,
    heading = 1.57;
    WorldPos.adjustObject(world, guy1.group, lat, lon, heading, alt, 'fromSea');

};

