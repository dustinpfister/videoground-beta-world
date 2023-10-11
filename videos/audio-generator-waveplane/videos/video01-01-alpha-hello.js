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
        samp_points: 256,
        track_points: 2
    });
    scene.add(wp.mesh);
    // start state for camera
    camera.position.set( 9, 7, 9);
    camera.lookAt(0,-2.0,0);
    // work out number of frames
    sm.frameMax = 30 * 3;
    sud.total_secs = sm.frameMax / 30;
    sud.sample_rate = 44100;
    sud.samples_per_frame = sud.sample_rate / 30;
};
//-------- ----------
// UPDATE
//-------- ----------

const tune_0 = [
    0
];

const tune_1 = [
  0,4,4,0,
  0,4,4,0,
  0,5,5,0,
];

const get_freq = (tune, alpha) => {
    const i_freq = Math.floor( tune.length * 0.999 * alpha );
    return 2 * tune[ i_freq ]
};

VIDEO.update = function(sm, scene, camera, per, bias){
    const sud = scene.userData;
    const wp = sud.wp;


    const alpha = sm.frame / sm.frameMax;
    const i_frac = tune_1.length * 0.999 * alpha;
    const i = Math.floor(i_frac);
    const i_alpha = i_frac % 1;
    const i_alphasin = Math.sin( Math.PI * i_alpha );

    console.log( i_frac.toFixed(2), i, i_alpha );

    WP.apply_wave(wp, 0, get_freq(tune_0, per), 1.00);
    WP.apply_wave(wp, 1, get_freq(tune_1, per), i_alphasin);

    const mix_amp = 1.0;

    const sampdata_tracks = WP.gen_sampdata_tracks(wp, sud.samples_per_frame, true, mix_amp);
    return SW.write_frame_samples(sampdata_tracks.mixed, sm.frame, sm.imageFolder, sud.total_secs, sud.sample_rate );
};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sud = scene.userData;
    // background
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    // render threejs scene object
    sm.renderer.render(sm.scene, sm.camera);
    ctx.drawImage(sm.renderer.domElement, 0, 0, canvas.width, canvas.height);
};

