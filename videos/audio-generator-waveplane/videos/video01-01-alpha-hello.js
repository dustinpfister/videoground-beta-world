/*    video01-01-alpha-hello - for audio-generator-waveplane project
          * Just Getting the core idea of what I want working
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../js/samp-writer.js',
  '../js/wave-plane.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);

    const wp = sud.wp = WP.create_wp({
        samp_points: 1024
    });
    scene.add(wp.mesh);

    //const sampdata_tracks = gen_sampdata_tracks(wp, 100);
    //console.log(sampdata_tracks);

    // start state for camera
    camera.position.set( 10, 8, 10);
    camera.lookAt(0,-2.0,0);
    // work out number of frames
    sm.frameMax = 30 * 5;
    sud.total_secs = sm.frameMax / 30;
    sud.sample_rate = 44100;
    sud.samples_per_frame = sud.sample_rate / 30;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sud = scene.userData;
    const wp = sud.wp;

    const array_freq = [2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256];


    const i_freq = Math.floor(array_freq.length * per);
    WP.apply_wave(wp, 0,   array_freq[ i_freq ], 1.0);
    WP.apply_wave(wp, 1,   8, 1.0);

    const mix_amp = 1.0;

    const sampdata_tracks = WP.gen_sampdata_tracks(wp, sud.samples_per_frame, true, mix_amp);
    return SW.write_frame_samples(sampdata_tracks.mixed, sm.frame, sm.filePath, sud.total_secs, sud.sample_rate );
};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sud = scene.userData;
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    // render threejs scene object
    sm.renderer.render(sm.scene, sm.camera);
    ctx.drawImage(sm.renderer.domElement, 0, 0, canvas.width, canvas.height);
};

