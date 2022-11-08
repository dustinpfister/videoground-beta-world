// video1 for template4
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-uvmap-cube/r0/uvmap-cube.js',
   '../../../js/texture/r0/texture.js',
];
// init
VIDEO.init = function(sm, scene, camera){
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
    // draw cell helper
    const drawCell = (mesh, drawto, i, x, y, size) => {
        i = i === undefined ? 0: i;
        x = x === undefined ? 0: x;
        y = y === undefined ? 0: y;
        size = size === undefined ? 32: size;
        uvMapCube.drawFace(mesh, drawto, {i:i, sx: x * size, sy: y * size, sw: size, sh: size});
    };
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 0.5);
    dl.position.set(1, 2, 3);
    scene.add(dl)
    //-------- ----------
    // UVMAP CUBE
    //-------- ----------
    let mesh = null;
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    const v3Array_campos = QBV3Array([
        [8,8,8, 5,2,-5,    0,0,0,      20]
    ]);
    // PATH DEBUG POINTS
    const points_debug = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(v3Array_campos),
        new THREE.PointsMaterial({size: 0.25, color: new THREE.Color(0,1,0)})
    );
    scene.add(points_debug);
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(8, 8, 8);
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // camera
            //camera.position.set(5, 18, 14);
            camera.lookAt(0, 0, 0);
        }
     };
    // SEQ 1 - ...
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
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 20,
        update: function(seq, partPer, partBias){
            // camera
            camera.position.set(8 - 16 * partBias, 8, 8);
            camera.lookAt(0, 0, 0);
            const b2 = seq.getSinBias(1, true);
            camera.zoom = 1 + 7 * b2;
        }
    };
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;

    // load images
    return textureMod.load({
        URLS_BASE: videoAPI.pathJoin(sm.filePath, '../../../img/smile/'),
        URLS: ['smile_base_128.png']
    }).then( (textureObj) => {

        console.log(textureObj);


        // ---------- ---------- ----------
        // CREATE AND UPDATE MESH
        // ---------- ---------- ----------
        // create the mesh object
        mesh = uvMapCube.create({
            pxa: 1.42,
            images: [
                textureObj['smile_base_128'].image,
                //textureObj['smile_creepy_128'].image
            ]
        });
        mesh.scale.set(5, 5, 5);
        mesh.material.emissiveIntensity = 0.15;
        scene.add(mesh);
        drawCell(mesh, 'front', 0, 0, 0);
        drawCell(mesh, 'back', 0, 2, 0);
        drawCell(mesh, 'top', 0, 0, 1);
        drawCell(mesh, 'bottom', 0, 1, 1);
        drawCell(mesh, 'left', 0, 1, 0);
        drawCell(mesh, 'right', 0, 3, 0);


        //scene.background = textureObj['smile_base_128'];

        return Promise.resolve('list loaded')
    })

};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 