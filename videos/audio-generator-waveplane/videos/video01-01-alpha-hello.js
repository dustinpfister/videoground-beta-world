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
    sm.frameMax = 30 * 10;
    sud.total_secs = sm.frameMax / 30;
    sud.sample_rate = 44100;
    sud.samples_per_frame = sud.sample_rate / 30;
};
//-------- ----------
// UPDATE
//-------- ----------

    const array_freq = [
        1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 
       11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
       21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
       31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
       41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
       51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
       61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
       71, 72, 73, 74, 75, 76, 77, 78, 79, 80
    ];

VIDEO.update = function(sm, scene, camera, per, bias){
    const sud = scene.userData;
    const wp = sud.wp;



    const a1 = per;
    const i_freq = Math.floor( array_freq.length * a1 );
    WP.apply_wave(wp, 0,   2 * array_freq[ i_freq ], 1.0);
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

