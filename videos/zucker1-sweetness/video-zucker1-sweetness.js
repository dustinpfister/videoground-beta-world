
// sweet-baby-rays baby...ohhhh yeahhhh
VIDEO.daePaths = [
  '../../dae/sweet-baby-rays/sweet-baby-rays-2.dae'
];

VIDEO.scripts = [
   '../../js/canvas.js',
   '../../js/sequences.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    // SCENE
    scene.background = new THREE.Color('#00afaf');
    // CAMERA
    camera.position.set(0, 0, 5);
    camera.lookAt(0,0.25,0);

    // SWEETNESS
    let sweet = scene.userData.sweet = utils.DAE.getMesh( VIDEO.daeResults[0] );
    let map = sweet.material.map;
    sweet.material = new THREE.MeshStandardMaterial({
        emissive: new THREE.Color('#ffffff'),
        emissiveMap: map,
        emissiveIntensity: 1
    });
    scene.add(sweet);

    var sweetCollection = scene.userData.sweetCollection = new THREE.Group();
    var i = 0, len = 10;
    while(i < len){
        sweetCollection.add(sweet.clone());
        i += 1;
    }
    scene.add(sweetCollection);

    // SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            {
                per: 0,
                init: function(sm){
                    camera.position.set(0, 0, 5);
                    
                    // start position for sweet collection group
                    sweetCollection.position.set(0, 0, -10);

                    // starting positions for each child mesh of the sweetCollection
                    var len = sweetCollection.children.length;
                    sweetCollection.children.forEach(function(mesh, i){
                        var per = i / len;
                        mesh.position.x = -9 + 20 * per;
                    });

                    // set starting rotation for main sweet mesh
                    sweet.rotation.set(Math.PI / 180 * 300, 0, 0);
                    sweet.position.set(0, 0, 0);

                },
                update: function(sm, scene, camera, partPer, partBias){
                    let sweet = scene.userData.sweet;
                    sweet.rotation.z = Math.PI - Math.PI * 2 * partPer;
                }
            },
            {
                per: 0.5,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    let sweet = scene.userData.sweet;
                    sweet.rotation.y = Math.PI * partPer;
                }
            },
            {
                per: 0.9,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move main sweet up
                    sweet.position.set(0, 5 * partPer, 0);
                    // move collection forward
                    sweetCollection.position.set(0, 0, -10 + 16 * partPer);
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){

    var sweetCollection = scene.userData.sweetCollection;

    // sequences
    Sequences.update(sm.seq, sm);

/*
    var len = sweetCollection.children.length;
    sweetCollection.children.forEach(function(mesh, i){
        var per = i / len,
        a = sm.per * 2 % 1,
        b = 1 - Math.abs((0.5 - a)) / 0.5,
        c = (b + (i / len) * 2);
        mesh.position.y = -1 + c;
    });
*/
};

