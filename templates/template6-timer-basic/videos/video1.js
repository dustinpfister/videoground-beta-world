// video1 for template6-timer-basic
// scripts
VIDEO.scripts = [
   // CORE MODULES
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/curve/r0/curve.js',
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // SCENE CHILD OBJECTS
    //-------- ----------
    scene.add( new THREE.GridHelper(10, 10) );
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#000000');
    //-------- ----------
    // PATHS
    //-------- ----------
    const v3Array_campos = curveMod.QBV3Array([
        [10, 10, 10, 7, 7,-7,    0, 0, 0,      100]
    ]);
    //scene.add( curveMod.debugPoints( v3Array_campos ) );
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
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 4 - EFFECT DEMO
    opt_seq.objects[0] = {
        secs: 30,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // CAMERA
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
        }
    };
    //-------- ----------
    // SET FRAME MAX
    //-------- ----------
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;

};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
