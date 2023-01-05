// video1-countdown for timer-hum
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
    // CONST
    // ---------- ----------
    const SECS = 30;                     // NUMBER OF SECONDS
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
    const v3Array_campos = curveMod.QBV3Array([
        [5, 2, 5, -5, 2, 4,    0, -3, 4,      100]
    ]);
    //scene.add( curveMod.debugPoints( v3Array_campos ) );
    //-------- ----------
    // USING DAE LOADER OF COUNT-DOWN.JS
    //-------- ----------
    return countDown.DAE_loader(
        [
            videoAPI.pathJoin(sm.filePath, '../../../dae/count_down_basic/cd3-nums.dae'),
            videoAPI.pathJoin(sm.filePath, '../../../dae/hum/hum_lp.dae')
        ]
    )
    .then( (SOURCE_OBJECTS) => {
        console.log('Done Loading.');
        // if I want to do something with each source objects
        Object.keys( SOURCE_OBJECTS ).forEach( ( key ) => {
            const obj = SOURCE_OBJECTS[key];
            const mat = obj.material;
            if( String( parseInt(key) )  != 'NaN'){
                obj.material.transparent = true;
                obj.material.opacity = 1;
            }
            if(mat.map){
                const tex = mat.map;
                //tex.magFilter = THREE.NearestFilter;
                //tex.minFilter = THREE.NearestFilter;
            }
        });
        //-------- ----------
        // HUM OBJECTS
        //-------- ----------
        const hum = tweenMany.createMesh(SOURCE_OBJECTS, 'hum_1');
        hum.material.color = new THREE.Color(0, 1, 1);
        hum.scale.set(0.42, 0.42, 0.42);
        hum.position.set(0,0,-2.5)
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
        count_sec.scale.set(1.25, 1.25, 1.25);
        count_sec.position.copy(hum.position).add( new THREE.Vector3(4, 0.5, 0) );
        scene.add(count_sec);
        // adding a frame count
        const count_frames = countDown.create({
            countID: 'frames',
            digits: 4,
            width: 1.4,
            source_objects: SOURCE_OBJECTS
        });
        count_frames.scale.set(0.4, 0.4, 0.4);
        count_frames.position.copy(hum.position).add( new THREE.Vector3(4, -1.3, 0) );
        scene.add(count_frames);
        //-------- ----------
        // GRID OPTIONS
        //-------- ----------
        const tw = 20,
        th = 10,
        space = 3.5;
        // source objects
        const mkBox = function(){
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(2, 0.25, 2),
                new THREE.MeshNormalMaterial() );
            return mesh;
        };
        const array_source_objects = [
            mkBox()
        ];
        const array_oi = [
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
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
        grid.position.copy(hum.position).add( new THREE.Vector3(2, -3, -18) );
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
                camera.zoom = 1.10 + 0.15 * seq.getSinBias(1, false);
                const a1 = (seq.frame + 1) / seq.frameMax;
                let secs = Math.floor(SECS - SECS * a1);
                countDown.set(count_sec, secs);
                countDown.set(count_frames, seq.frame);
                // hum tween of objects
                const a_hum = seq.getSinBias(60, false);
                tweenMany.tween(hum.geometry, [
                    [ SOURCE_OBJECTS['hum_0'].geometry, SOURCE_OBJECTS['hum_1'].geometry, a_hum]
                ]);
                // hum y pos up and down over time
                const a_hum_y = seq.getSinBias(5, false);
                hum.position.y = -0.25 + 0.5 * a_hum_y;

                ObjectGridWrap.setPos(grid, seq.getPer(4, false), 0 );
                ObjectGridWrap.update(grid);


            },
            afterObjects: function(seq){
                camera.updateProjectionMatrix();
            },
            objects: []
        };
        // SEQ 4 - EFFECT DEMO
        opt_seq.objects[0] = {
            secs: SECS,
            v3Paths: [
                { key: 'campos', array: v3Array_campos, lerp: true }
            ],
            update: function(seq, partPer, partBias){
                // CAMERA
                seq.copyPos('campos', camera);
                //camera.position.set(10, 10, 10);
                //camera.lookAt( count_sec.position.clone().add(new THREE.Vector3(0,-0.49,0)));
                camera.lookAt( count_sec.position.clone().add(new THREE.Vector3(-2 ,-0.25,0)));
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
