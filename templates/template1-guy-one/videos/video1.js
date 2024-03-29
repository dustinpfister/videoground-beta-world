// video1 for guy-one template
 
// scripts
VIDEO.scripts = [
    '../../../js/sequences/r0/sequences.js',
    '../../../js/world-position/r0/world-position.js',
    '../../../js/canvas/r0/canvas.js',
    '../../../js/guy/r0/guy.js',
    '../../../js/guy/r0/guy-canvas.js',
    '../../../js/guy/r0/guy-characters.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');
    var ud = scene.userData;

    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    scene.add( grid );

    // light
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1, 3, 1);
    scene.add(dl);

    // CALL create method for guy1
    GuyCharacters.create(scene, 'guy1');
    var guy1Obj = ud.obj1;
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

    // SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            {
                per: 0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10, 10, 10);
                    camera.lookAt(guy1Obj.position);
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0);
                    setGuyFacing(3, 0, 0);
                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10, 10, 10);
                    camera.lookAt(guy1Obj.position);
                    // guy1
                    box.setFromObject(guy1Obj);
                    bbox.setFromObject(guy1Obj);
                    setGuyPos(0, 0, 0);
                    setGuyFacing(3 - 6 * partPer, 0, -6 * partBias);
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

