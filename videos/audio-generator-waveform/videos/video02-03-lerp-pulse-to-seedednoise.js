/*    video01-03-lerp-pulse-to-seededrandom - for audio-generator-waveform project
          * from pulse to seeded noise
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
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            fs.array_wave = scene.userData.array_wave = [];
            let i2 = 0;
            const len = 100;


            const samp_pulse = {
                frequency: 1,
                amplitude: 1.00,
                duty: 0.05 + 0.90 * Math.sin( Math.PI * (a_sound2 * (opt.secs * 2.5) % 1) )
            };
            const samp_seedednoise = {
                frequency: 1,
                amplitude: 1.00,
                int_shift: 0
            };

            while(i2 < len){

                const s1 = CS. WAVE_FORM_FUNCTIONS.pulse(samp_pulse, i2 / len );
                const s2 = CS. WAVE_FORM_FUNCTIONS.seedednoise(samp_seedednoise, i2 / len );


                const a_trans = a_sound2;

                fs.array_wave.push( THREE.MathUtils.lerp(s1, s2, a_trans ) );
                i2 += 1;
            }
            fs.freq = 8 - 7 * a_sound2;
            return fs;
        },
        // called for each sample ( so yeah this is a hot path )
        for_sampset: ( samp, i, a_sound, fs, opt ) => {
            const spf = opt.sound.samples_per_frame;
            const a_frame = (i % spf) / spf;
            samp.array = fs.array_wave;
            samp.a_wave = a_frame;
            samp.amplitude = 0.75;
            samp.frequency = fs.freq;
            return samp;
        },
        disp_step: 10,
        secs: 15
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

