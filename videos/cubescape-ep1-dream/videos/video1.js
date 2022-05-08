// video1 for cubescape-ep1-dream
 
// scripts
VIDEO.scripts = [
    '../../../js/sequences.js',
    '../../../js/world-position.js',
    '../../../js/canvas.js',
    '../../../js/guy.js',
    '../../../js/guy-canvas.js',
    '../../../js/guy-characters.js',
    '../../../js/datatex.js',
    '../js/cube-stack.js',
    '../js/cube-stack-grid.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // ********** **********
    // SCENE
    // ********** **********
    scene.background = new THREE.Color('#2a2a2a');
    var ud = scene.userData;

    // ********** **********
    // LIGHT
    // ********** **********
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1, 3, 1);
    scene.add(dl);

    // ********** **********
    // GUY1
    // ********** **********
    GuyCharacters.create(scene, 'guy1');
    var guy1 = ud.guy1;
    var guy1Obj = ud.obj1;
    camera.lookAt(guy1Obj.position);
    // box helper ( set box.visible = true to see )
    var box = new THREE.BoxHelper( guy1Obj, 0xffff00 );
    box.visible = false;
    scene.add(box);
    // bounding box - ( trying this out for help with setting y position )
    var bbox = new THREE.Box3().setFromObject(guy1Obj);
    var bSize = new THREE.Vector3(); 
    // set guy position in trems of x and z, and 
    // optional alt if I want him going up into the sky for some reason
    var setGuyPos = function(x, z, alt){
        alt = alt === undefined ? 0 : alt;
        bbox.getSize(bSize);
        guy1Obj.position.set(z, bSize.y / 2 + alt, z);
    };
    // set guy facing helper that is alomst just a wrapper for lookAt
    // just treating y as a delta from the y position of the guy group object
    var setGuyFacing = function(x, y, z){
        guy1Obj.lookAt(x, guy1Obj.position.y + y, z);
    };

    // ********** **********
    // CUBE STACK GRID
    // ********** **********
    var soPalette = [
        { boxCount: 0 },
        { boxCount: 30 }
    ];
    var sopArray = [
       1,1,1,1,1,
       1,1,1,1,1,
       1,1,0,1,1,
       1,1,1,1,1,
       1,1,1,1,1
    ];
    var csg = CubeStackGrid.create({ 
        gw: 5, gh: 5, space: 0, stackGW: 7, stackGH: 5, 
        stackOptionPalette: soPalette, sopArray: sopArray});
    scene.add(csg);
    // scale the csg
    csg.scale.set(16, 16, 16);

    // ********** **********
    // SEQUENCES
    // ********** **********
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
                    // camera
                    camera.position.set(200, 200, 200);
                    camera.lookAt(guy1Obj.position);
                }
            },
            // sq2 - zoom into location of guy1
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 0, 0);
                    guy1.moveArm('arm_right', 0, 0);
                    // camera
                    var s = 200 - 195 * partPer;
                    camera.position.set(s, s, s);
                    camera.lookAt(guy1Obj.position);
                }
            },
            // sq3 - a pause looking at guy1 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 0, 0);
                    guy1.moveArm('arm_right', 0, 0);
                    // camera
                    camera.position.set(5, 5, 5);
                    camera.lookAt(guy1Obj.position);
                }
            },
            // sq4 - guy1 says: 'if this is a dream, that means I can fly' 
            {
                per: 0.20,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 0, 0);
                    guy1.moveArm('arm_right', 0, 0);
                    // camera
                    camera.position.set(5, 5, 5 - 5 * partPer);
                    camera.lookAt(guy1Obj.position.clone().add(new THREE.Vector3(0,1 * partPer,0)));
                }
            },
            // sq5 - guy1 raises his arms up
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 1 - 0.5 * partPer, 0.1 * partPer );
                    guy1.moveArm('arm_right', 1 - 0.5 * partPer, 0.1 * partPer );
                    // camera
                    camera.position.set(5, 5, 0);
                    camera.lookAt(guy1Obj.position.clone().add(new THREE.Vector3(0, 1 - partPer, 0)));
                }
            },
            // sq6 - guy one takes off
            {
                per: 0.30,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0, 30 * partPer);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 0.5, 0.1);
                    guy1.moveArm('arm_right', 0.5, 0.1);
                    // camera
                    camera.position.set(5 + 5 * partPer, 5 + 10 * partPer, 0);
                    camera.lookAt(guy1Obj.position.clone().add(new THREE.Vector3(0, 0, 0)));
                    //camera.lookAt(0, 3 + 6 * partPer, 0);
                }
            },
            // sq7 - 
            {
                per: 0.50,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0, 30);
                    setGuyFacing(3, 0, 0);
                    guy1.moveArm('arm_left', 0.5, 0.1);
                    guy1.moveArm('arm_right', 0.5, 0.1);
                    // camera
                    camera.position.set(10, 15, 0);
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

