/*    video01-03-test-seededsaw - for samp-pitch-amp-curves
          * another with curves, but now with new waveform
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../../../js/samp_create/r0/samp_tools.js',
  '../../../js/samp_create/r0/samp_create.js',
  //'../../../js/samp_create/r0/waveforms/seedednoise.js',
  '../../../js/samp_create/r0/samp_draw.js'
];

//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){

    CS.WAVE_FORM_FUNCTIONS.seededsaw = (samp, a_wave )=> {
        samp.saw_effect = samp.saw_effect === undefined ? 0.5 : samp.saw_effect;
        samp.values_per_wave = samp.values_per_wave === undefined ? 40 : samp.values_per_wave;
        samp.int_shift = samp.int_shift === undefined ? 0 : samp.int_shift;
        samp.freq_alpha = samp.freq_alpha === undefined ? 1 : samp.freq_alpha;
        const freq_raw = samp.frequency;
        const freq = freq_raw * samp.freq_alpha;
        const a = a_wave * freq % 1;
        const i = Math.floor( (a * samp.values_per_wave) * 0.99999999 );
        const i2 = i + 1 % samp.values_per_wave;
        const b1 = -1 + 2 * THREE.MathUtils.seededRandom( samp.int_shift + i );
        const b2 = -1 + 2 * THREE.MathUtils.seededRandom( samp.int_shift + i2 );
        const n = THREE.MathUtils.lerp(b1, b2, a * (samp.values_per_wave * samp.saw_effect) % 1);
        return n * samp.amplitude;
    };


    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);
    // curve paths
    const curve_freq = sud.curve_freq = ST.get_curve_path([ 
        [0.00, 0.50, 0.13, 0.50, 0.13, 0.13, 0.13],
        [0.50, 0.55, 0.20, 0.65, 1.00, 0.13, 1.00],
    ]);
    const curve_param1 = sud.curve_param1 = ST.get_curve_path([ 
        [0.00, 0.20, 1.00, 0.70, 0.20, 0.10, 1.00]
    ]);
    const curve_param2 = sud.curve_param2 = ST.get_curve_path([ 
        [0.00, 0.05, 0.00, 0.05, 0.00, 0.00, 0.00],
        [0.10, 0.15, 0.25, 0.15, 0.25, 0.00, 0.25],
        [0.20, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25],
        [0.30, 0.35, 0.50, 0.35, 0.50, 0.25, 0.50],
        [0.40, 0.45, 0.50, 0.45, 0.50, 0.50, 0.50],
        [0.50, 0.65, 1.00, 0.75, 1.00, 0.50, 1.00],
    ]);
    // main sound object
    const sound = sud.sound = CS.create_sound({
        waveform : 'seededsaw',
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            let v2_ca = ST.get_curve_v2ca(curve_freq, a_sound2);
            fs.freq = 8 * v2_ca.y;
            v2_ca = ST.get_curve_v2ca(curve_param1, a_sound2);

            fs.values_per_wave = Math.round(180 * v2_ca.y);
            v2_ca = ST.get_curve_v2ca(curve_param2, a_sound2);
            fs.saw_effect = Math.floor( 16 * v2_ca.y) / 16;
            fs.amp = 0.75;
            return fs;
        },
        for_sampset: ( samp, i, a_sound, fs, opt ) => {
            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_sound2 = frame / (opt.secs * 30);
            const a_frame = (i % spf) / spf;
            samp.a_wave = a_frame;
            samp.amplitude = fs.amp;
            samp.frequency = fs.freq;
            samp.values_per_wave = fs.values_per_wave;
            samp.saw_effect = fs.saw_effect;
            return samp;
        },
        secs: 30
    });
    sud.opt_frame = { w: 1200, h: 200, sy: 480, sx: 40, mode: sound.mode };
    sud.opt_curve_freq = { w: 1200, h: 100, sy: 100, sx: 40 };
    sud.opt_curve_amp = { w: 1200, h: 100, sy: 220, sx: 40, len:100 };
    sud.opt_curve_param = { w: 1200, h: 100, sy: 340, sx: 40 };
    sm.frameMax = sound.frames;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sud = scene.userData;
    // create the data samples
    const data_samples = CS.create_frame_samples(sud.sound, sm.frame, sm.frameMax );
    return CS.write_frame_samples(sud.sound, data_samples, sm.frame, sm.imageFolder, sm.isExport);
};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sud = scene.userData;
    const sound = sud.sound;
    //const alpha = sm.frame / ( sm.frameMax - 1);
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    // curve
    let alpha = sm.per
    DSD.draw_curve( ctx, sud.curve_freq, alpha, 'freq', sud.opt_curve_freq );
    DSD.draw_curve( ctx, sud.curve_param1, alpha, 'param1 ( values per wave )', sud.opt_curve_amp );
    DSD.draw_curve( ctx, sud.curve_param2, alpha, 'param2 ( saw effect ) ', sud.opt_curve_param );
    // draw frame disp, and info
    DSD.draw( ctx, sound.array_frame, sud.opt_frame, 0, 'sample data ( current frame )' );
    DSD.draw_info(ctx, sound, sm);
};

