
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/world/world.dae'
];

// using guy scripts
VIDEO.scripts = [
  '../js/canvas.js',
  '../js/guy.js',
  '../js/guy-canvas.js'
];
// init method for the video
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // SCENE
    // ---------- ----------
    var bg_canvasObj = CanvasMod.createCanvasObject(sm);
    bg_canvasObj.draw({drawMethod: 'randomGrid', gRange:[32,64], bRange:[128, 200]});
    scene.background = bg_canvasObj.texture;
    camera.position.set(15,15,15);

    // ---------- ----------
    // GUY1 OBJECT
    // ---------- ----------
    // guy1 object with all mesh objects
    var guy1 = scene.userData.guy1 = new Guy();
    // guy1 canvas obj
    var guy1_canvasObj = scene.userData.guy1_canvasObj = CanvasMod.createCanvasObject(sm, GuyCanvasMethods);
    guy1.head.material[1] = guy1.head.material[1] = new THREE.MeshStandardMaterial({ 
        map:  guy1_canvasObj.texture
    });
    scene.add(guy1.group);
    // HAT for head of guy1 head
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



    // ---------- ----------
    // WORLD
    // ---------- ----------
    let world = scene.userData.world = utils.DAE.getMesh( VIDEO.daeResults[0] );
    world.material = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#00ff00'),
        emissive: new THREE.Color('#5a5a5a'),
        emissiveIntensity: 0.1,
        side: THREE.DoubleSide
    });
    scene.add(world);

    // ---------- ----------
    // START POSITION OF GUY1
    // ---------- ----------
    guy1.group.position.set(0, 15, 0);
    guy1.group.lookAt(world.position);
    guy1.group.rotation.x = 0;
    var raycaster = new THREE.Raycaster();
    var ori = new THREE.Vector3()
    //ori.copy(guy1.group.position);
    ori.y -= 3; 
    var dir = new THREE.Vector3();
    dir.copy(ori);
    dir.y -= 100;
    raycaster.set(ori, dir);


    console.log(guy1.group.position, ori);
    var objects = raycaster.intersectObjects(scene.children);
    console.log(objects);
    objects.forEach((result) => {
        result.object.material = new THREE.MeshNormalMaterial()
        console.log(result) 
    });


    // ---------- ----------
    // LIGHT
    // ---------- ----------
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(100,100, 0)
    scene.add(light)
    scene.add( new THREE.AmbientLight(0xffffff, 0.1));
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
   var guy1 = scene.userData.guy1;
   var guy1_canvasObj = scene.userData.guy1_canvasObj;


   // UPDATE FACE
   guy1_canvasObj.draw({
       drawClass: 'face',
       drawMethod: 'talk',
       mouthPer: 0,
       leftEyeXPer: 0.5, rightEyeXPer: 0.5
   });

   // move legs
   guy1.moveLegs(sm.per, 16);

   // arms
   guy1.moveArm('arm_left', 0, 0.75);
   guy1.moveArm('arm_right', 0, 0.75);

   // head
   guy1.moveHead(0);

   // over all position and heading of guy
   //guy1.group.position.set(0, 14, 0);
   //guy1.group.lookAt(100, 0, 0);

   camera.lookAt(guy1.group.position);
};

