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
        { boxCount: 20 },
        { boxCount: 60 },
        { boxCount: 120, colors: [ [1,0,0, [64, 255]], [1,1,0, [64, 255]] ] },
        { boxCount: 80, colors: [ [1,0,0, [64, 255]], [1,1,0, [64, 255]] ] }
    ];
    var sopArray = [
       1,1,1,
       1,0,1,
       1,1,1
    ];
    var csg = CubeStackGrid.create({ gw: 3, gh: 3, stackGW: 5, stackGH: 5, stackOptionPalette: soPalette, sopArray: sopArray});
    scene.add(csg);

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
                    // camera
                    camera.position.set(20, 20, 20);
                    camera.lookAt(guy1Obj.position);
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                }
            },
            // sq2 - zoom into location of guy1
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    var s = 20 - 15 * partPer;
                    camera.position.set(s, s, s);
                    camera.lookAt(guy1Obj.position);
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                }
            },
            // sq3 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(5, 5, 5 - 5 * partPer);
                    camera.lookAt(guy1Obj.position.clone().add(new THREE.Vector3(0,1 * partPer,0)));
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
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

