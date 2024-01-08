// video01-02-draft-edits from collaborative-blog-post-conat
// * use r1 of video-codes.js that will have some changes
// * see about adding opacity2 effect
// * fixed main camera pos at 10, 10, 10
// * grid for main scene object, and draw main scene object below the other
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [

   '../../../js/threejs/r146/line2/LineSegmentsGeometry.js',
   '../../../js/threejs/r146/line2/LineGeometry.js',
   '../../../js/threejs/r146/line2/LineMaterial.js',
   '../../../js/threejs/r146/line2/LineSegments2.js',
   '../../../js/threejs/r146/line2/Line2.js',

   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../../../js/object-grid-wrap/r2/effects/opacity2.js',
   '../js/lines-sphere-circles-r1.js',
   '../js/video-codes-r1.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    sm.renderer.setClearAlpha(0);
    sm.renderer.setClearColor(null, 0);
    //-------- ----------
    // CAMERA 2
    //-------- ----------
    const camera2 = sud.camera2 = new THREE.PerspectiveCamera(60, 16 / 9);
    camera2.position.set(-10, 5, 10);
    camera2.lookAt(0,0,0);
    //-------- ----------
    // VIDEO STATES
    //-------- ----------
    Object.keys(vc.states).forEach( (video_name) => {
        console.log('setting up: ' + video_name);
        const state = vc.states[video_name];
        state.init(sm, state.scene);
        state.scene.visible = true;
        //scene.add(state.scene);
    });
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#8a8a8a', '#ffffff');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
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
    // SEQ OBJECTS FOR EACH VIDEO
    Object.keys(vc.states).forEach( (video_name) => {
        opt_seq.objects.push({
            secs: 5,
            update: function(seq, partPer, partBias){
                // current video codes state object
                const state = sud.state = vc.states[video_name];
                // update current state
                state.update(sm, state.scene, camera, partPer, partBias);
                // ALPHA EFFECT
                sud.alpha = 1;
                if(partPer < 0.15){
                    sud.alpha = partPer / 0.15;
                }
                if(partPer > 0.85){
                    sud.alpha = 1 - ( partPer - 0.85 ) / 0.15;
                }
                sud.alpha = sud.alpha < 0 ? 0 : sud.alpha;
                sud.alpha = sud.alpha > 1 ? 1 : sud.alpha;
                // MAIN CAMERA POS
                camera.position.set(10, 10, 10);
                camera.lookAt(0,-1,0);
            }
        });
    });
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sud = scene.userData;

    seqHooks.setFrame(sud.seq, sm.frame, sm.frameMax);

    const e = new THREE.Euler();
    e.y = Math.PI * 2 * 10 * per;

    sud.camera2.position.set(0, 1, 1).applyEuler(e).multiplyScalar(7);
    sud.camera2.lookAt(0,0,0);

};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sud = scene.userData;

    // background
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // draw the main scene object with main camera
    renderer.render(scene, camera);
    ctx.drawImage(renderer.domElement, 0, 0);

    // draw the current video scene object with main camera
    renderer.render(sud.state.scene, camera);
    ctx.globalAlpha = sud.alpha;
    ctx.drawImage(renderer.domElement, 0, 0);


    const x = 900, y = 500, w = 320, h = 180;

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    renderer.render(scene, sud.camera2);
    ctx.drawImage(renderer.domElement, x, y, w, h);

    renderer.render(sud.state.scene, sud.camera2);
    ctx.drawImage(renderer.domElement, x, y, w, h);


};
 