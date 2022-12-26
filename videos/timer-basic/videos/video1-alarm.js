// video1-alarm for template6-timer-basic
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
    // CONST
    // ---------- ----------
    const SECS = 0;                      // NUMBER OF SECONDS SHOULD BE ZERO FOR AN ALARM
    const DAE_SCENE_FILE = 'cd3-ground'; // DAE file to use in /dae/count_down_basic
    const START_FRAME = 899;             // The start frame value to display 
                                         // ( this should be the last frame value from the cd video part )
    const ALARM_SECS = 5;
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
        [-5, 2, 4, 0, 1, 8,    0, 0, 2,      100]
    ]);
    //scene.add( curveMod.debugPoints( v3Array_campos ) );
    //-------- ----------
    // USING DAE LOADER OF COUNT-DOWN.JS
    //-------- ----------
    return countDown.DAE_loader(
        [
            videoAPI.pathJoin(sm.filePath, '../../../dae/count_down_basic/cd3-nums.dae'),
            videoAPI.pathJoin(sm.filePath, '../../../dae/count_down_basic/' + DAE_SCENE_FILE + '.dae')
        ]
    )
    .then( (SOURCE_OBJECTS) => {
        console.log('Done Loading.');
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
            digits: 4,
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
        //!!! I SHOULD NOT HAVE TO COPY AND PAST THIS FROM THE COUNT-DOWN.JS MODULE
        const positionDigit = (digit, di, digits, width) => {
            const hd = digits / 2;
            const sx = hd * width * -1;
            digit.position.x = width / 2 + sx + width * di;
        };
        const opt_seq = {
            fps: 30,
            beforeObjects: function(seq){
                // camera defaults
                camera.position.set(10, 10, 10);
                camera.lookAt(0, 0, 0);
                camera.zoom = 1.26;
                // DISPLAY SECS VALUES, WHICH SHOULD BE 0 OR whatever to display for an alarm video part
                countDown.set(count_sec, SECS);
                countDown.set(count_frames, seq.frame + START_FRAME);
                // scale all digit groups of count_secs
                const a1 = seq.getSinBias( Math.floor(ALARM_SECS * 2) , false);
                count_sec.children.forEach( (digit, i) => {
                    const s = 1 + 0.25 * a1;
                    digit.scale.set(s, s, s);
                    // adjust position
                    positionDigit(digit, i, 2, 1)
                    const n = i % 2 === 0 ? -1 : 1;
                    digit.position.x = digit.position.x + (0.30 * n) * a1;
                    digit.position.y = 0.5 * a1;
                    // adjust rotation
                    digit.rotation.y = Math.PI / 180 * 22.5 * n * a1;
                });
            },
            afterObjects: function(seq){
                camera.updateProjectionMatrix();
            },
            objects: []
        };
        // SEQ 4 - EFFECT DEMO
        opt_seq.objects[0] = {
            secs: ALARM_SECS,
            v3Paths: [
                { key: 'campos', array: v3Array_campos, lerp: true }
            ],
            update: function(seq, partPer, partBias){
                // CAMERA
                seq.copyPos('campos', camera);
                //camera.position.set(10, 10, 10);
                camera.lookAt( count_sec.position.clone().add(new THREE.Vector3(0,-0.32,0)));
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
