// video2-curve-r1 for template7-timer-min-sec-ms
// * using r1 of curve.js
// * using curveMod.QBCurvePath over that of curveMod.QBV3Array
// * uisng curve paths diretcly ovet that of the sequence hooks feature
// scripts
VIDEO.scripts = [
   // CORE MODULES
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/count-down/r0/count-down.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // SETTINGS AND COST VALUES
    // ---------- ----------
    // just set the desired SECS count for the count down
    // as the main thing to make one video from the next
    const SECS_COUNT_DOWN = 30;                                          // NUMBER OF SECONDS FOR THE COUNTDOWN
    const SECS_ALARM = 5;                                                // NUMBER OF SECONDS FOR THE ALARM
    const THUM_MODE = false;                                             // SET VIDEO INTO THUM MODE
    const THUM_FRAMES = 100;                                             // number of frames when in THUM MODE
    // OTHER SETTINGS THAT I MIGHT NOT NEED TO CHANGE FROM
    const SECS = SECS_COUNT_DOWN + SECS_ALARM;                           // NUMBER OF TOTAL SECONDS
    const FPS = 30;                                                      // FRAMES PER SECOND
    // DAE FILES FOR NUMS AND OTHER OBJECTS
    const URL_DAE_NUMS = '../../../dae/count_down_basic/cd3-nums.dae';
    const URL_DAE_SCENE = '../../../dae/count_down_basic/cd3-ground.dae';
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
    const canObj = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#000000', '#1f1f1f', '#00ffff'],
        dataParse: 'lzstring64',
        state: { w: 8, h: 5, data: 'AwGlEYyzNCVgpcmPit1mqvTsg===' }
    });
    // can use LZString to compress and decompress
    //console.log( LZString.decompressFromBase64('AwGlEYyzNCVgpcmPit1mqvTsg===') );
    // I want to repeat the texture
    const texture = canObj.texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32, 24);
    scene.background = texture;
    //-------- ----------
    // CURVE PATHS
    //-------- ----------
    const cam_pos_cd = curveMod.QBCurvePath([ [5, 2, 5, -5, 2, 4,    0, -3, 4,      100] ]);
    const cam_pos_alarm = curveMod.QBCurvePath([ [-5, 2, 4, 0, 1, 8,    0, 3, 5,      100] ]);
    //scene.add( curveMod.debugPointsCurve( cam_pos_cd, { count: 40, size: 0.5, color: new THREE.Color(1, 0, 0)} ) );
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
        // MIN AND SEC COUNT DOWN OBJECTS
        //-------- ----------
        // count min count down object
        const count_min = countDown.create({
            countID: 'min',
            digits: 2,
            width: 1.1,
            source_objects: SOURCE_OBJECTS
        });
        count_min.position.set(-1.2, 1.08, 0.4);
        count_min.scale.set(0.8, 0.8, 0.8);
        scene.add(count_min);
        // count secs count down object
        const count_sec = countDown.create({
            countID: 'sec',
            digits: 2,
            width: 1.1,
            source_objects: SOURCE_OBJECTS
        });
        count_sec.position.set(1.2, 1.08, 0.4);
        count_sec.scale.set(0.8, 0.8, 0.8);
        scene.add(count_sec);
        //-------- ----------
        // COLON
        //-------- ----------
        const colon_mat = new THREE.MeshPhongMaterial({color:0xaaaaaa});
        const colon = new THREE.Group();
        const mesh1 = new THREE.Mesh( new THREE.BoxGeometry(0.5,0.5,0.5), colon_mat);
        mesh1.position.y = 0.45;
        colon.add(mesh1);
        const mesh2 = new THREE.Mesh( new THREE.BoxGeometry(0.5,0.5,0.5), colon_mat);
        mesh2.position.y = -0.45;
        colon.add(mesh2);
        scene.add(colon);
        colon.position.set(0, 1.05, 0.4);
        //-------- ----------
        // FRAME COUNT
        //-------- ----------
        // adding a frame count
        const count_frames = countDown.create({
            countID: 'frames',
            digits: 6,
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
            },
            afterObjects: function(seq){
                camera.lookAt(0,1,0);
                camera.updateProjectionMatrix();
            },
            objects: []
        };
        // SEQ 0 - count down
        opt_seq.objects[0] = {
            secs: SECS_COUNT_DOWN,
            update: function(seq, partPer, partBias){
                // SECS COUNTER
                const a1 = (seq.partFrame + 1) / seq.partFrameMax;
                const n = Math.floor(SECS_COUNT_DOWN - SECS_COUNT_DOWN * a1);
                let mins = Math.floor(n / 60);
                let secs = n % 60;
                // in thum mode secs should be SECS_COUNT_DOWN
                if(THUM_MODE){
                    secs = SECS_COUNT_DOWN;
                };
                countDown.set(count_min, mins);
                countDown.set(count_sec, secs);
                // CAMERA
                //camera.position.set(15, 10, 15);
                camera.position.copy( cam_pos_cd.getPoint(partPer) );
            }
        };
        // SEQ 1 - ALARM
        opt_seq.objects[1] = {
            secs: SECS_ALARM,
            update: function(seq, partPer, partBias){
                let secs = 0;
                // in thum mode secs should be SECS_COUNT_DOWN
                if(THUM_MODE){
                    secs = SECS_COUNT_DOWN;
                };
                // update secs count
                countDown.set(count_sec, secs);
                // CAMERA
                camera.position.copy( cam_pos_alarm.getPoint(partPer) );
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
    });
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
