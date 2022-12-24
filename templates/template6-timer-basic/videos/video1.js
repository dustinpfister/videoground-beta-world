// video1 for template6-timer-basic
// scripts
VIDEO.scripts = [
   // CORE MODULES
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/curve/r0/curve.js',
   '../../../js/count-down/r0/count-down.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(-2, 1, 2);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(al);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // PATHS
    //-------- ----------
    const v3Array_campos = curveMod.QBV3Array([
        [5, 5, 5, -5, 5, 5,    0, 0, 0,      100]
    ]);
    scene.add( curveMod.debugPoints( v3Array_campos ) );
    //-------- ----------
    // USING DAE LOADER OF COUNT-DOWN.JS
    //-------- ----------
    return countDown.DAE_loader(
        [
            videoAPI.pathJoin(sm.filePath, '../../../dae/count_down_basic/cd3-nums.dae'),
            videoAPI.pathJoin(sm.filePath, '../../../dae/count_down_basic/cd3-ground.dae')
        ]
    )
    .then( (SOURCE_OBJECTS) => {
        console.log('Done Loading.');
        console.log(SOURCE_OBJECTS);
        Object.keys( SOURCE_OBJECTS ).forEach( ( key ) => {
            const obj = SOURCE_OBJECTS[key];
            const mat = obj.material;
            if(mat.map){
                const tex = mat.map;
                //tex.magFilter = THREE.NearestFilter;
                //tex.minFilter = THREE.NearestFilter;
                console.log(mat.map);
            }
        });
        //-------- ----------
        // SCENE CHILD OBJECTS
        //-------- ----------
        // count secs count down object
        const count_sec = countDown.create({
            countID: 'sec',
            digits: 2,
            width: 1.1,
            source_objects: SOURCE_OBJECTS
        });
        count_sec.position.set(0, 1.30, 0.4);
        scene.add(count_sec);
        // adding a frame count
        const count_frames = countDown.create({
            countID: 'frames',
            digits: 3,
            width: 1.4,
            source_objects: SOURCE_OBJECTS
        });
        count_frames.scale.set(0.25, 0.25, 0.25);
        count_frames.position.set(0, 0, 1.50);
        scene.add(count_frames);
        // add ground object
        scene.add( SOURCE_OBJECTS['ground_0'] );
        //-------- ----------
        // A MAIN SEQ OBJECT
        //-------- ----------
        // start options for main seq object
        const opt_seq = {
            fps: 30,
            beforeObjects: function(seq){
                // camera defaults
                camera.position.set(10, 10, 10);
                camera.lookAt(0, 0, 0);
                camera.zoom = 1;
                const a1 = (seq.frame + 1) / seq.frameMax;
                let secs = Math.floor(30 - 30 * a1);
                countDown.set(count_sec, secs);
                countDown.set(count_frames, seq.frame);
            },
            afterObjects: function(seq){
                camera.updateProjectionMatrix();
            },
            objects: []
        };
        // SEQ 4 - EFFECT DEMO
        opt_seq.objects[0] = {
            secs: 30,
            v3Paths: [
                { key: 'campos', array: v3Array_campos, lerp: true }
            ],
            update: function(seq, partPer, partBias){
                // CAMERA
                //seq.copyPos('campos', camera);
                camera.position.set(15, 15, 15);
                camera.lookAt(count_sec.position);
            }
        };
        //-------- ----------
        // SET FRAME MAX
        //-------- ----------
        const seq = scene.userData.seq = seqHooks.create(opt_seq);
        console.log('frameMax for main seq: ' + seq.frameMax);
        sm.frameMax = seq.frameMax;
    })
    .catch( (e) => {
        console.log(e.message);
        scene.add( new THREE.GridHelper(10, 10) );
        renderer.render(scene, camera);
    });
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
