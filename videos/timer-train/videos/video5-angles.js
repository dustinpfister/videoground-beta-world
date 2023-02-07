// video5-angles.js - from timer-train - videoground-beta-world project
//     * more than one sequence object for the count down part of the video
// scripts
VIDEO.scripts = [
   // CORE MODULES
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/count-down/r0/count-down-tempfix.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // SETTINGS AND COST VALUES
    // ---------- ----------
    // just set the desired SECS count for the count down
    // as the main thing to make one video from the next
    const SECS_COUNT_DOWN = 30;                                          // NUMBER OF SECONDS FOR THE COUNTDOWN
    const SECS_ALARM = 10;                                               // NUMBER OF SECONDS FOR THE ALARM
    const THUM_MODE = false;                                             // SET VIDEO INTO THUM MODE
    const THUM_FRAMES = 100;                                             // number of frames when in THUM MODE
    // OTHER SETTINGS THAT I MIGHT NOT NEED TO CHANGE FROM
    const SECS = SECS_COUNT_DOWN + SECS_ALARM;                           // NUMBER OF TOTAL SECONDS
    const FPS = 30;                                                      // FRAMES PER SECOND
    // DAE FILES FOR NUMS AND OTHER OBJECTS
    const URL_DAE_NUMS = '../../../dae/count_down_basic/cd4-nums.dae';
    const URL_DAE_SCENE = '../../../dae/trainset/land-1c.dae';
    const URL_DAE_TRAIN = '../../../dae/trainset/train-1b.dae';
    const URL_DAE_LANDSCAPE = '../../../dae/trainset/landscape-1b.dae';
    // RESOURCE DAE PATHS
    const URL_DAE_NUMS_RESOURCE = '../../../dae/count_down_basic/skins/depth_256/';
    const URL_DAE_SCENE_RESOURCE = '../../../dae/trainset/skins/land-1-detail/';
    const URL_DAE_TRAIN_RESOURCE = '../../../dae/trainset/skins/train-1-detail/';
    const URL_DAE_LANDSCAPE_RESOURCE = '../../../dae/trainset/skins/landscape-1-solid/';
    // TRAIN SETTINGS
    const TRAIN_Y_ADJUST = new THREE.Vector3(0,0,0);
    const TRAIN_LAPS = 8 * ( ( SECS_COUNT_DOWN + SECS_ALARM ) / 60 );
    const TRAIN_CARS = [0,0,0,0,0,0,0,0,0,1];
    const TRAIN_SPACING = 0.19;
    // CAMERA SETTING
    const CAMERA_FIXED_TO_FOLLOW_RATE = 2.25;
    //-------- ----------
    // TRAIN HELPERS
    //-------- ----------
    const getTrainVectors = (cp, alpha) => {
        return {
            pos: cp.getPoint(alpha % 1).add(TRAIN_Y_ADJUST),
            look: cp.getPoint( (alpha + 0.01) % 1).add(TRAIN_Y_ADJUST)
        };
    };
    // set position of train cars
    const setTranPos = (train, cp, alpha) => {
        train.children.forEach( (car, i, arr) => {
            const alpha_car = i / arr.length;
            const alpha_car_pos = alpha_car * TRAIN_SPACING + alpha;
            const v = getTrainVectors(cp, alpha_car_pos);
            car.position.copy(v.pos);
            car.lookAt(v.look);
        })
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
    const canObj = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#008a8a', '#00afaf', '#00ffff'],
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
        [-6.86,0, 1.50,     -6.86,0, 6.00,      0.00,0, 0.00,     0],
        [-6.86,0, 6.00,     -4.00,0, 8.62,     -1.00,0, 1.00,     0],
        [-4.00,0, 8.62,      6.50,0, 8.62,      0.00,0, 0.00,     0],
        [ 6.50,0, 8.62,      8.62,0, 5.50,      0.90,0, 0.90,     0],
        [ 8.62,0, 5.50,      8.62,0,-2.00,      0.00,0, 0.00,     0],
        [ 8.62,0,-2.00,      3.50,0,-6.85,      1.70,0,-1.70,     0],
        [ 3.50,0,-6.85,     -2.00,0,-6.85,      0.00,0, 0.00,     0],
        [-2.00,0,-6.85,     -6.86,0,-3.50,     -2.00,0,-2.00,     0],
        [-6.86,0,-3.50,     -6.86,0, 1.50,      0.00,0, 0.00,     0]
    ]);
    //scene.add( curveMod.debugPointsCurve( cp_pos_train, { count: 250, size: 0.125, color: new THREE.Color(1, 0, 1)} ) );
    //-------- ----------
    // USING DAE LOADER OF COUNT-DOWN.JS
    //-------- ----------
    return countDown.DAE_loader(
        [
            videoAPI.pathJoin(sm.filePath, URL_DAE_NUMS),
            videoAPI.pathJoin(sm.filePath, URL_DAE_SCENE),
            videoAPI.pathJoin(sm.filePath, URL_DAE_TRAIN),
            videoAPI.pathJoin(sm.filePath, URL_DAE_LANDSCAPE)
        ],
        [
            videoAPI.pathJoin(sm.filePath, URL_DAE_NUMS_RESOURCE),
            videoAPI.pathJoin(sm.filePath, URL_DAE_SCENE_RESOURCE),
            videoAPI.pathJoin(sm.filePath, URL_DAE_TRAIN_RESOURCE),
            videoAPI.pathJoin(sm.filePath, URL_DAE_LANDSCAPE_RESOURCE)
        ]
    )
    .then( (SOURCE_OBJECTS) => {
        console.log('DAE FILES LOADED');
        //-------- ----------
        // TIME GROUP composed of MIN, SEC, COLON OBJECTS
        //-------- ----------
        const count_wrap = new THREE.Group();
        count_wrap.scale.set(1.7, 1.7, 1.7);
        scene.add(count_wrap);
        //count_wrap.position.set(-10,0,-10);
        // count min count down object
        const count_min = countDown.create({
            countID: 'min',
            digits: 2,
            width: 1.1,
            source_objects: SOURCE_OBJECTS
        });
        count_min.position.set(-1.5, 0, 0.4);
        count_wrap.add(count_min);
        // count secs count down object
        const count_sec = countDown.create({
            countID: 'sec',
            digits: 2,
            width: 1.1,
            source_objects: SOURCE_OBJECTS
        });
        count_sec.position.set(1.5, 0, 0.4);
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
        count_frames.scale.set(0.5, 0.5, 0.5);
        count_frames.position.set(0, 1.55, 0.50);
        count_wrap.add(count_frames);
        //-------- ----------
        // THE LAND MESH
        //-------- ----------
        const material_land = new THREE.MeshNormalMaterial({ wireframe: true, wireframeLinewidth: 6 });
        const land = SOURCE_OBJECTS['trainset_land'];
        land.position.set(0,0,0);
        //land.rotation.set(Math.PI * 1.5,Math.PI * 0.0057, Math.PI * 0.0);
        scene.add(land);
        // water plane
        const material_water = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0,1,1),
            transparent: true,
            opacity: 0.25
        });
        const water = new THREE.Mesh( new THREE.PlaneGeometry(19, 20, 1, 1), material_water );
        water.geometry.translate(0,0,-0.5)
        land.add(water);
        //-------- ----------
        // TRAIN MESH OBJECTS
        //-------- ----------
        const train = new THREE.Group();
        scene.add(train);
        TRAIN_CARS.forEach((ti)=>{
            const mesh_source = SOURCE_OBJECTS['train_car_' + ti];
            const mesh = new THREE.Mesh(mesh_source.geometry.clone(), mesh_source.material);
            mesh.geometry.rotateX(Math.PI * 1.5);
            mesh.geometry.rotateY(Math.PI * 1.5);
            train.add(mesh);
        });
        //-------- ----------
        // LANDSCAPE OBJECTS
        //-------- ----------
        const LANDSCAPE_DATA = [ 
            1,  7.00, -0.30,  0.00,  1.57, // object_index, x, y, z, rotation_y
            1,  5.00, -0.30,  6.50,  5.80,
            0,  7.00, -0.30,  6.00,  0.00,
            0,  9.70, -0.30,  8.00,  0.00,
            0,  9.70, -0.30, -2.00,  0.00,
            0,  6.00, -0.30, -1.00,  0.00,
            0, -7.00,  0.95, -2.00,  0.00,
            0, -9.00,  0.60, -1.00,  0.00,
            0, -9.00,  1.70, -5.00,  0.00
        ];
        const data = LANDSCAPE_DATA;
        let i = 0;
        const len = data.length;
        while(i < len){
            const objIndex = data[i];
            const v = new THREE.Vector3(data[i + 1], data[i + 2], data[i + 3]);
            const mesh = SOURCE_OBJECTS['landscape_' + objIndex].clone();
            mesh.position.copy(v);
            mesh.rotation.set(Math.PI * 1.5, 0, data[i + 4]);
            scene.add(mesh);
            i += 5;
        }
        //-------- ----------
        // COUNT DOWN SEQ OBJECT
        //-------- ----------
        const seq_cd = seqHooks.create({
            setPerValues: false,
            fps: FPS,
            beforeObjects: function(seq){},
            objects: [
                // MOVE ALONG X
                {
                    per: 0,
                    update: function(seq, partPer, partBias){
                        camera.position.set(10 - 22 * partPer, 5, 15 - 3 * partPer);
                        camera.lookAt(0, 0.5, 0);
                    }
                },
                // MOVE DOWN
                {
                    per: 0.25,
                    update: function(seq, partPer, partBias){
                        const v1 = new THREE.Vector3(-12, 5, 12);
                        const v2 = new THREE.Vector3(-10, 0.25, 10);
                        camera.position.copy(v1.lerp(v2, partPer));
                        camera.lookAt(0, 0.5, 0);
                    }
                },
                // move back along x
                {
                    per: 0.50,
                    update: function(seq, partPer, partBias){
                        const v1 = new THREE.Vector3(-10, 0.25, 10);
                        const v2 = new THREE.Vector3(10, 0.25, 10);
                        camera.position.copy(v1.lerp(v2, partPer));
                        camera.lookAt(0, 0.5, 0);
                        camera.zoom = 0.80 - 0.25 * seq.getSinBias(1, true);
                    }
                }
            ]
        });
        //-------- ----------
        // A MAIN SEQ OBJECT
        //-------- ----------
        // start options for main seq object
        const opt_seq = {
            fps: FPS,
            beforeObjects: function(seq){
                // COUNT WRAP DEFAULTS
                count_wrap.position.set(0, 1.5, 0);
                // FRAME COUNTER
                let f = seq.frame;
                if(THUM_MODE){
                    f = 0;
                };
                countDown.set(count_frames, f);
                // TRAIN POS
                const a_trainpos = seq.getPer(TRAIN_LAPS, false);
                setTranPos(train, cp_pos_train, a_trainpos);
                // CAMERA DEFAULTS
                camera.zoom = 0.80;
            },
            afterObjects: function(seq){
                camera.updateProjectionMatrix();
                // have camera always follow train?
                //const a_trainpos = seq.getPer(TRAIN_LAPS, false);
                //const v_adjust = new THREE.Vector3(0, 0.5, 0);
                //const v = getTrainVectors(cp_pos_train, (a_trainpos + 0.95) % 1);
                //camera.position.copy(v.pos).add(v_adjust);
                //camera.lookAt(v.look.add(v_adjust));
				
				// ALWAYS TOP DOWN VIEW
				//camera.position.set(7,10, 7);
				//camera.lookAt(7,0,7)
				
            },
            objects: []
        };
        // SEQ 0 - count down
        opt_seq.objects[0] = {
            secs: SECS_COUNT_DOWN,
            update: function(seq, partPer, partBias){
                let n = seq.partFrame, d = seq.partFrameMax;
                if(n >= d){
                    n = seq.partFrameMax - 1;
                }
                const a1 = (n + 1) / d;
                const t = Math.floor(SECS_COUNT_DOWN - SECS_COUNT_DOWN * a1);
                let mins = Math.floor(t / 60);
                let secs = t % 60;
                mins = mins < 0 ? 0: mins;
                secs = secs < 0 ? 0: secs;
                // in thum mode secs should be SECS_COUNT_DOWN
                if(THUM_MODE){
                    mins = Math.floor(SECS_COUNT_DOWN / 60);
                    secs = SECS_COUNT_DOWN % 60;;
                };
                countDown.set(count_min, mins);
                countDown.set(count_sec, secs);
                // use the count down camera sequence object
                seqHooks.setFrame(seq_cd, n, d);
            }
        };
        // SEQ 1 - ALARM
        opt_seq.objects[1] = {
            secs: SECS_ALARM,
            update: function(seq, partPer, partBias){
                let mins = 0;
                let secs = 0;
                if(THUM_MODE){
                    mins = Math.floor(SECS_COUNT_DOWN / 60);
                    secs = SECS_COUNT_DOWN % 60;
                };
                // update secs count
                countDown.set(count_min, mins);
                countDown.set(count_sec, secs);
                // FIXED TO FOLOW TRAIN
                let a_trans = partPer * CAMERA_FIXED_TO_FOLLOW_RATE;
                a_trans = a_trans > 1 ? 1 : a_trans;
                const v1 = new THREE.Vector3(10, 0.25, 10);
                const v2 = new THREE.Vector3(0, 0.5, 0);
                const a_trainpos = seq.getPer(TRAIN_LAPS, false);
                const v_adjust = new THREE.Vector3(0, 0.28 * a_trans ,0);
                const v = getTrainVectors(cp_pos_train, (a_trainpos + 0.10) % 1);
                const v3 = v1.lerp(v.pos, a_trans).add(v_adjust);
                camera.position.copy( v1 );
                camera.lookAt( v2.lerp(v.look, a_trans).add(v_adjust) );
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
