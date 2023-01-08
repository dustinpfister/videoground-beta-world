// video2-single for timer-hum
// same as video1 but doing everything in a single file
// scripts
VIDEO.scripts = [
   // CORE MODULES
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/curve/r0/curve.js',
   '../../../js/count-down/r0/count-down.js',
   '../../../js/tween-many/r0/tween-many.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../../../js/object-grid-wrap/r2/effects/opacity2.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // SETTINGS AND COST VALUES
    // ---------- ----------
    // just set the desired SECS count for the count down
    // as the main thing to make one video from the next
    const SECS_COUNT_DOWN = 10;                                     // NUMBER OF SECONDS FOR THE COUNTDOWN
    const SECS_ALARM = 5;                                           // NUMBER OF SECONDS FOR THE ALARM
    const THUM_MODE = false;                                        // SET VIDEO INTO THUM MODE
    const THUM_FRAMES = 100;                                        // number of frames when in THUM MODE
    // OTHER SETTINGS THAT I MIGHT NOT NEED TO CHANGE FROM
    const SECS = SECS_COUNT_DOWN + SECS_ALARM;                      // NUMBER OF TOTAL SECONDS
    const FPS = 30;                                                 // FRAMES PER SECOND
    // DAE FILES FOR NUMS AND OTHER OBJECTS
    const URL_DAE_NUMS = '../../../dae/count_down_basic/cd3-nums.dae';
    const URL_DAE_SCENE = '../../../dae/hum/hum_lp.dae';
    // ---------- ----------
    // CONST
    // ---------- ----------
    const HUM_WING_FLAPS_PER_SEC = 2;
    const HUM_Y_BOUNCE_PER_SEC = 0.5;
    const HUM_SCALE_MAX = 0.45;
    const HUM_SCALE_SUB = 0.10;
    const HUM_ALARM_SCALE_CHANGE_PER_SEC = 1;      // the count of scale changes per second durring the alarm
    const HUM_ALARM_COLOR_LOOPS_PER_SEC = 0.5;
    const HUM_COLORS = 'cyan,red,lime,blue,orange,purple,yellow,green,white'.split(',').map( (str) => {
        return new THREE.Color(str);
    });
    //const HUM_COLORS = [ new THREE.Color(0, 1, 1), new THREE.Color(1, 0, 0), new THREE.Color(0, 1, 0) ];
    const HUM_DEFAULT_COLOR_INDEX = 0;
    const GRID_X_LOOPS_PER_SEC = 1 / 20;
    const COUNT_SECS_SCALE_MAX = 1.25;
    const COUNT_MS_SCALE_MAX = 0.58;
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 0.75);
    dl.position.set(-2, 3, 2);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(al);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#0f0f0f');
    //-------- ----------
    // PATHS
    //-------- ----------
    const campos_cd = curveMod.QBV3Array([
        [5, 2, 5.5, -5, 2, 4,    0, -3, 4,      100]
    ]);
    const campos_alarm = curveMod.QBV3Array([
        [-5, 2, 4, 0, 0, 8,    5, -5, 5,      100],
        [0, 0, 8, 6, -2, 2,    5, 5, 5,      100]
    ]);
    //scene.add( curveMod.debugPoints( campos_alarm ) );
    //-------- ----------
    // HELPERS for COUNT-DOWN.JS
    //-------- ----------
    const updateSourceStyle = (SOURCE_OBJECTS, numColor) => {
        // if I want to do something with each source objects
        Object.keys( SOURCE_OBJECTS ).forEach( ( key ) => {
            const obj = SOURCE_OBJECTS[key];
            const mat = obj.material;
            mat.transparent = true;
            mat.opacity = 1;
            // if number mesh
            if( String( parseInt(key) )  != 'NaN'){
                if(mat.map){
                    const tex = mat.map;
                    tex.magFilter = THREE.NearestFilter;
                    tex.minFilter = THREE.NearestFilter;
                }
            }else{
                // anything for other objects?
            }
        });
    };
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
        console.log('Done Loading.');
        updateSourceStyle(SOURCE_OBJECTS);
        //-------- ----------
        // HUM OBJECTS
        //-------- ----------
        const hum = tweenMany.createMesh(SOURCE_OBJECTS, 'hum_1');
        //hum.material.color = new THREE.Color(0, 1, 1);
        //hum.scale.set(0.42, 0.42, 0.42);
        hum.position.set(-1.0 ,0,-2.5)
        scene.add(hum);
        //-------- ----------
        // COUNT DOWN OBJECTS
        //-------- ----------
        // count secs count down object
        const count_sec = countDown.create({
            countID: 'sec',
            digits: 2,
            width: 1.1,
            source_objects: SOURCE_OBJECTS
        });
        //count_sec.scale.set(1.25, 1.25, 1.25);
        count_sec.position.copy(hum.position).add( new THREE.Vector3(3.5, 0.7, 0) );
        scene.add(count_sec);
        // count ms count down object
        const count_ms = countDown.create({
            countID: 'ms',
            digits: 3,
            width: 1.05,
            source_objects: SOURCE_OBJECTS
        });
        //count_ms.scale.set(COUNT_MS_SCALE_MAX, COUNT_MS_SCALE_MAX, COUNT_MS_SCALE_MAX);
        count_ms.position.copy(hum.position).add( new THREE.Vector3(5.77, 0.025, 0.25) );
        scene.add(count_ms);
        // adding a frame count
        const count_frames = countDown.create({
            countID: 'frames',
            digits: 4,
            width: 1.05,
            source_objects: SOURCE_OBJECTS
        });
        count_frames.scale.set(0.6, 0.6, 0.6);
        count_frames.position.copy(hum.position).add( new THREE.Vector3(4, -1.3, 0.5) );
        scene.add(count_frames);
        //-------- ----------
        // GRID OPTIONS
        //-------- ----------
        const tw = 20,
        th = 10,
        space = 3.5;
        const array_source_objects = [
            new THREE.Mesh(
                new THREE.BoxGeometry(2, 0.25, 2),
                new THREE.MeshNormalMaterial()
            ),
            new THREE.Mesh(
                new THREE.SphereGeometry(1, 30, 30),
                new THREE.MeshNormalMaterial()
            )
        ];
        const array_oi = [
            0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,
            0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,1,0,1,0,0,
            1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,0,1,1,1,
            0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,
            0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,
            0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1,0,0,
            0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,
            0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0
        ];
        //-------- ----------
        // CREATE GRID
        //-------- ----------
        const grid = ObjectGridWrap.create({
            space: space,
            tw: tw,
            th: th,
            effects: ['opacity2'],
            sourceObjects: array_source_objects,
            objectIndices: array_oi
        });
        scene.add(grid);
        grid.userData.minB = 0.95;
        grid.position.copy(hum.position).add( new THREE.Vector3(2, -3, -15) );
        //-------- ----------
        // A MAIN SEQ OBJECT
        //-------- ----------
        // start options for main seq object
        const opt_seq = {
            fps: FPS,
            beforeObjects: function(seq){
                // CAMERA
                camera.position.set(10, 10, 10);
                camera.lookAt(0, 0, 0);
                camera.zoom = 1.10 + 0.15 * seq.getSinBias(1, false);
                // HUM MESH
                const a_hum = seq.getSinBias(HUM_WING_FLAPS_PER_SEC * SECS, false);
                tweenMany.tween(hum.geometry, [
                    [ SOURCE_OBJECTS['hum_0'].geometry, SOURCE_OBJECTS['hum_1'].geometry, a_hum]
                ]);
                // hum y pos up and down over time
                const a_hum_y = seq.getSinBias(HUM_Y_BOUNCE_PER_SEC * SECS, false);
                hum.position.y = -0.25 + 0.5 * a_hum_y;
                // scale and color
                hum.scale.set(HUM_SCALE_MAX, HUM_SCALE_MAX, HUM_SCALE_MAX);
                hum.material.color = HUM_COLORS[HUM_DEFAULT_COLOR_INDEX];
                // GRID
                ObjectGridWrap.setPos(grid, seq.getPer(GRID_X_LOOPS_PER_SEC * SECS, false), 0 );
                ObjectGridWrap.update(grid);
                // COUNT SECS AND MS SCALE
                count_sec.scale.set(COUNT_SECS_SCALE_MAX, COUNT_SECS_SCALE_MAX, COUNT_SECS_SCALE_MAX);
                count_ms.scale.set(COUNT_MS_SCALE_MAX, COUNT_MS_SCALE_MAX, COUNT_MS_SCALE_MAX);
            },
            afterObjects: function(seq){
                camera.updateProjectionMatrix();
                // have the camera always look at this position
                camera.lookAt( count_sec.position.clone().add(new THREE.Vector3(-1.2 ,-0.5,0)));
                // FRAME COUNTER
                let f = seq.frame;
                if(THUM_MODE){
                    f = 0;
                };
                countDown.set(count_frames, f);
            },
            objects: []
        };
        // SEQ 0 - count down
        opt_seq.objects[0] = {
            secs: SECS_COUNT_DOWN,
            v3Paths: [
                { key: 'campos_cd', array: campos_cd, lerp: true }
            ],
            update: function(seq, partPer, partBias){
                // SECS COUNTER
                const a1 = (seq.partFrame + 1) / seq.partFrameMax;
                let secs = Math.floor(SECS_COUNT_DOWN - SECS_COUNT_DOWN * a1);
                secs = secs < 0 ? 0: secs;
                // in thum mode secs should be SECS_COUNT_DOWN
                if(THUM_MODE){ secs = SECS_COUNT_DOWN; };
                countDown.set(count_sec, secs);
                // MS COUNTER
                let a2 = (SECS_COUNT_DOWN - SECS_COUNT_DOWN * a1) % 1;
                let ms = Math.floor(1000 * a2);
                ms = ms < 0 ? 0: ms;
                if(THUM_MODE){ ms = 0; }
                countDown.set(count_ms, ms);
                // CAMERA
                seq.copyPos('campos_cd', camera);
            }
        };
        // SEQ 1 - ALARM
        opt_seq.objects[1] = {
            secs: SECS_ALARM,
            v3Paths: [
                { key: 'campos_alarm', array: campos_alarm, lerp: true }
            ],
            update: function(seq, partPer, partBias){
                // COUNT_SECS AND COUNT_MS
                let secs = 0;
                // in thum mode secs should be SECS_COUNT_DOWN
                if(THUM_MODE){ secs = SECS_COUNT_DOWN; };
                countDown.set(count_sec, secs);
                countDown.set(count_ms, 0);
                // CAMERA
                seq.copyPos('campos_alarm', camera);
                // HUM MESH
                // scale
                let a1 = seq.getSinBias(HUM_ALARM_SCALE_CHANGE_PER_SEC * SECS_ALARM, true);
                const s = HUM_SCALE_MAX - HUM_SCALE_SUB * a1;
                hum.scale.set(s, s, s);
                // color
                const a2 = seq.getPer(HUM_ALARM_COLOR_LOOPS_PER_SEC * SECS_ALARM, true);
                const ci = Math.floor( HUM_COLORS.length  * a2 );
                hum.material.color = HUM_COLORS[ci];
                // COUNT SEC SCALE
                const s2 = COUNT_SECS_SCALE_MAX - 0.25 * a1;
                count_sec.scale.set(s2, s2, s2);
                const s3 = COUNT_MS_SCALE_MAX - 0.25 * a1;
                count_ms.scale.set(s3, s3, s3);
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
