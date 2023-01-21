// video2-dae.js - from timer-train - videoground-beta-world project
// * using a trainset land1 dae file
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
    const SECS_COUNT_DOWN = 25;                                          // NUMBER OF SECONDS FOR THE COUNTDOWN
    const SECS_ALARM = 5;                                                // NUMBER OF SECONDS FOR THE ALARM
    const THUM_MODE = false;                                             // SET VIDEO INTO THUM MODE
    const THUM_FRAMES = 100;                                             // number of frames when in THUM MODE
    // OTHER SETTINGS THAT I MIGHT NOT NEED TO CHANGE FROM
    const SECS = SECS_COUNT_DOWN + SECS_ALARM;                           // NUMBER OF TOTAL SECONDS
    const FPS = 30;                                                      // FRAMES PER SECOND
    // DAE FILES FOR NUMS AND OTHER OBJECTS
    const URL_DAE_NUMS = '../../../dae/count_down_basic/cd4-nums.dae';
    const URL_DAE_SCENE = '../../../dae/trainset/land-1.dae';
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

      const cp_pos_train = curveMod.QBCurvePath([ 
          [-3,1,10, 7,1,10, 0,0,0,     0],
          [7,1,10, 9,1,6, 1,0,2,     0],
          [9,1,6, 9,1,-2, 0,0,0,     0],
          [9,1,-2, 6,1,-5, 1,0,-2,     0],
          [6,1,-5, 0,1,-5, 0,0,0,     0],

          [0,1,-5, -5,1,3, -7,-1,-7,     0],

          [-5,1,3, -5,1,8, 0,0,0,     0],
          [-5,1,8, -3,1,10, -2,0,1,     0]
      ]);
      scene.add( curveMod.debugPointsCurve( cp_pos_train, { count: 40, size: 1.0, color: new THREE.Color(1, 0, 1)} ) );

//    const cw_pos_cd = curveMod.QBCurvePath([ [0, 2, 5, -5, 2, 4,    0, -3, 4,      100] ]);
//    const cw_pos_alarm = curveMod.QBCurvePath([ [-5, 2, 4, 0, 1, 8,    0, 3, 5,      100] ]);

//    scene.add( curveMod.debugPointsCurve( cw_pos_cd, { count: 40, size: 0.5, color: new THREE.Color(0, 1, 0)} ) );

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
        // TIME GROUP composed of MIN, SEC, COLON OBJECTS
        //-------- ----------
        const count_wrap = new THREE.Group();
        count_wrap.scale.set(1.5, 1.5, 1.5);
        //count_wrap.position.y = 1.03;
        scene.add(count_wrap);
        count_wrap.position.set(-10,0,-10);
        // count min count down object
        const count_min = countDown.create({
            countID: 'min',
            digits: 2,
            width: 1.1,
            source_objects: SOURCE_OBJECTS
        });
        count_min.position.set(-1.5, 0, 0.4);
        //count_min.scale.set(0.8, 0, 0.8);
        count_wrap.add(count_min);
        // count secs count down object
        const count_sec = countDown.create({
            countID: 'sec',
            digits: 2,
            width: 1.1,
            source_objects: SOURCE_OBJECTS
        });
        count_sec.position.set(1.5, 0, 0.4);
        //count_sec.scale.set(0.8, 0, 0.8);
        count_wrap.add(count_sec);
        // colon
        const colon = SOURCE_OBJECTS.colon;
        colon.position.set(0, 0, 0.4);
        count_wrap.add(colon);
        // adding a frame count
        const count_frames = countDown.create({
            countID: 'frames',
            digits: 6,
            width: 1.4,
            source_objects: SOURCE_OBJECTS
        });
        count_frames.scale.set(0.4, 0.4, 0.4);
        count_frames.position.set(0, -1.5, 0.50);
        count_wrap.add(count_frames);
        //-------- ----------
        // THEME OBJECTS
        //-------- ----------
        const material_land = new THREE.MeshNormalMaterial({ wireframe: true, wireframeLinewidth: 6 });
        const material_train0 = new THREE.MeshPhongMaterial({});
        const material_train1 = new THREE.MeshNormalMaterial({});


        // THE LAND MESH
//        const land = new THREE.Mesh( new THREE.PlaneGeometry(30, 30, 10, 10), material_land );
//        land.geometry.rotateX(Math.PI * 1.5);
//        scene.add(land);
        const land = SOURCE_OBJECTS['trainset_land'];
        scene.add(land);



        // TRAIN MESH OBJECTS
        SOURCE_OBJECTS['train_0'] = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 2), material_train0 );
        SOURCE_OBJECTS['train_1'] = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 2), material_train1 );

        const train = new THREE.Group();
        scene.add(train);
        [1,1,1,1,1,0].forEach((ti)=>{
            const mesh = SOURCE_OBJECTS['train_' + ti].clone();
            train.add(mesh);
        });


        const setTranPos = (train, cp, alpha) => {
            train.children.forEach( (car, i, arr) => {
                const alpha_car = i / arr.length;
                const alpha_car_pos = alpha_car * 0.18 + alpha;
                const v = cp.getPoint(alpha_car_pos % 1);
                car.position.copy(v);

                // get a look at point
                const v_look = cp.getPoint( (alpha_car_pos + 0.01) % 1);
                car.lookAt(v_look);
            })
        };

        setTranPos(train, cp_pos_train, 0);


        //-------- ----------
        // A MAIN SEQ OBJECT
        //-------- ----------
        // start options for main seq object
        const opt_seq = {
            fps: FPS,
            beforeObjects: function(seq){
                // CAMERA DEFAULTS
                camera.position.set(20, 20, 20);
                camera.lookAt(0, 0, 0);
                camera.zoom = 1.20;
                // COUNT WRAP DEFAULTS
                count_wrap.position.set(0, 1, 0);
                // FRAME COUNTER
                let f = seq.frame;
                if(THUM_MODE){
                    f = 0;
                };
                countDown.set(count_frames, f);

        setTranPos(train, cp_pos_train, seq.per);

            },
            afterObjects: function(seq){

                //camera.lookAt(count_wrap.position);
                camera.updateProjectionMatrix();
                // COUNT WRAP SHOULD ALWAYS...
                //count_wrap.lookAt(camera.position);

             
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
                // COUNT DOWN WRAP
                //const v1 = cw_pos_cd.getPoint(partPer);
                //const e1 = new THREE.Euler(0,Math.PI * 0.5,0);
                //count_wrap.position.copy( v1 );
                // CAMERA
                //camera.position.set(15, 10, 15);
                //camera.position.copy(v1).add( v1.clone().normalize().applyEuler(e1).multiplyScalar(4) );
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
                // COUNT DOWN WRAP
                //const v1 = cw_pos_alarm.getPoint(partPer);
                //const e1 = new THREE.Euler(0,Math.PI * 0.5,0);
                //count_wrap.position.copy( v1 );
                // CAMERA
                //camera.position.copy(v1).add( v1.clone().normalize().applyEuler(e1).multiplyScalar(4) );
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
