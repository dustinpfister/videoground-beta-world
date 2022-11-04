VIDEO.scripts = [
  '../js/sequences-hooks/r2/sequences-hooks.js'
];
// init method for the video
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // OBJECTS
    // ---------- ----------
    scene.add( new THREE.GridHelper( 10,10 ) );
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial());
    scene.add(box);
    // ---------- ----------
    // CONTROLS
    // ---------- ----------
    const sample_alphas = [0.424515, 0.274725, 0.31055, 0.505405, 0.479755, 0.544555, 0.75354, 0.14410499999999998, 0.76496, 0.69522, 0.407955, 0.43923, 0.577925, 0.394345, 0.48138, 0.60859, 0.474185, 0.55078, 0.50121, 0.499275, 0.39415500000000003, 0.52537, 0.38104, 0.589525, 0.57545, 0.440005, 0.471935, 0.469535, 0.42057500000000003, 0.720395, 0.203915, 0, 0.712525, 0.7855449999999999, 0.25698, 0.540525, 0.797335, 0.502695, 0.662415, 0.462275, 0.550295, 0.466985, 0.539865, 0.555775, 0.51845, 0.35769, 0.36982000000000004, 0.53537, 0.51834, 0.47631, 0.36127, 0.496835, 0.37699499999999997, 0.45486, 0.58705, 0.700835, 0.56691, 0.502695, 0.56705,0.460595];
    const m = Math.max.apply(null, sample_alphas);
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(2, 2, 2);
            camera.zoom = 1;
            const a1 = seq.per;
            const sampleAlpha = sample_alphas[ Math.floor( sample_alphas.length * a1) ] / m;
            const s = 0.65 + 0.35 * sampleAlpha;
            box.scale.set(s, s, s);
            box.rotation.y = -0.25 + 0.15 * sampleAlpha;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    opt_seq.objects[0] = {
        secs: 2,
        update: function(seq, partPer, partBias){
           
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

