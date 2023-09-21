/*    video01-01-array-lerp - for audio-generator-waveform project
          * lerp from one waveform to another
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
    let array_wave = [];
    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        // called once per frame
        for_frame : (fs, frame, max_frame, a_sound2 ) => {
            fs.array_wave = scene.userData.array_wave = [];
            let i2 = 0;
            const len = 100;
            while(i2 < len){
                const samp_sin = { frequency: 2, amplitude: 0.50 };
                const samp_tri = { frequency: 1, amplitude: 0.50, step_count: 4 };
                const s1 = CS. WAVE_FORM_FUNCTIONS.sin(samp_sin, i2 / len );
                const s2 = CS. WAVE_FORM_FUNCTIONS.seedednoise(samp_tri, i2 / len );
                fs.array_wave.push( THREE.MathUtils.lerp(s1, s2, a_sound2 ) );
                i2 += 1;
            }
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
            samp.amplitude = 0.75;
            const a_bias = Math.sin( Math.PI * (a_sound2 * 8 % 1) );
            samp.frequency = 2 * Math.floor(1 + 8 * a_bias) ;
            return samp;
        },
        disp_step: 100,
        secs: 30
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

