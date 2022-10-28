// video1 for 'frink2' - Continuing from 'frink1' this time adding object-grid-wrap, and working out camera angles for each seq
// 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   //'../../../js/canvas/r1/canvas.js',
   '../../../js/sphere-mutate/r2/sphere-mutate.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../../../js/object-grid-wrap/r2/effects/opacity2.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // GRID OPTIONS
    //-------- ----------
    var tw = 9,
    th = 9,
    space = 12;
    // Make box method used for object grid wrap source objects
    var mkBox = function(yd){
        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry( 5, 1 + yd, 5),
            new THREE.MeshNormalMaterial() );
        return mesh;
    };
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
    // HELPERS - helper functions from sequence hook demos
    //   ( see https://dustinpfister.github.io/2022/05/12/threejs-examples-sequence-hooks/ )
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
    // frink adjust helper
    const frinkAdjust = function(mesh, uls, uld){
        const mud = mesh.userData;
        mud.uls = uls;
        mud.uld = uld;
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
    const material_sphere = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, transparent: true, opacity:1 });
    const mesh1 = sphereMutate.create({
        size: 2, w: 40, h: 40, material: material_sphere
    });
    scene.add(mesh1);
    sphereMutate.update(mesh1, 1, updateOpt1);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
/*
    const v3Array_campos = QBV3Array([
        [8,8,8, 7,-2,-7,    2,0,0,      20],
        [7,-2,-7, -8,4,0,   0,0,0,      25],
        [-8,4,0, 8,8,8,     0,0,0,      50]
    ]);
*/
    // PATH DEBUG POINTS
    //const points_debug = new THREE.Points(
    //    new THREE.BufferGeometry().setFromPoints(v3Array_campos),
    //    new THREE.PointsMaterial({size: 0.25, color: new THREE.Color(0,1,0)})
    //);
    //scene.add(points_debug);
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
        update: function(seq, partPer, partBias){
            // frink
            frinkAdjust(mesh1, 0, 1);
        }
    };
    // SEQ 1 - 2 seconds for frink noise1, sphere gets pointy and back down
    opt_seq.objects[1] = {
        secs: 2,
        update: function(seq, partPer, partBias){
            // frink
            let a = seq.getSinBias(1, true);
            frinkAdjust(mesh1, a, 1 - a);
        }
    };
    // SEQ 2 - 7 secs, silence
    opt_seq.objects[2] = {
        secs: 7,
        update: function(seq, partPer, partBias){
            // frink
            frinkAdjust(mesh1, 0, 1);
        }
    };
    // SEQ 3 - 3 secs, frink unexspected sound
    opt_seq.objects[3] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // frink
            let a = seq.getSinBias(1, true);
            frinkAdjust(mesh1, a, 1 - a);
        }
    };
    // SEQ 4 - 8 secs, silence
    opt_seq.objects[4] = {
        secs: 8,
        update: function(seq, partPer, partBias){
            // frink
            frinkAdjust(mesh1, 0, 1);
        }
    };
    // SEQ 5 - 7 secs, frink custom 7 sec sound
    opt_seq.objects[5] = {
        secs: 7,
        update: function(seq, partPer, partBias){
            // frink
            let a = seq.getSinBias(1, true);
            frinkAdjust(mesh1, a, 1 - a);
        }
    };
/*
    opt_seq.objects[1] = {
        secs: 7,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // camera
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
        }
    };
*/
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 