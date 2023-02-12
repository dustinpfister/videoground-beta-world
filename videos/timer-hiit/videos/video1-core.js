// video3-daehelper.js for template7-timer-min-sec-ms
// * using daehelper in place of what is built into count-down.js
// scripts
VIDEO.scripts = [
   // CORE MODULES
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/count-down/r0/count-down.js',
   '../../../js/dae-helper/r0/dae-helper.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // SETTINGS AND COST VALUES
    // ---------- ----------
    // just set the desired SECS count for the count down
    // as the main thing to make one video from the next
    const SECS_COUNT_DOWN = 10;                                         // NUMBER OF SECONDS FOR THE COUNTDOWN
    const INTERVAL_SECS = 5;
    const INTERVAL_COUNT = 3;
    const SECS_ALARM = 10;                                               // NUMBER OF SECONDS FOR THE ALARM
    const THUM_MODE = false;                                             // SET VIDEO INTO THUM MODE
    const THUM_FRAMES = 100;                                             // number of frames when in THUM MODE
    // OTHER SETTINGS THAT I MIGHT NOT NEED TO CHANGE FROM
    const SECS = SECS_COUNT_DOWN + SECS_ALARM;                           // NUMBER OF TOTAL SECONDS
    const FPS = 30;                                                      // FRAMES PER SECOND
    // DAE FILES FOR NUMS AND OTHER OBJECTS
    const URL_DAE_NUMS = '../../../dae/count_down_basic/cd4-nums.dae';
    //const URL_DAE_SCENE = '../../../dae/count_down_basic/cd3-ground.dae';
    const URL_DAE_NUMS_RESOURCE = '../../../dae/count_down_basic/skins/depth_256/';
    //const URL_DAE_SCENE_RESOURCE = '../../../dae/count_down_basic/';
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
    // USING DAE LOADER OF COUNT-DOWN.JS
    //-------- ----------
    return DAE_loader({
        urls_dae: [
            videoAPI.pathJoin(sm.filePath, URL_DAE_NUMS),
            //videoAPI.pathJoin(sm.filePath, URL_DAE_SCENE)
        ],
        urls_resource: [
            videoAPI.pathJoin(sm.filePath, URL_DAE_NUMS_RESOURCE),
            //videoAPI.pathJoin(sm.filePath, URL_DAE_SCENE_RESOURCE)
        ],
        cloner : (obj_source, scene_source, scene_result, result) => {
            if(obj_source.type === 'Mesh'){
                const obj = obj_source.clone()
                obj.position.set(0,0,0);
                scene_source.add(obj);
            }
        }
    })
    .then( (scene_source) => {
        console.log('DAE FILES LOADED');
        // STILL NEED TO DO THIS IF I AM USING count-down.js R0
        const SOURCE_OBJECTS = {};
        let i = 0;
        while(i < 10){
            const key = 'num_' + i;
            SOURCE_OBJECTS[i] =  scene_source.getObjectByName(key);
             i += 1;
        }
        //-------- ----------
        // TIME GROUP
        //-------- ----------
        const count_wrap = new THREE.Group();
        count_wrap.scale.set(0.75,0.75,0.75);
        count_wrap.position.y = 1.03;
        scene.add(count_wrap);
        // count delay count down object
        const count_delay = countDown.create({
            countID: 'delay',
            digits: 2,
            width: 1,
            source_objects: SOURCE_OBJECTS
        });
        count_delay.position.set(0, 0, 0);
        count_wrap.add(count_delay);
        // interval count
        const count_interval = countDown.create({
            countID: 'interval',
            digits: 2,
            width: 1,
            source_objects: SOURCE_OBJECTS
        });
        count_interval.position.set(-1.75, 0, 0);
        count_wrap.add(count_interval);
        // interval max count
        const count_interval_max = countDown.create({
            countID: 'interval_max',
            digits: 2,
            width: 1,
            source_objects: SOURCE_OBJECTS
        });
        count_interval_max.position.set(1.75, 0, 0);
        count_wrap.add(count_interval_max);
        // forward slash
        const mesh_forward_slash = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 1), new THREE.MeshPhongMaterial());
        mesh_forward_slash.rotation.z = Math.PI * 1.90;
        count_wrap.add(mesh_forward_slash);
        //-------- ----------
        // FRAME COUNT
        //-------- ----------
        const count_frames = countDown.create({
            countID: 'frames',
            digits: 6,
            width: 1.4,
            source_objects: SOURCE_OBJECTS
        });
        count_frames.scale.set(0.3, 0.3, 0.3);
        count_frames.position.set(0, -0.14, 1.15);
        scene.add(count_frames);
        //-------- ----------
        // A MAIN SEQ OBJECT
        //-------- ----------
        const opt_seq = {
            fps: FPS,
            beforeObjects: function(seq){
                // CAMERA DEFAULTS
                camera.position.set(0, 2, 8);
                camera.lookAt(0, 0.5, 0);
                camera.zoom = 1.20;
                // COUNT DELAY
                count_delay.visible = false;
                count_interval.visible = false;
                count_interval_max.visible = false;
                mesh_forward_slash.visible = false;
                // FRAME COUNTER
                let f = seq.frame;
                if(THUM_MODE){
                    f = 0;
                }
                countDown.set(count_frames, f);
            },
            afterObjects: function(seq){
                camera.updateProjectionMatrix();
            },
            objects: []
        };
        // SEQ 0 - count down
        opt_seq.objects[0] = {
            secs: SECS_COUNT_DOWN,
            update: function(seq, partPer, partBias){
                // DELAY COUNTER
                count_delay.visible = true;
                const a1 = (seq.partFrame + 1) / seq.partFrameMax;
                const n = Math.floor(SECS_COUNT_DOWN - SECS_COUNT_DOWN * a1);
                let delay = n % 60;
                if(THUM_MODE){
                    delay = SECS_COUNT_DOWN; 
                }
                countDown.set(count_delay, delay);
            }
        };
        // SEQ 1 - X Intervals
        let i2 = 0;
        while( i2 < INTERVAL_COUNT ){
            opt_seq.objects.push({
                secs: INTERVAL_SECS,
                data: {
                    i: i2
                },
                update: function(seq, partPer, partBias, partSinBias, obj){
                    let curent_interval = 1 + obj.data.i;
                    count_interval.visible = true;
                    count_interval_max.visible = true;
                    mesh_forward_slash.visible = true;
                    if(THUM_MODE){
                        curent_interval = 1;
                    }
                    countDown.set( count_interval, curent_interval);
                    countDown.set( count_interval_max, INTERVAL_COUNT);
                }
            });
            i2 += 1;
        }
        // SEQ X - ALARM
        opt_seq.objects.push({
            secs: SECS_ALARM,
            update: function(seq, partPer, partBias){
                if(THUM_MODE){
                }
            }
        });
        //-------- ----------
        // SET FRAME MAX
        //-------- ----------
        const seq = scene.userData.seq = seqHooks.create(opt_seq);
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
