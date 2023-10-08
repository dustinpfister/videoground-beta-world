/*    video05-01-sawfrom-alt - for audio-generator-waveform project
          * trying out an alternating sawtooth idea
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../js/samp_tools.js',
  '../js/samp_create.js',
  '../js/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    sm.renderer.setClearColor(0x000000, 0.25);

    const tune = [
       4,4,4,4,
       4,4,4,4,
       4,4,4,4,
       4,4,4,4,
       6,6,6,6,
       6,6,6,6,
       6,6,6,6,
       6,6,6,6,
       4,4,4,4,
       4,4,4,4,
       4,4,4,4,
       4,4,4,4,
       8,8,8,8,
       8,8,8,8,
       6,6,6,6,
       6,6,6,6,
       4,4,4,4,
       4,4,4,4,
       8,6,8,6,
       8,6,4,4
    ];

    const saw_samps = ( array, count=100, alpha=0, per_alpha=1, invert=false, offset = 0.15 ) => {
        const a1 = alpha * per_alpha % 1;
        //const a2 = Math.sin( Math.PI * a1  );
        const s1 = 1 - 2 * a1;
        const s2 = -1 + 2 * a1;
        let i = 0;
        while(i < count){
            const a_count = i / count;
            const a_lerp = invert ? 1 - a_count : a_count;
            array.push( THREE.MathUtils.lerp(s1, s2, (a_lerp * 0.99999 + offset) % 1 ) );
            i += 1;
        }
    };

    const sq = {
        objects: []
    };



    sq.objects[0] = {
        alpha: 1,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {
            const pa_1 = 2 * opt.secs;
            const pa_2 = 2 * opt.secs;
            saw_samps(fs.array_wave, 100, a_sound2, pa_1, false);
            saw_samps(fs.array_wave, 100, a_sound2, pa_2, true);
            return fs;
        },
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            return samp;  
        }
    };





    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        // called once per frame
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {

            fs.freq = 0.25 * 2 * tune[ Math.floor(tune.length * a_sound2) % tune.length];
            fs.amp = 0.75;

            fs.array_wave = [];

            // apply anything for the current sequence object
            ST.applySQFrame(sq, fs, frame, max_frame, a_sound2, opt);




            scene.userData.array_wave = fs.array_wave;

            return fs;
        },
        // called for each sample ( so yeah this is a hot path )
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
        disp_step: 100,
        secs: 20
 });
    sm.frameMax = sound.frames;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    // create the data samples
    const data_samples = CS.create_frame_samples(scene.userData.sound, sm.frame, sm.frameMax );
    return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.filePath, true);
};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sound = scene.userData.sound;
    const alpha = sm.frame / ( sm.frameMax - 1);
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    // draw disp
    DSD.draw( ctx, sound.array_disp, sound.opt_disp, sm.frame / ( sm.frameMax - 1 ) );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    DSD.draw( ctx, scene.userData.array_wave, sound.opt_wave, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

