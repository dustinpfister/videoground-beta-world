/*    video01-01-alpha-hello - for audio-generator-waveplane project
          * Just Getting the core idea of what I want working
 */
//-------- ----------
// HELPERS
//-------- ----------

const get_tune_stats = (tune, alpha) => {
    const stats = {
        alpha: alpha
    };
    stats.i_frac = tune.length * 0.999 * stats.alpha;
    stats.i = Math.floor( stats.i_frac );
    stats.i_alpha = stats.i_frac % 1;
    stats.i_alphasin = Math.sin( Math.PI * stats.i_alpha );
    return stats;
};


const get_freq = (tune, alpha) => {    
    const i = 2 * Math.floor( tune.length / 2  * ( 0.999 * alpha ) );
    return tune[ i ]
};


const get_amp = (tune, alpha) => {    
    const i = 2 * Math.floor( tune.length / 2  * ( 0.999 * alpha ) );
    return tune[ i + 1];
};

//-------- ----------
// TUNES
//-------- ----------
const tune_0 = [
  0,0.00
];
const tune_1 = [
  8,0.00,
  8,0.10,
  8,0.20,
  8,0.30,
  8,0.40,
  8,0.50,
  8,0.60,
  8,0.70,
  8,0.80,
  8,0.90,
  8,1.00,
  8,0.00,
  8,1.00,
  8,0.00,
  8,1.00,
  8,0.00,
  8,1.00,
  8,1.00,
  8,1.00,
  8,1.00,
  8,0.90,
  8,0.80,
  8,0.70,
  8,0.60,
  8,0.50,
  8,0.40,
  8,0.30,
  8,0.20,
  8,0.10,
  8,0.00
];
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
    sm.frameMax = 30 * 1;
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


    //const stats = get_tune_stats(tune_1, per);


    WP.apply_wave(wp, 0, get_freq(tune_0, per), get_amp(tune_0, per) );
    WP.apply_wave(wp, 1, get_freq(tune_1, per), get_amp(tune_1, per) );

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

