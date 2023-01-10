// video2-single.js for timer-basic
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
    // SETTINGS AND COST VALUES
    // ---------- ----------
    // just set the desired SECS count for the count down
    // as the main thing to make one video from the next
    const SECS_COUNT_DOWN = 10;                                          // NUMBER OF SECONDS FOR THE COUNTDOWN
    const SECS_ALARM = 10;                                                // NUMBER OF SECONDS FOR THE ALARM
    const THUM_MODE = false;                                              // SET VIDEO INTO THUM MODE
    const THUM_FRAMES = 100;                                             // number of frames when in THUM MODE
    // OTHER SETTINGS THAT I MIGHT NOT NEED TO CHANGE FROM
    const SECS = SECS_COUNT_DOWN + SECS_ALARM;                           // NUMBER OF TOTAL SECONDS
    const FPS = 30;                                                      // FRAMES PER SECOND
    // DAE FILES FOR NUMS AND OTHER OBJECTS
    const URL_DAE_NUMS = '../../../dae/count_down_basic/cd3-nums.dae';
    const URL_DAE_SCENE = '../../../dae/count_down_basic/cd3-ground.dae';
    // ---------- ----------
    // HELPERS
    // ---------- ----------
    // start options for main seq object
    //!!! I SHOULD NOT HAVE TO COPY AND PAST THIS FROM THE COUNT-DOWN.JS MODULE
    const positionDigit = (digit, di, digits, width) => {
        const hd = digits / 2;
        const sx = hd * width * -1;
        digit.position.x = width / 2 + sx + width * di;
    };
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
    const campos = curveMod.QBV3Array([ [5, 2, 5, -5, 2, 4,    0, -3, 4,      100] ]);
    const campos_alarm = curveMod.QBV3Array([ [-5, 2, 4, 0, 1, 8,    0, 3, 5,      100] ]);
    //scene.add( curveMod.debugPoints( campos_alarm ) );
    //-------- ----------
    // USING DAE LOADER OF COUNT-DOWN.JS
    //-------- ----------
    return countDown.DAE_loader(
        [
            videoAPI.pathJoin(sm.filePath, URL_DAE_NUMS),
            videoAPI.pathJoin(sm.filePath, URL_DAE_SCENE)
        ]
    )
    .then( (SOURCE_OBJECTS) => {
        console.log('DAE FILES LOADED');
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
        const opt_seq = {
            fps: FPS,
            beforeObjects: function(seq){
                // CAMERA DEFAULTS
                camera.position.set(10, 10, 10);
                camera.lookAt(0, 0, 0);
                camera.zoom = 1.26;
                // FRAME COUNTER
                let f = seq.frame;
                if(THUM_MODE){
                    f = 0;
                };
                countDown.set(count_frames, f);
                count_sec.children.forEach( (digit, i) => {
                    digit.scale.set(1, 1, 1);
                    // adjust position
                    positionDigit(digit, i, 2, 1.2)
                    digit.position.y = 0;
                    // adjust rotation
                    digit.rotation.y = 0;
                });
            },
            afterObjects: function(seq){
                camera.updateProjectionMatrix();
            },
            objects: []
        };
        // SEQ 0 - count down
        opt_seq.objects[0] = {
            secs: SECS_COUNT_DOWN,
            v3Paths: [
                { key: 'campos', array: campos, lerp: true }
            ],
            update: function(seq, partPer, partBias){
                // SECS COUNTER
                const a1 = (seq.partFrame + 1) / seq.partFrameMax;
                let secs = Math.floor(SECS_COUNT_DOWN - SECS_COUNT_DOWN * a1);
                // in thum mode secs should be SECS_COUNT_DOWN
                if(THUM_MODE){
                    secs = SECS_COUNT_DOWN;
                };
                countDown.set(count_sec, secs);
                // CAMERA
                seq.copyPos('campos', camera);
                //camera.position.set(10, 10, 10);
                camera.lookAt( count_sec.position.clone().add(new THREE.Vector3(0,-0.32,0)));
            }
        };
        // SEQ 1 - ALARM
        opt_seq.objects[1] = {
            secs: SECS_ALARM,
            v3Paths: [
                { key: 'campos_alarm', array: campos_alarm, lerp: true }
            ],
            update: function(seq, partPer, partBias){
                let secs = 0;
                // in thum mode secs should be SECS_COUNT_DOWN
                if(THUM_MODE){
                    secs = SECS_COUNT_DOWN;
                };
                // update secs count
                countDown.set(count_sec, secs);
                // CAMERA
                seq.copyPos('campos_alarm', camera);
                //camera.position.set(10, 10, 10);
                camera.lookAt( count_sec.position.clone().add(new THREE.Vector3(0,-0.32,0)));
                // scale all digit groups of count_secs
                const a1 = seq.getSinBias( Math.floor(SECS_ALARM * 2) , false);
                count_sec.children.forEach( (digit, i) => {
                    const s = 1 + 0.25 * a1;
                    digit.scale.set(s, s, s);
                    // adjust position
                    positionDigit(digit, i, 2, 1.2)
                    const n = i % 2 === 0 ? -1 : 1;
                    digit.position.x = digit.position.x + (0.30 * n) * a1;
                    digit.position.y = 0.5 * a1;
                    // adjust rotation
                    digit.rotation.y = Math.PI / 180 * 22.5 * n * a1;
                });
            }
        };
        //-------- ----------
        // SET FRAME MAX
        //-------- ----------
        const seq = scene.userData.seq = seqHooks.create(opt_seq);
        // THUM_FRAMES const should be used for THUM_Mode, 
        // else set it to the frameMax value of main seq object
        if(THUM_MODE){
            console.log('Timer Video is in THUM_Mode');
            sm.frameMax = THUM_FRAMES;
        }else{ 
            sm.frameMax = seq.frameMax;
            console.log( SECS_COUNT_DOWN + ' Timer Video = ' + sm.frameMax + ' Frames.' );
        }
        return '';
    })
    .catch( (e) => {
        console.log(e.message);
        return '';
    });
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
