// video1 for cubescape-ep1-dream
 
// scripts
VIDEO.scripts = [
  '../../../js/sequences/r0/sequences.js',
  '../../../js/world-position/r0/world-position.js',
  '../../../js/canvas/r0/canvas.js',
  '../../../js/guy/r0/guy.js',
  '../../../js/guy/r0/guy-canvas.js',
  '../../../js/guy/r0/guy-characters.js',
  '../../../js/datatex/r0/datatex.js',
  '../js/cube-stack.js',
  '../js/cube-stack-grid.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // ********** **********
    // SCENE
    // ********** **********
    scene.background = new THREE.Color('#00afaf');
    var ud = scene.userData;

    // ********** **********
    // LIGHT
    // ********** **********
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1, 3, -2);
    scene.add(dl);
    scene.add( new THREE.AmbientLight(0xffffff, 0.05) );

    // ********** **********
    // GUY1
    // ********** **********
    GuyCharacters.create(scene, 'guy1');
    var guy1 = ud.guy1;
    var guy1Obj = ud.obj1;
    var guy1_canvasObj = scene.userData.guy1_canvasObj;
    camera.lookAt(guy1Obj.position);
    // box helper ( set box.visible = true to see )
    var box = new THREE.BoxHelper( guy1Obj, 0xffff00 );
    box.visible = false;
    scene.add(box);
    // bounding box - ( trying this out for help with setting y position )
    var bbox = new THREE.Box3().setFromObject(guy1Obj);
    var bSize = new THREE.Vector3();
    // ********** **********
    // CUBE STACK GRID
    // ********** **********
    var ground = new THREE.Mesh(
        new THREE.BoxGeometry(900, 1, 700),
        new THREE.MeshStandardMaterial({color: new THREE.Color(0.1 , 0.1, 0.1)})
    );
    ground.position.set(0, -11, 0)
    scene.add(ground);
    // ********** **********
    // GUY HELPER FUNCTIONS
    // ********** **********
    // set guy position in trems of x and z, and 
    // optional alt if I want him going up into the sky for some reason
    var setGuyPos = function(x, z, alt){
        alt = alt === undefined ? 0 : alt;
        bbox.getSize(bSize);
        guy1Obj.position.set(x, bSize.y / 2 + alt, z);
    };
    // set guy facing helper that is alomst just a wrapper for lookAt
    // just treating y as a delta from the y position of the guy group object
    var setGuyFacing = function(x, y, z){
        guy1Obj.lookAt(x, guy1Obj.position.y + y, z);
    };
    // guy talk helper
    var guyTalk = function(mouthPer){
        guy1_canvasObj.draw({
           drawClass: 'face',
           drawMethod: 'talk',
           mouthPer: mouthPer,
           leftEyeXPer: 0.5, rightEyeXPer: 0.5
        });
    };
    // ********** **********
    // CUBE STACK GRID
    // ********** **********
    var colors1 = [ [0,1,0, [64, 200]], [1,0,0,[200, 255]], [0,1,1,[128, 200]], [1,0,1,[32, 255]] ];
    var soPalette = [
        { boxCount: 0, colors: colors1 },
        { boxCount: 3, colors: colors1 }, //{ boxCount: 30 }
        { boxCount: 15, colors: colors1 },
        // back
        { boxCount: 30, 
          colors: colors1,
          posArray: [6,6,6,6,13,13,20,20,27,27,34,34,34,34,34],
          planeColor: 0
        },
        // forward
        { boxCount: 30, 
          colors: colors1,
          posArray: [0,0,0,7,7,7],
          planeColor: 0
        }
    ];
    var sopArray = [
       1,1,1,1,1,
       1,2,2,2,1,
       1,3,0,4,4,
       1,2,2,2,1,
       1,1,1,1,1
    ];
    var csg = CubeStackGrid.create({ 
        gw: 5, gh: 5, space: 0.5, stackGW: 7, stackGH: 5, 
        stackOptionPalette: soPalette, sopArray: sopArray});
    scene.add(csg);
    // scale the csg
    csg.scale.set(20, 20, 20);

    // ********** **********
    // SEQUENCES
    // ********** **********
    // 0, 0.1, 0.1667, 0.2334, 0.4001, 0.4668, 0.5668, 0.6668
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            // sq1 - open with sky view of whole city scape scene
            {
                per: 0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 0, 0);
                    guy1.moveArm('arm_right', 0, 0);
                    guyTalk(0.5);
                    // camera
                    camera.position.set(200, 200, 200);
                    camera.lookAt(guy1Obj.position);
                }
            },
            // sq2 - zoom into location of guy1
            {
                per: 0.1000,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 0, 0);
                    guy1.moveArm('arm_right', 0, 0);
                    guyTalk(0.5);
                    // camera
                    var s = 200 - 195 * partPer;
                    camera.position.set(s, s, s);
                    camera.lookAt(guy1Obj.position);
                }
            },
            // sq3 - a pause looking at guy1, camera adjusts
            {
                per: 0.1667,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 0, 0);
                    guy1.moveArm('arm_right', 0, 0);
                    guyTalk(0.5);
                    // camera
                    camera.position.set(5, 5, 5 - 5 * partPer);
                    camera.lookAt( guy1Obj.position.clone().add(new THREE.Vector3(0, 1 * partPer, 0)) );
                }
            },
            // sq4 - guy1 says: 'if this is a dream, that means I can fly' 
            {
                per: 0.2334,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 0, 0);
                    guy1.moveArm('arm_right', 0, 0);
                    guyTalk(0.5 + Math.cos( Math.PI * 8 * partBias )  );
                    // camera
                    camera.position.set(5, 5, 0);
                    camera.lookAt( guy1Obj.position.clone().add(new THREE.Vector3(0, 1, 0)) );
                }
            },
            // sq5 - guy1 raises his arms up
            {
                per: 0.4001,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 1 - 0.5 * partPer, 0.1 * partPer );
                    guy1.moveArm('arm_right', 1 - 0.5 * partPer, 0.1 * partPer );
                    guyTalk(0.5);
                    // camera
                    camera.position.set(5, 5, 0);
                    camera.lookAt(guy1Obj.position.clone().add(new THREE.Vector3(0, 1 - partPer, 0)));
                }
            },
            // sq6 - guy one takes off
            {
                per: 0.4668,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0, 30 * partPer);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 0.5, 0.1);
                    guy1.moveArm('arm_right', 0.5, 0.1);
                    guyTalk(0.5);
                    // camera
                    camera.position.set(5 + 5 * partPer, 5 + 30 * partPer, 0);
                    camera.lookAt(guy1Obj.position.clone().add(new THREE.Vector3(0, 0, 0)));
                    //camera.lookAt(0, 3 + 6 * partPer, 0);
                }
            },
            // sq7 - guy rotates camera moves to a behind view
            {
                per: 0.5668,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0, 30);
                    setGuyFacing(3 - 3 * partPer, -3 * partPer, 0);
                    guy1.moveArm('arm_left', 0.5, 0.1);
                    guy1.moveArm('arm_right', 0.5, 0.1);
                    guyTalk(0.5);
                    // camera
                    camera.position.set(10 - 20 * partPer, 35, 10 * partBias);
                    camera.lookAt(guy1Obj.position);
                    //camera.lookAt(0, 9, 0);
                }
            },
            // sq8 - guy starts to fly
            {
                per: 0.6668,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    var x = 200 * partPer;
                    setGuyPos(x, 0, 30);
                    setGuyFacing(x + 0.001, -3, 0);
                    guy1.moveArm('arm_left', 0.5, 0.1);
                    guy1.moveArm('arm_right', 0.5, 0.1);
                    guyTalk(0.5);
                    // camera
                    //camera.position.set(-10, 35, 0);
                    camera.position.copy( guy1Obj.position.clone().add( new THREE.Vector3(-10, 5, 0) ) );
                    camera.lookAt(guy1Obj.position);
                    //camera.lookAt(0, 9, 0);
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    // sequences
    Sequences.update(sm.seq, sm);
};

