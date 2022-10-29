// video1 for 'frink3' - Adding canvas R1 for textures, using phong material, light, new get alpha helper
// 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/sphere-mutate/r2/sphere-mutate.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../../../js/object-grid-wrap/r2/effects/opacity2.js',
   '../../../js/canvas/r1/canvas.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // CANVAS, TEXTURES
    //-------- ----------
    const cObj_frink_map = canvasMod.create({
        size: 64,
        palette: ['#cf0000','#00cf00','#0000cf','#00cfcf','#cf00cf','#cfcf00'],
        update_mode: 'dual',
        state: { gSize: 30 },
        draw : 'rnd'});
    const cObj_frink_emissive = canvasMod.create({
        size: 64,
        palette: ['#000000', '#0f0f0f', '#111111', '#1f1f1f', '#222222'],
        update_mode: 'dual',
        state: { gSize: 30 },
        draw : 'rnd'});
    // textures
    texture_frink_map = cObj_frink_map.texture_data;
    texture_frink_emissive = cObj_frink_emissive.texture_data;
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set( 1, 1, 0 );
    scene.add(dl);

    //-------- ----------
    // HELPERS
    //-------- ----------
    // just a short hand for THREE.QuadraticBezierCurve3
    const QBC3 = function(x1, y1, z1, x2, y2, z2, x3, y3, z3){
        let vs = x1;
        let ve = y1;
        let vc = z1;
        if(arguments.length === 9){
            vs = new THREE.Vector3(x1, y1, z1);
            ve = new THREE.Vector3(x2, y2, z2);
            vc = new THREE.Vector3(x3, y3, z3);
        }
        return new THREE.QuadraticBezierCurve3( vs, vc, ve );
    };
    // QBDelta helper using QBC3
    // this works by giving deltas from the point that is half way between
    // the two start and end points rather than a direct control point for x3, y3, and x3
    const QBDelta = function(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        const vs = new THREE.Vector3(x1, y1, z1);
        const ve = new THREE.Vector3(x2, y2, z2);
        // deltas
        const vDelta = new THREE.Vector3(x3, y3, z3);
        const vc = vs.clone().lerp(ve, 0.5).add(vDelta);
        const curve = QBC3(vs, ve, vc);
        return curve;
    };
    // QBV3Array
    const QBV3Array = function(data) {
        const v3Array = [];
        data.forEach( ( a ) => {
            const curve = QBDelta.apply(null, a.slice(0, a.length - 1))
            v3Array.push( curve.getPoints( a[9]) );
        })
        return v3Array.flat();
    };
    // Glaven Points are random points used for camera pos
    const GlavinPoints = (count, origin, mvul ) => {
        count = count === undefined ? 50 : count;
        origin = origin === undefined ? new THREE.Vector3() : origin;
        mvul = mvul === undefined ? 5 : mvul;
        const v3Array = [];
        let i  = 0;
        while(i < count){
            // random euler
            const e = new THREE.Euler();
            e.x = Math.PI * 2 * THREE.MathUtils.seededRandom();
            e.y = Math.PI * 2 * THREE.MathUtils.seededRandom();
            e.z = Math.PI * 2 * THREE.MathUtils.seededRandom();
            // random unit length
            const ul = mvul * THREE.MathUtils.seededRandom();
            // v3 is a random dir and unit length from origin
            const v = origin.clone().add( new THREE.Vector3( 0, 0, 1).applyEuler(e).multiplyScalar(ul) )
            v3Array.push(v);
            i += 1;
        }
        return v3Array;
    };
    // frink adjust helper
    const frinkAdjust = function(mesh, uls, uld){
        const mud = mesh.userData;
        mud.uls = uls;
        mud.uld = uld;
    };
    // Make box method used for object grid wrap source objects
    var mkBox = function(yd){
        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry( 5, 1 + yd, 5),
            new THREE.MeshNormalMaterial() );
        return mesh;
    };
    //-------- ----------
    //  SPHERE MUTATE MESH OBJECTS, UPDATE OPTIONS
    //-------- ----------
    const updateOpt1 = {
        forPoint : function(vs, i, x, y, mesh, alpha){
            const mud = mesh.userData;
            const state = mud.state = mud.state === undefined ? [] : mud.state;
            const size = mesh.geometry.parameters.radius;
            const muld = mud.muld === undefined ? 2 : mud.muld;
            const uls = mud.uls === undefined ? 1 : mud.uls; // Unit Length Speed
            const uld = mud.uld === undefined ? 0 : mud.uld; // Unit Length Damp
            if(!state[i]){
                state[i] = {
                    v: vs.clone().normalize().multiplyScalar(size + muld * Math.random()),
                    count: 16 + Math.floor( Math.random() * 32 ),
                    offset: Math.random()
                };
            }
            const alpha2 = (state[i].offset + (state[i].count) * alpha) % 1;
            const alpha3 = 1 - Math.abs(0.5 - alpha2) / 0.5  * uls;
            return vs.lerp(state[i].v, alpha3 * ( 1- uld) );
        }
    };
    const material_sphere = new THREE.MeshPhongMaterial({
        color: new THREE.Color(1, 1, 1),
        map: texture_frink_map,
        emissive: new THREE.Color(1, 1, 1),
        emissiveMap: texture_frink_emissive,
        emissiveIntensity: 0.75
    //    side: THREE.DoubleSide, transparent: true, opacity:1
    });
    const mesh1 = sphereMutate.create({
        size: 2, w: 40, h: 40, material: material_sphere
    });
    scene.add(mesh1);
    sphereMutate.update(mesh1, 1, updateOpt1);
    //-------- ----------
    // GRID OPTIONS
    //-------- ----------
    var tw = 9,
    th = 9,
    space = 12;
    var array_source_objects = [
        mkBox(0),
        mkBox(1),
        mkBox(2),
        mkBox(3)
    ];
    var array_oi = [
        0,0,0,0,0,3,3,0,0,
        0,0,0,0,3,2,3,0,0,
        0,0,0,3,2,3,3,0,0,
        0,0,3,2,2,2,3,0,0,
        0,3,2,2,1,2,3,0,0,
        3,2,3,2,2,2,2,3,0,
        0,3,0,3,3,3,2,3,0,
        0,0,0,0,0,0,3,3,0,
        0,0,0,0,0,0,0,0,0
    ];
    //-------- ----------
    // CREATE GRID
    //-------- ----------
    var grid = ObjectGridWrap.create({
        spaceW: space,
        spaceH: space,
        tw: tw,
        th: th,
        dAdjust: 1.25,
        effects: ['opacity2'],
        sourceObjects: array_source_objects,
        objectIndices: array_oi
    });
    scene.add(grid);
    grid.position.y = -5;
    //-------- ----------
    // CAMERA PATHS
    //-------- ----------
    const v3Array_campos = [ 
        // seq 0
        QBV3Array([
            [-8,6,0, 0,6,12,    0,0,10,      60],
            [0,6,12, 0,5,10,    0,0,0,      30]
        ]),
        // seq 1
        GlavinPoints(15, new THREE.Vector3(0,5,10), 2),
        // seq 2
        QBV3Array([
            [0,5,10, 10,0,0,    6,2,9,      210]
        ]),
        // seq 3
        GlavinPoints(23, new THREE.Vector3(10,0,0), 2),
        // seq 4
        QBV3Array([
            [10,0,0, 0,0,-7,    6,0,-6,      120]
        ]),
        // seq 5
        GlavinPoints(53, new THREE.Vector3(0,0,-7), 2)
    ];
    // PATH DEBUG POINTS
    //const points_debug = new THREE.Points(
    //    new THREE.BufferGeometry().setFromPoints(v3Array_campos.flat()),
    //    new THREE.PointsMaterial({size: 0.25, color: new THREE.Color(0,1,0)})
    //);
    //scene.add(points_debug);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            // set position of the grid
            ObjectGridWrap.setPos(grid, 0, seq.per );
            // update grid by current alphas and effects
            ObjectGridWrap.update(grid);
            camera.position.set(0, 5, 10);
            camera.lookAt(0, 0, 0);
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            sphereMutate.update(mesh1, seq.per, updateOpt1);
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - three seconds of silence, frink mesh is a sphere
    opt_seq.objects[0] = {
        secs: 3,
        v3Paths: [
            { key: 'campos', array: v3Array_campos[0], lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // FRINK
            frinkAdjust(mesh1, 0.4, 0.8);
            // CAMERA
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
            //!!! DEBUG CAM POS
            //camera.position.set(15, 15, 15);
            //camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - 2 seconds for frink noise1, sphere gets pointy and back down
    opt_seq.objects[1] = {
        secs: 2,
        v3Paths: [
            { key: 'campos', array: v3Array_campos[1], lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // FRINK
            let a = seq.getSinBias(1, true);
            frinkAdjust(mesh1, a, 1 - a);
            // CAMERA
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 2 - 7 secs, silence
    opt_seq.objects[2] = {
        secs: 7,
        v3Paths: [
            { key: 'campos', array: v3Array_campos[2], lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // frink
            frinkAdjust(mesh1, 0.4, 0.8);
            // CAMERA
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 3 - 3 secs, frink unexspected sound
    opt_seq.objects[3] = {
        secs: 3,
        v3Paths: [
            { key: 'campos', array: v3Array_campos[3], lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // frink
            let a = seq.getSinBias(1, true);
            frinkAdjust(mesh1, a, 1 - a);
            // CAMERA
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 4 - 8 secs, silence
    opt_seq.objects[4] = {
        secs: 8,
        v3Paths: [
            { key: 'campos', array: v3Array_campos[4], lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // frink
            frinkAdjust(mesh1, 0.4, 0.8);
            // CAMERA
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 5 - 7 secs, frink custom 7 sec sound
    opt_seq.objects[5] = {
        secs: 7,
        v3Paths: [
            { key: 'campos', array: v3Array_campos[5], lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // frink
            let a = seq.getSinBias(1, true);
            frinkAdjust(mesh1, a, 1 - a);
            // CAMERA
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
        }
    };
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 