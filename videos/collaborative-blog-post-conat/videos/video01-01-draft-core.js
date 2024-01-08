// video01-01-draft-core from collaborative-blog-post-conat
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../js/lines-sphere-circles-r1.js',
   '../js/video-codes-r0.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
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
            secs: 30,
            update: function(seq, partPer, partBias){
                // current video codes state object
                const state = sud.state = vc.states[video_name];
                // update current state
                state.update(sm, state.scene, camera, partPer, partBias);
                // set alpha effect
                sud.alpha = 1;
                if(partPer < 0.15){
                    sud.alpha = partPer / 0.15;
                }
                if(partPer > 0.85){
                    sud.alpha = 1 - ( partPer - 0.85 ) / 0.15;
                }
                sud.alpha = sud.alpha < 0 ? 0 : sud.alpha;
                sud.alpha = sud.alpha > 1 ? 1 : sud.alpha;
                // camera
                camera.position.set(8, 8, 8);
                camera.lookAt(0,0,0);
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
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sud = scene.userData;
    const sound = sud.sound;

    // background
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // draw the current video scene object
    renderer.render(sud.state.scene, camera);

    ctx.globalAlpha = sud.alpha;
    ctx.drawImage(renderer.domElement, 0, 0);


    //sud.state.scene.visible = false;

};
 