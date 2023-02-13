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
    const TRANS_SECS = 3;              // NUMBER OF SECONDS FOR AND OPACITY CHANGE
    const DELAY_SECS = 10;             // NUMBER OF SECONDS FOR THE DELAY
    const INTERVAL_SECS = 30;          // SECONDS PER INTERVAL
    const INTERVAL_COUNT = 3;          // COUNT OF INTERVALS
    const SECS_ALARM = 10;             // COOL DOWN TIME
    const THUM_MODE = false;           // SET VIDEO INTO THUM MODE
    const THUM_FRAMES = 100;           // number of frames when in THUM MODE
    // OTHER CONSTS THAT I MIGHT NOT NEED TO CHANGE
    const FPS = 30;                                                      // FRAMES PER SECOND
    // DAE FILES FOR NUMS AND OTHER OBJECTS
    const URL_DAE_NUMS = '../../../dae/count_down_basic/cd4-nums.dae';
    const URL_DAE_NUMS_RESOURCE = '../../../dae/count_down_basic/skins/depth_256/';
    //const URL_DAE_SCENE = '../../../dae/count_down_basic/cd3-ground.dae';
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
    // HELPERS
    //-------- ----------
    // set opacity for all mesh objects of given object3d object
    const setOpacity = (obj_root, opacity) => {
        obj_root.traverse((obj) => {
            if(obj.type === 'Mesh'){
                obj.material.transparent = true;
                obj.material.opacity = opacity === undefined ? 1 : opacity;
            }
        });
    };
    // create a mesh object that uses a torus geometry with a color attribute
    const createTimeTorus = () => {
        const geometry_torus = new THREE.TorusGeometry(2.2, 0.8, 150, 360);
        const material_torus = new THREE.MeshPhongMaterial({vertexColors: true});
        let ci = 0;
        const pos = geometry_torus.getAttribute('position');
        const data_color = [];
        while(ci < pos.count){
            data_color.push(0,0,0)
            ci += 1;
        }
        geometry_torus.setAttribute('color', new THREE.Float32BufferAttribute(data_color, 3));
        const mesh_torus = new THREE.Mesh(geometry_torus, material_torus);
        return mesh_torus;
    };
    // update the torus time mesh object
    const updateTimeTorus = (mesh, alpha, color_elapsed) => {
        alpha = alpha === undefined ? 1 : alpha;
        color_elapsed = color_elapsed === undefined ? new THREE.Color(1,1,1) : color_elapsed;
        const att_color = mesh.geometry.getAttribute('color');
        const att_pos = mesh.geometry.getAttribute('position');
        let ci = 0;
        while(ci < att_pos.count){
            const v = new THREE.Vector3( att_pos.getX(ci), att_pos.getY(ci), att_pos.getZ(ci) );
            const v2 = mesh.position;
            const a = Math.PI + Math.atan2(v.x - v2.x, v.y - v2.y);
            const deg = THREE.MathUtils.radToDeg(a);
            const color = new THREE.Color(0, 0, 0);
            if(deg >= 0 && deg < 360 * alpha){
                color.copy(color_elapsed)
            }
            att_color.setXYZ(ci, color.r, color.g, color.b);
            ci += 1;
         }
         att_color.needsUpdate = true;
    };
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
        // frame counter
        const count_frames = countDown.create({
            countID: 'frames',
            digits: 6,
            width: 1.4,
            source_objects: SOURCE_OBJECTS
        });
        count_frames.scale.set(0.5, 0.5, 0.5);
        count_frames.position.set(0, -2.0, 0);
        count_wrap.add(count_frames);
        //-------- ---------
        // TORUS MESH
        //-------- ---------
        const mesh_torus = createTimeTorus();
        mesh_torus.position.z = -2;
        scene.add(mesh_torus);
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
                // COUNT WRAP AND CHILDREN
                setOpacity(count_delay, 1);
            },
            afterObjects: function(seq){
                camera.updateProjectionMatrix();
            },
            objects: []
        };
        // SEQ 0 - count down
        opt_seq.objects.push({
            secs: DELAY_SECS,
            update: function(seq, partPer, partBias){
                // DELAY COUNTER
                count_delay.visible = true;
                const a1 = (seq.partFrame + 1) / seq.partFrameMax;
                const n = DELAY_SECS - DELAY_SECS * a1;
                let delay = Math.floor(n) % 60;
                if(THUM_MODE){
                    delay = DELAY_SECS; 
                }
                countDown.set(count_delay, delay);
                // COUNT DELAY OPACITY
                let a2 = 0;
                if(delay <= TRANS_SECS ){
                    a2 = 1 - n / TRANS_SECS;
                }
                setOpacity(count_delay, 1 - a2);
                    // update time torus mesh
                    updateTimeTorus(mesh_torus, 0);
            }
        });
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
                    const a1 = (seq.partFrame + 1) / seq.partFrameMax;
                    //const a2 = obj.data.i / INTERVAL_COUNT;
                    const a3 = (obj.data.i + a1) / INTERVAL_COUNT;
                    const total_interval_secs = INTERVAL_SECS * INTERVAL_COUNT;
                    const n = total_interval_secs - total_interval_secs * a3;
                    count_interval.visible = true;
                    count_interval_max.visible = true;
                    mesh_forward_slash.visible = true;
                    if(THUM_MODE){
                        curent_interval = 1;
                    }
                    countDown.set( count_interval, curent_interval);
                    countDown.set( count_interval_max, INTERVAL_COUNT);
                    // COUNT INTERVAL OPACITY
                    let a4 = 0;
                    if(n <= TRANS_SECS ){
                        a4 = 1 - n / TRANS_SECS;
                    }
                    setOpacity(count_interval, 1 - a4);
                    setOpacity(count_interval_max, 1 - a4);
                    setOpacity(mesh_forward_slash, 1 - a4);
                    // update time torus mesh
                    updateTimeTorus(mesh_torus, a1);
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
                    // update time torus mesh
                    updateTimeTorus(mesh_torus, 0);
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
            console.log( INTERVAL_COUNT + ' Interval Count HIIT Timer Video');
            console.log( 'Where each interval is: ' + INTERVAL_SECS + ' secs');
            console.log( DELAY_SECS + ' Sec DELAY to start');
            console.log( 'FRAMES: ' + sm.frameMax);
        }
        return '';
    });
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
