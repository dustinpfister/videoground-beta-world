// video1 for template5-guy-one-helpers
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/guy/r0/guy.js',
   '../../../js/texture/r0/texture.js',
   '../helpers.js' // <== Using a Video folder level helpers file
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // GUY
    //-------- ----------
    const material = helper.createMaterials();
    material.body.color = new THREE.Color(1, 1, 1);
/*
    materals.head = [
        // 0 default material
        new THREE.MeshLambertMaterial({
            color: 0xffaf00, side: THREE.DoubleSide
        }),
        // 1 used for the face
        new THREE.MeshLambertMaterial({
            color: 0xffffff, side: THREE.DoubleSide
        })
    ];
*/
    const guy1 = helper.createGuyHScale(3, 5, 8, material);
    scene.add(guy1.group);
    //-------- ----------
    // LIGHT
    //-------- ----------
    const pl = new THREE.PointLight(0xffffff, 1);
    pl.position.set(3, 2, 1);
    scene.add(pl);
    const al = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(al);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    const v3Array_campos = helper.QBV3Array([
        [5,5,5, 4,2,-4,    1,0,1,      100]
    ]);
    //scene.add( helper.QBDebugV3Array(v3Array_campos, 0.1, new THREE.Color(0, 1, 1)) );
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(5, 5, 5);
            camera.lookAt(guy1.group.position);
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // update guy1
            helper.updateGuyEffect(guy1, 0);
        }
     };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // update guy1
            helper.updateGuyEffect(guy1, partBias);
            // camera
            seq.copyPos('campos', camera);
            camera.lookAt(guy1.group.position);
        }
    };
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
    //-------- ----------
    // LOAD IMAGES
    //-------- ----------
    return textureMod.load({
        URLS_BASE: videoAPI.pathJoin(sm.filePath, '../../../img/smile/'),
        URLS: ['smile_sheet_128.png','smile_creepy_128.png']
    }).then( (textureObj) => {
        console.log(textureObj);
        return Promise.resolve('image list loaded!');
    });
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 