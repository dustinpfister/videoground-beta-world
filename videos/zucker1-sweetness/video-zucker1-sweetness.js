
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
    // SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            {
                per: 0,
                init: function(sm){
                    camera.position.set(0, 0, 5); 
                    sweet.rotation.set(Math.PI / 180 * 300,0,0)
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
                    camera.position.set(0, 0, 5 + 50 * partPer); 
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

