/* video-guy-characters.js - new guy-characters javaScript lib test
 *
 */
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/world/world.dae'
];

VIDEO.scripts = [
  '../js/sequences/r0/sequences.js',
  '../js/world-position/r0/world-position.js',
  '../js/canvas/r0/canvas.js'
  '../js/guy/r0/guy.js',
  '../js/guy/r0/guy-canvas.js'
  '../js/guy/r0/guy-characters.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    scene.background = new THREE.Color(0x00afaf)
    // CAMERA
    camera.position.set(30, 10, -20);
    camera.lookAt(0, 5, 0);

    // LIGHT
    let light = scene.userData.light = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 20, 20),
        new THREE.MeshStandardMaterial({
            emissive: 0xffffff
        }));
    light.add(new THREE.PointLight(0xdfdfdf, 0.8));
    light.position.set(0, 50, -50);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.15))

    // WORLD MESH
    let world = scene.userData.world = utils.DAE.getMesh( VIDEO.daeResults[0] );
    world.material = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#00ff00'),
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.2
    });
    scene.add(world);

    // Guy 1 obj
    GuyCharacters.create(scene, 'guy1');

    WorldPos.adjustObject(world, scene.userData.guy1.group, 0, 0, 1.8, 9.5, 'fromSea');


};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    let world = scene.userData.world,
    guy1 = scene.userData.guy1;

               //camera.position.set(15, 10, 20 - 40 * bias);
               //camera.lookAt(guy1.group.position);

var seq = Sequences.create({
    sm: sm,
    part : [
        {
           per: 0,
           init: function(sm){
               console.log('init for part 0');
           },
           update: function(sm, scene, camera, partPer, partBias){
               camera.position.set(15 - 10 * partBias, 10, 20 - 40 * partBias);
               camera.lookAt(guy1.group.position);

               guy1.moveArms(sm.per, 8);
               WorldPos.adjustObject(world, guy1.group, 0, 0, 1.8, 9.5, 'fromSea');
           }
        },
        {
           per: 0.5,
           init: function(sm){
               console.log('init for part 1');
               camera.position.set(30, 10, -20);
               camera.lookAt(0, 5, 0);
           },
           update: function(sm, scene, camera, partPer, partBias){
               // moving legs
               guy1.moveLegs(sm.per, 8);
               guy1.moveArms(sm.per, 8);
               // changing guy position
               var radian = Math.PI * 2 * partPer * -1, 
               lat = 0.25 + Math.cos(radian) * 0.10, 
               lon = 0.25 + Math.sin(radian) * 0.10, 
               alt = 10, 
               heading = radian * -1;
               WorldPos.adjustObject(world, guy1.group, lat, lon, heading, alt, 'fromSea');
           }
        }
    ]
});

Sequences.update(seq, sm);

    // setting world position for guy1
    //var radian = Math.PI * 2 * sm.per * -1, 
    //lat = 0.25 + Math.cos(radian) * 0.10, 
    //lon = 0.25 + Math.sin(radian) * 0.10, 
    //alt = 10, 
    //heading = radian * -1;
    //WorldPos.adjustObject(world, guy1.group, lat, lon, heading, alt, 'fromSea');
};
