/*    video01-01-test-scale - for samp-pitch-amp-curves
          * test out R0 of samp-create in main  js folder
          * get basic idea working
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../../../js/samp_create/r0/samp_tools.js',
  '../../../js/samp_create/r0/samp_create.js',
  '../../../js/samp_create/r0/waveforms/seedednoise.js',
  '../../../js/samp_create/r0/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);
    // curve for setting pitch over time
    const curve_freq = sud.curve_freq = ST.get_bzcubic(0.20, 1.60, 0.30, 0.60, 0.10, 0.00);
    const curve_amp = sud.curve_amp = ST.get_bzcubic(0.60, 1.00, 0.50, 0.70, 0.30, 0.10);
    const curve_param = sud.curve_param = ST.get_bzcubic(0.25, -1.50, 0.55, 2.40, 1);
    const sound = sud.sound = CS.create_sound({
        waveform : 'seedednoise',
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            let v2_ca = ST.get_curve_v2ca(curve_amp, a_sound2);
            fs.amp = v2_ca.y;
            v2_ca = ST.get_curve_v2ca(curve_freq, a_sound2);
            fs.freq = 0.10 * 2 * Math.floor( 1 + 49 * v2_ca.y );
            v2_ca = ST.get_curve_v2ca(curve_param, a_sound2);
            fs.values_per_wave = 5 + 95 * v2_ca.y;
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
            return samp;
        },
        secs: 30
    });
    sud.opt_frame = { w: 1200, h: 200, sy: 480, sx: 40, mode: sound.mode };
    sud.opt_curve_freq = { w: 1200, h: 100, sy: 100, sx: 40 };
    sud.opt_curve_amp = { w: 1200, h: 100, sy: 220, sx: 40 };
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
    DSD.draw_curve( ctx, sud.curve_freq, sm.per, 'freq', sud.opt_curve_freq );
    DSD.draw_curve( ctx, sud.curve_amp, sm.per, 'amp', sud.opt_curve_amp );
    DSD.draw_curve( ctx, sud.curve_param, sm.per, 'param ( values per wave ) ', sud.opt_curve_param );
    // draw frame disp, and info
    DSD.draw( ctx, sound.array_frame, sud.opt_frame, 0, 'sample data ( current frame )' );
    DSD.draw_info(ctx, sound, sm);
};

