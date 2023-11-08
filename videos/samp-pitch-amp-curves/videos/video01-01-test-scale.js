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

    const v_start = new THREE.Vector2(0, 0);
    const v_end = new THREE.Vector2(1, 0);

    const v_control = new THREE.Vector2(0.90, 1.80);

    const curve = sud.curve = new THREE.QuadraticBezierCurve(v_start, v_control, v_end);
    const sound = sud.sound = CS.create_sound({
        waveform : 'seedednoise',
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            const v2_sa = curve.getPoint(a_sound2);
            const v2_ca = curve.getPoint(v2_sa.x);
            fs.amp = 1.00;

            fs.freq = ( 2 * Math.floor( 20 * v2_ca.y ) );
            return fs;
        },
        for_sampset: ( samp, i, a_sound, fs, opt ) => {
            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_sound2 = frame / (opt.secs * 30);
            const a_frame = (i % spf) / spf;
            samp.array = fs.array_wave;
            samp.a_wave = a_frame;
            samp.amplitude = fs.amp;
            samp.frequency = fs.freq;
            return samp;
        },
        secs: 10
    });
    sud.opt_frame = { w: 1200, h: 150, sy: 500, sx: 40, mode: sound.mode };
    sud.opt_curve = { w: 1200, h: 150, sy: 200, sx: 40 };
    //sud.arr_curve = sud.curve.getPoints(sud.opt_curve.w).map(( v )=> {
    //    return sud.curve.getPoint(v.x).y;
    //});
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
    const alpha = sm.frame / ( sm.frameMax - 1);
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    DSD.draw_curve( ctx, sud.curve, alpha, sud.opt_curve );

    // draw frame disp, and info
    DSD.draw( ctx, sound.array_frame, sud.opt_frame, 0 );
    DSD.draw_info(ctx, sound, sm);
};

