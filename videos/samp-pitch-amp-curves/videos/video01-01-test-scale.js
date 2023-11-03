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
  '../../../js/samp_create/r0/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);


    const v_start = new THREE.Vector2(0,0);
    const v_end = new THREE.Vector2(1,0);
    const v_control = new THREE.Vector2(0.10,0.99);
    const curve = new THREE.QuadraticBezierCurve(v_start, v_control, v_end);

    const sq = {
        objects: []
    };
    const playback_secs = 10;
    sq.objects[0] = {
        alpha: 1,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {

            const v2 = curve.getPoint(a_object);


            fs.amp = 0.75;
            fs.freq = (2 * Math.floor(20 * v2.y));


            return fs;
        }
    };
    const sound = sud.sound = CS.create_sound({
        waveform : 'sin2',
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            fs.freq = 1;
            fs.amp = 1;
            ST.applySQFrame(sq, fs, frame, max_frame, a_sound2, opt);
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
            ST.applySQ(sq, samp, i, a_sound, opt);
            return samp;
        },
        secs: playback_secs
    });
    sud.opt_frame = { w: 1200, h: 150, sy: 500, sx: 40, mode: sound.mode };
    sm.frameMax = sound.frames;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    // create the data samples
    const data_samples = CS.create_frame_samples(scene.userData.sound, sm.frame, sm.frameMax );
    return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.imageFolder, sm.isExport);
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
    // draw frame disp and info
    DSD.draw( ctx, sound.array_frame, sud.opt_frame, 0 );
    DSD.draw_info(ctx, sound, sm);
};

