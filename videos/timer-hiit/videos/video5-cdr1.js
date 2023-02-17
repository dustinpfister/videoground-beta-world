// video5-dcr1.js for timer-hiit
//      * using count-down.js r1
// scripts
VIDEO.scripts = [
   // CORE MODULES
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   //'../../../js/curve/r1/curve.js',    // worked out my own helpers for curves
   '../../../js/count-down/r1/count-down.js',
   '../../../js/dae-helper/r0/dae-helper.js',
   '../../../js/waves/r1/waves.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // SETTINGS AND COST VALUES
    // ---------- ----------
    // HIIT SETTINGS
    // 3 Intervals, 30 seconds each, with a 1:2 ratio - timer hiit
    const INTERVAL_COUNT = 3;                        // COUNT OF INTERVALS
    const INTERVAL_SECS = 30;                        // SECONDS PER INTERVAL (HIGH AND LOW TIME)
    const INTERVAL_RATIO = new THREE.Vector2(1, 2);  // RATIO OF TIME FOR HIGH TO LOW
    const INTERVAL_HIGH_START = true;               // START WITH HIGH OR LOW EXERCISE FOR EACH INTERVAL
    const WARMUP_SECS = 30;                          // NUMBER OF SECONDS FOR A WARM UP PART
    const SECS_COOLDOWN = 20;                        // COOL DOWN TIME
    const DELAY_SECS = 10;                           // NUMBER OF SECONDS FOR THE DELAY
    // other settings
    const THUM_MODE = false;                         // SET VIDEO INTO THUM MODE
    const THUM_FRAMES = 100;                         // number of frames when in THUM MODE
    const TRANS_SECS = 5;                            // NUMBER OF SECONDS FOR AND OPACITY CHANGE
    const CAMERA_LOOPS_MIN = 1;
    const CAMERA_LOOPS_MAX = 2;
    const WAVE_LOOPS_MIN = 4;
    const WAVE_LOOPS_MAX = 10;
    // OTHER CONSTS THAT I MIGHT NOT NEED TO CHANGE
    const FPS = 30;                                                      // FRAMES PER SECOND
    // DAE FILES FOR NUMS AND OTHER OBJECTS
    const URL_DAE_NUMS = '../../../dae/count_down_basic/cd4-nums.dae';
    const URL_DAE_NUMS_RESOURCE = '../../../dae/count_down_basic/skins/depth_256/';
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
        const geometry_torus = new THREE.TorusGeometry(2.2, 0.8, 40, 400);
        const material_torus = new THREE.MeshPhongMaterial({vertexColors: true});
        let ci = 0;
        const pos = geometry_torus.getAttribute('position');
        const data_color = [];
        while(ci < pos.count){
            data_color.push(0,0,0);
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
    // abstraction for THREE.CubicBezierCurve3
    const CBC3D = (sx, sy, sz, ex, ey, ez, cx1, cy1, cz1, cx2, cy2, cz2) => {
        const v_start = new THREE.Vector3(sx, sy, sz);
        const v_end = new THREE.Vector3(ex, ey, ez);
        return new THREE.CubicBezierCurve3(
            v_start,
            v_start.clone().lerp(v_end, 0.25).add(new THREE.Vector3(cx1, cy1, cz1)),
            v_start.clone().lerp(v_end, 0.75).add(new THREE.Vector3(cx1, cy1, cz1)),
            v_end
        );
    };
    // set the camera position based on current interval
    const intervalCameraPos = (cam, i_interval, i_intensity, a1) => {
        const current_interval = i_interval + 1;
        const curve = new THREE.CurvePath();
        const a2 = 1 - Math.abs(0.5 - a1) / 0.5;
        const m = ( (i_intensity + 1) % 2 === 0 ? -1 : 1 );
        const x = 4.0 * m;
        const dx1 = 0.0 * m;
        const dx2 = 2.0 * m;
        curve.add( CBC3D( 0.0, 2.0, 8.0,      x, 2.0, 8.0,     dx1, 4.0, 0.0,    dx2, 4.0, 0.0) );
        curve.add( CBC3D(   x, 2.0, 8.0,    0.0, 2.0, 8.0,     dx1,-4.0, 0.0,    dx2,-4.0, 0.0) );
        const a3 = (current_interval - 1) / ( INTERVAL_COUNT - 1);
        const loop_count = CAMERA_LOOPS_MIN + Math.floor( (CAMERA_LOOPS_MAX - CAMERA_LOOPS_MIN) * a3) ;
        const a4 = a1 * loop_count % 1;
        cam.position.copy( curve.getPoint(a4) );
        cam.zoom = 1.1 - 0.1 * a2;
        //cam.lookAt(0, 0.5 + 0.5 * a2, 0);
    };
    const getWaveRangeAlpha = (a1, a2) => {
        const d = WAVE_LOOPS_MIN + ( (WAVE_LOOPS_MAX - WAVE_LOOPS_MIN) * a1);
        return a2 * d % 1;
    };
    const getWaveAlpha = (a1) => {
        return a1 * WAVE_LOOPS_MIN % 1;
    };
    const getWaveCoolDownAlpha = (a1) => {
        const d = WAVE_LOOPS_MIN + WAVE_LOOPS_MAX - WAVE_LOOPS_MAX * (a1 * 0.5); 
        return a1 * d  % 1;
    };
    //-------- ----------
    // TEXTURES
    //-------- ----------
    const canObj_bg = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#000000', '#1f1f1f', '#00ffff'],
        dataParse: 'lzstring64',
        state: { w: 8, h: 5, data: 'AwGlEYyzNCVgpcmPit1mqvTsg===' }
    });
    // can use LZString to compress and decompress
    //console.log( LZString.decompressFromBase64('AwGlEYyzNCVgpcmPit1mqvTsg===') );
    const canObj_waves = canvasMod.create({
        size: 512,
        draw: 'rnd',
        palette: ['#ffffff', '#aaaaaa', '#888888'],
        state: { gSize: 64 }
    });
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    const texture = canObj_bg.texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32, 24);
    scene.background = texture;
    //-------- ----------
    // USING DAE LOADER OF COUNT-DOWN.JS
    //-------- ----------
    return DAE_loader({
        urls_dae: [
            videoAPI.pathJoin(sm.filePath, URL_DAE_NUMS)
        ],
        urls_resource: [
            videoAPI.pathJoin(sm.filePath, URL_DAE_NUMS_RESOURCE)
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
            digitCount: 2,
            width: 1,
            scene_source: scene_source
        });
        count_delay.position.set(0, 0, 0);
        count_wrap.add(count_delay);
        // interval count
        const count_interval = countDown.create({
            countID: 'interval',
            digitCount: 2,
            width: 1,
            scene_source: scene_source
        });
        count_interval.position.set(-1.75, 0, 0);
        count_wrap.add(count_interval);
        // interval max count
        const count_interval_max = countDown.create({
            countID: 'interval_max',
            digitCount: 2,
            width: 1,
            scene_source: scene_source
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
            digitCount: 6,
            width: 1.4,
            scene_source: scene_source
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
        //-------- ---------
        // WAVE MESH
        //-------- ---------
        const opt_waves = {
            waveHeight: 1.75,
            width: 100, height: 100,
            widthSegs: 30,heightSegs: 30,
            degree: 45, alpha: 0
        };
        const geo_waves = waveMod.create(opt_waves);
        const material_waves = new THREE.MeshPhongMaterial({
            transparent: true, 
            opacity: 0.75,
            map: canObj_waves.texture
            // IF I WANT ONE SIDE OF A WAVE TO RENDER AND ANOTHEER NOT TO, 
            // THAT MIGHT BE A CLIPING ISSHUE RATHER THAN BLEDNING
            //blending: THREE.CustomBlending,
            //blendSrc: THREE.SrcAlphaSaturateFactor
        });
        const mesh_waves = new THREE.Mesh(geo_waves, material_waves);
        mesh_waves.position.y = -5;
        scene.add(mesh_waves);
        //-------- ----------
        // MAIN SEQ OBJECT START
        //-------- ----------
        const opt_seq = {
            fps: FPS,
            beforeObjects: function(seq){
                // CAMERA DEFAULTS
                camera.position.set(0, 2, 8);
                camera.lookAt(0, 0.5, 0);
                camera.zoom = 1.10;
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
        //-------- ----------
        // SEQ 0 - count down
        //-------- ----------
        opt_seq.objects.push({
            secs: DELAY_SECS,
            update: function(seq, partPer, partBias, partSinBias, obj){
                const color_elapsed = new THREE.Color(1,1,1);
                // DELAY COUNTER
                count_delay.visible = true;
                const a1 = (seq.partFrame + 1) / seq.partFrameMax;
                const n = DELAY_SECS - DELAY_SECS * a1;
                let delay = Math.floor(n) % 60;
                if(THUM_MODE){ // if in thum mode
                    delay = DELAY_SECS;
                    updateTimeTorus(mesh_torus, 1, color_elapsed );
                    setOpacity(count_delay, 1);
                }else{   // if not in thum mode
                    let a2 = 0;  // COUNT DELAY OPACITY
                    if(delay <= TRANS_SECS ){
                        a2 = 1 - n / TRANS_SECS;
                    }
                    updateTimeTorus(mesh_torus, a1, color_elapsed );
                    setOpacity(count_delay, 1 - a2);
                }
                // always
                countDown.set(count_delay, delay);
                opt_waves.alpha = getWaveAlpha(partPer);
                waveMod.update(geo_waves, opt_waves);
                mesh_waves.material.color = color_elapsed;
                // camera
                const v1 = new THREE.Vector3(8,8,8);
                const v2 = new THREE.Vector3(0, 2, 8);
                camera.position.copy(v1).lerp(v2, a1);
                const v3 = new THREE.Vector3(0,1,5);
                const v4 = mesh_torus.position.clone();
                camera.lookAt( v3.lerp(v4, a1) );
            }
        });
        //-------- ----------
        // SEQ 1 - WARM UP
        //-------- ----------
        opt_seq.objects.push({
            secs: WARMUP_SECS,
            update: function(seq, partPer, partBias, partSinBias, obj){
                const color_elapsed = new THREE.Color( 1, 1, 1);
                color_elapsed.r = 1 - partPer;
                color_elapsed.g = 1 - partPer;
                color_elapsed.b = 1;
                if(INTERVAL_HIGH_START){
                    color_elapsed.r = 1;
                    color_elapsed.g = 1 - partPer;
                    color_elapsed.b = 1 - partPer;
                }
                // DELAY COUNTER
                count_delay.visible = true;
                const a1 = (seq.partFrame + 1) / seq.partFrameMax;
                const n = WARMUP_SECS - WARMUP_SECS * a1;
                let delay = Math.floor(n) % 60;
                if(THUM_MODE){ // if in thum mode
                    delay = WARMUP_SECS;
                    updateTimeTorus(mesh_torus, 1, color_elapsed );
                    setOpacity(count_delay, 1);
                }else{   // if not in thum mode
                    let a2 = 0;  // COUNT DELAY OPACITY
                    if(delay <= TRANS_SECS ){
                        a2 = 1 - n / TRANS_SECS;
                    }
                    updateTimeTorus(mesh_torus, a1, color_elapsed );
                    setOpacity(count_delay, 1 - a2);
                }
                // always
                countDown.set(count_delay, delay);
                opt_waves.alpha = getWaveAlpha(partPer);
                waveMod.update(geo_waves, opt_waves);
                mesh_waves.material.color = color_elapsed;
                // camera
                camera.position.set(0, 2, 8);
                camera.lookAt( mesh_torus.position);
            }
        });
        //-------- ----------
        // SEQ 2 - X Intervals
        //-------- ----------
        let i2 = 0;
        while( i2 < INTERVAL_COUNT ){
            const rx = INTERVAL_RATIO['x'];
            const ry = INTERVAL_RATIO['y'];
            const total_interval_secs = INTERVAL_SECS * INTERVAL_COUNT;
            let i_intensity = 0;
            while(i_intensity < 2){ 
                let high_intensity = i_intensity % 2 === 0;
                if(!INTERVAL_HIGH_START){
                    high_intensity = !high_intensity;
                }
                const r = high_intensity ? rx : ry;
                const interval_part_secs = INTERVAL_SECS / (rx + ry) * r;
                // DEBUG
                console.log(i2, i_intensity, high_intensity ? 'high': 'low', interval_part_secs)
                // push the seq object
                opt_seq.objects.push({
                    secs: interval_part_secs,
                    data: {
                        i: i2,
                        i_intensity: i_intensity,
                        high: high_intensity
                    },
                    update: function(seq, partPer, partBias, partSinBias, obj){
                        let current_interval = 1 + obj.data.i;
                        let a1 = (seq.partFrame + 1) / seq.partFrameMax;
                        count_interval.visible = true;
                        count_interval_max.visible = true;
                        mesh_forward_slash.visible = true;
                        // elapse color for time torus mesh
                        const color_elapsed = new THREE.Color(0, 1, 1);
                        if(obj.data.high){
                            color_elapsed.setRGB(1, 0, 0)
                        }
                        countDown.set( count_interval_max, INTERVAL_COUNT);
                        if(THUM_MODE){
                            current_interval = INTERVAL_COUNT;
                            setOpacity(count_interval, 1);
                            setOpacity(count_interval_max, 1);
                            setOpacity(mesh_forward_slash, 1);
                            updateTimeTorus(mesh_torus, 1, color_elapsed);
                        }else{
                            // transition effect
                            let a4 = 0;
                            if(obj.data.i + obj.data.i_intensity === INTERVAL_COUNT){
                                const a3 = (obj.data.i + a1) / INTERVAL_COUNT;
                                const n = total_interval_secs - total_interval_secs * a3;
                                if(n <= TRANS_SECS ){
                                    a4 = 1 - n / TRANS_SECS;
                                }
                            }
                            setOpacity(count_interval, 1 - a4);
                            setOpacity(count_interval_max, 1 - a4);
                            setOpacity(mesh_forward_slash, 1 - a4);
                            // update the time torus
                            updateTimeTorus(mesh_torus, a1, color_elapsed);
                        }
                        countDown.set( count_interval, current_interval);
                        let a7 = 0;
                        if(obj.data.high){
                            a7 = 1;
                            a7 = 0.5 + 0.5 * seq.getSinBias(1) * (partPer * 0.5);
                        }else{
                            a7 = 0;
                        }
                        mesh_waves.material.color = color_elapsed;
                        opt_waves.alpha = getWaveRangeAlpha(a7, partPer);
                        waveMod.update(geo_waves, opt_waves);
                        // camera
                        intervalCameraPos(camera, obj.data.i, obj.data.i_intensity, partPer);
                        camera.lookAt(mesh_torus.position);
                    }
                });
                i_intensity += 1;
            }
            i2 += 1;
        }
        //-------- ----------
        // SEQ X - COOL DOWN
        //-------- ----------
        opt_seq.objects.push({
            secs: SECS_COOLDOWN,
            update: function(seq, partPer, partBias){
                count_delay.visible = true;
                const a1 = (seq.partFrame + 1) / seq.partFrameMax;
                const n = SECS_COOLDOWN * a1;
                let delay = Math.floor(n) % 60;
                const color_elapsed = new THREE.Color(1 - 1 * a1, 0, 1);
                if(THUM_MODE){
                    delay = SECS_COOLDOWN;
                    updateTimeTorus(mesh_torus, 1, color_elapsed);
                }else{
                    updateTimeTorus(mesh_torus, a1, color_elapsed);
                }
                // always
                countDown.set(count_delay, delay);
                opt_waves.alpha = getWaveCoolDownAlpha(partPer, 1 - partPer);
                waveMod.update(geo_waves, opt_waves);
                mesh_waves.material.color = color_elapsed;
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
