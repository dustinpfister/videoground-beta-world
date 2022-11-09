// video1 for 'frink4' - 
// 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/sphere-mutate/r2/sphere-mutate.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../../../js/object-grid-wrap/r2/effects/opacity2.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/audio-sample-alphas/r0/sample_alphas.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // Samples
    //-------- ----------
    let samples = {};

    //-------- ----------
    // CANVAS, TEXTURES
    //-------- ----------
    const rndCIndex = (gSize, palSize) => {
        const cIndex = [];
        const len = gSize * gSize;
        let i = 0;
        while(i < len){
            cIndex.push(Math.floor( palSize * Math.random() ));
            i += 1;
        }
        return cIndex;
    };

    const cObj_frink_map = canvasMod.create({
        size: 64,
        palette: [
            'red', 'green', 'blue'
        ],
        update_mode: 'dual',
        state: {
            gSize: 10,
            cIndex: rndCIndex(10, 3),
            a1: 0.01
        },
        draw : function(canObj, ctx, canvas, state){
            let i = 0;
            const gSize =  state.gSize === undefined ? 5 : state.gSize;
            const len = gSize * gSize;
            const pxSize = canObj.size / gSize;
            ctx.clearRect(0,0, canvas.width, canvas.height);
            //ctx.globalAlpha = state.a1;
            while(i < len){
                const ci = Math.floor( state.cIndex[i]);
                const x = i % gSize;
                const y = Math.floor(i / gSize);

                ctx.fillStyle = canObj.palette[ci];
                const pxs2 = pxSize * state.a1;
                const px = x * pxSize + pxSize / 2 - pxs2 / 2;
                const py = y * pxSize + pxSize / 2 - pxs2 / 2;
                ctx.fillRect(px, py, pxs2, pxs2);
                i += 1;
            }
        }
    });


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
    // get a sample alpha by a given sample index and a backCount that is
    // the max number of samples back to go to create a mean to use.
    const getByIndexMean = (result, key, csi, backCount) => {
        backCount = backCount === undefined ? 3 : backCount;
        const sampleObj = result[key];
        // current sample index
        const bsi = csi - backCount;
        // by default just use the
        let samples = [];
        // if csi is bellow backCount
        if(bsi < 0){
            samples = sampleObj.abs.slice( 0, csi + 1 );
        }
        // we have at least the back count
        if(bsi >= 0){
            samples = sampleObj.abs.slice( bsi + 1, csi + 1 );
        }
        let absNum = 0; //sampleObj.abs[ csi ];
        const sampCount = samples.length;
        if(sampCount > 0){
            const sum = samples.reduce((acc, n) => { return acc + n;  }, 0);
            absNum = sum / sampCount;
        }
        const alphaSamp = absNum / sampleObj.maxABS;
        return alphaSamp;
    };
    // get a sample alpha by a given alpha value and a backCount that is
    // the max number of samples back to go to create a mean to use.
    const getByAlphaMean = (result, key, alpha, backCount) => {
        const sampleObj = result[key];
        const csi = Math.round( ( sampleObj.abs.length - 1) * alpha);
        return getByIndexMean(result, key, csi, backCount);
    };
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
    // get head tail alpha
    const getHTAlpha = (alpha, sa1, ea1, sa2, ea2) => {
        sa1 = sa1 === undefined ? 0 : sa1;
        ea1 = ea1 === undefined ? 0.15 : ea1;
        sa2 = sa2 === undefined ? 0.85 : sa2;
        ea2 = ea2 === undefined ? 1 : ea2;
        if(alpha > sa1 && alpha < ea1){
            const a = alpha - sa1;
            return a / (ea1 - sa1);
        }
        if(alpha > sa2 && alpha < ea2){
            const a = alpha - sa2;
            return 1 - a / (ea2 - sa2);
        }
        if(alpha >= ea1 && alpha <= sa2){ return 1; }
        // default return value is 0
        return 0;
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
    const mkBox = function(yd, material){
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry( 5, 1 + yd, 5),
            material || new THREE.MeshPhongMaterial() );
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
            const muld = mud.muld === undefined ? 8 : mud.muld;
            const uls = mud.uls === undefined ? 1 : mud.uls; // Unit Length Speed
            const uld = mud.uld === undefined ? 0 : mud.uld; // Unit Length Damp
            if(!state[i]){
                state[i] = {
                    v: vs.clone().normalize().multiplyScalar(size + muld * Math.random()),
                    count: 8 + Math.floor( Math.random() * 32 ),
                    offset: Math.random()
                };
            }
            const alpha2 = (state[i].offset + (state[i].count) * alpha) % 1;
            const alpha3 = 1 - Math.abs(0.5 - alpha2) / 0.5  * uls;
            return vs.lerp(state[i].v, alpha3 * ( 1 - uld) );
        }
    };
    const material_sphere = new THREE.MeshPhongMaterial({
        color: new THREE.Color(1, 1, 1),
        map: texture_frink_map,
        emissive: new THREE.Color(1, 1, 1),
        emissiveMap: texture_frink_emissive,
        emissiveIntensity: 0.75
    });
    const mesh1 = sphereMutate.create({
        size: 3, w: 40, h: 40, material: material_sphere
    });
    scene.add(mesh1);
    sphereMutate.update(mesh1, 1, updateOpt1);
    //-------- ----------
    // GRID OPTIONS
    //-------- ----------
    var tw = 9,
    th = 9,
    space = 6;
    const m1 = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0.5, 0.5, 0.5),
        map: texture_frink_map,
        emissive: new THREE.Color(1, 1, 1),
        emissiveMap: texture_frink_emissive,
        emissiveIntensity: 1
    })
    var array_source_objects = [
        mkBox(0, m1),
        mkBox(1, m1),
        mkBox(2, m1),
        mkBox(3, m1)
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
        QBV3Array([
            [-8,6,0, 0,6,12,    0,0,10,      60],
            [0,6,12, 0,5,10,    0,0,0,      30]
        ])


/*
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
*/
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
    scene.background = new THREE.Color('#d0d0d0');
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

            const a1 = getByAlphaMean(samples, 'frink4-bass', seq.per, 7);
            const a2 = getByAlphaMean(samples, 'frink4-voice', seq.per, 7);
            const a3 = getByAlphaMean(samples, 'frink4-drums', seq.per, 7);

            //frinkAdjust(mesh1, 1, 1 - (0.25 * a1 + 0.75 * a2) );
            frinkAdjust(mesh1, 1, 1 - 1 * a2 );

grid.children.forEach((child)=>{
const y = 0.2 + 0.5 * a1 + 1.25 * a3;
child.scale.set(1, y, 1);
child.position.y += y / 2;

//child.position.set(0,0,0);

});

let a4 = 0.25 + a1 * 1.25 * 0.75;
a4 = a4 > 1 ? 1 : a4;
cObj_frink_map.state.a1 = a4
canvasMod.update(cObj_frink_map);


        },
        afterObjects: function(seq){
            sphereMutate.update(mesh1, seq.per, updateOpt1);
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - three seconds of silence, frink mesh is a sphere
    opt_seq.objects[0] = {
        secs: 30,
        v3Paths: [
            { key: 'campos', array: v3Array_campos[0], lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // FRINK
            //frinkAdjust(mesh1, 0.4, 0.8);
            // CAMERA
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
            //!!! DEBUG CAM POS
            //camera.position.set(15, 15, 15);
            //camera.lookAt(0, 0, 0);
        }
    };



    return sampleAlpha.load({
        URLS_BASE: videoAPI.pathJoin(sm.filePath, '../../../sample_data/'),
        URLS: ['frink4-drums.html', 'frink4-voice.html', 'frink4-bass.html']
    })
    .then( ( result ) => {
         console.log('we have a audio sample alphas result object!');
         // set samples to the value of the result object from this load of smaple data files
         samples = result;

    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;

         return Promise.resolve();
     });
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 