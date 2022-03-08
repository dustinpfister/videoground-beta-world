/* video-guy-characters.js - new guy-characters javaScript lib test
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
    var guy1 = new Guy();
    guy1.moveArm('arm_right', 0.75, 0);
    guy1.moveArm('arm_left', 0.75, 0);
    scene.userData.guy1 = guy1;
    scene.userData.obj1 = guy1.group;
    scene.add(guy1.group);
    var guy1_canvasObj = scene.userData.guy1_canvasObj = CanvasMod.createCanvasObject(sm, GuyCanvasMethods);
    guy1_canvasObj.draw({
       drawClass: 'face',
       drawMethod: 'talk',
       mouthPer: 0.5,
       leftEyeXPer: 0.5, rightEyeXPer: 0.5
    });
    guy1.head.material[1] = guy1.head.material[1] = new THREE.MeshStandardMaterial({ 
        map:  guy1_canvasObj.texture
    });
    var hat_canvasObj = CanvasMod.createCanvasObject(sm, GuyCanvasMethods);
    hat_canvasObj.draw({drawClass: 'hat', drawMethod: 'stripes'});
    var hatMaterial = new THREE.MeshStandardMaterial({
        map: hat_canvasObj.texture
    });
    var hat = new THREE.Mesh(
        new THREE.ConeGeometry(0.80, 1.5),
        hatMaterial
    );
    hat.rotation.x = THREE.MathUtils.degToRad(-30);
    hat.position.set(0, 0.83 ,-0.6)
    guy1.head.add(hat);
    // using hat texture for body and arms
    guy1.body.material = hatMaterial;
    guy1.arm_right.material = hatMaterial;
    guy1.arm_left.material = hatMaterial;
    guy1.group.add(camera);
    camera.position.set(7,4,7);
    camera.lookAt(0,0,0);
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    let world = scene.userData.world,
    guy1 = scene.userData.guy1,
    obj1 = scene.userData.obj1;
    guy1.moveLegs(sm.per, 8);
    guy1.moveArms(sm.per, 8);
    var radian = Math.PI * 2 * sm.per * -1, 
    lat = 0.25 + Math.cos(radian) * 0.10, 
    lon = 0.25 + Math.sin(radian) * 0.10, 
    alt = 10, 
    heading = radian * -1;
    WorldPos.adjustObject(world, guy1.group, lat, lon, heading, alt, 'fromSea');
};

