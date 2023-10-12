/*    video01-02-lerp-pulse-to-sawtooth-2 - for audio-generator-waveform project
          * same as the first one, but I am adjusting duty cycle, trans cycle, ect
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

    const tune = [

        1,2,1,2,3,2,3,2,3,4,3,4,4,5,4,5,6,5,6,5,6,7,6,7,7,7,6,5,
        1,2,1,2,
        4,3,4,3,
        2,3,4,3,2,3,4,3,5,4,5,4,5,4,5,4,6,7,6,7,6,7,6,7,7,7,7,7,7,6,5,4,

        2,3,2,3,2,3,2,3,5,5,5,5,6,6,7,7,7,7,7,
        2,3,2,3,2,3,2,3,5,5,5,5,6,6,1,1,1,1,1,

        2,2,2,2,
        4,4,4,4,
        2,2,3,3,2,2,4,4,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,6,5,4,3,2,1,1,1,1,1

/*
        1,1,2,2,3,3,
        4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
        5,5,5,5,5,5,5,5,2,2,2,2,2,3,3,3,3,3,3,3,
        4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
        5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,
        5,5,5,5,5,5,4,3,2,1,1,1
*/
    ];

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        // called once per frame
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            fs.array_wave = scene.userData.array_wave = [];
            let i2 = 0;
            const len = 100;

            const a_duty = 0.05 + 0.90 * a_sound2;


            const samp_pulse = { frequency: 2, amplitude: 0.50, duty: a_duty };
            const samp_saw = { frequency: 1, amplitude: 0.50 };
            while(i2 < len){

                const s1 = CS. WAVE_FORM_FUNCTIONS.pulse(samp_pulse, i2 / len );
                const s2 = CS. WAVE_FORM_FUNCTIONS.sawtooth(samp_saw, i2 / len );

                const a_trans = Math.sin( Math.PI * a_sound2);

                fs.array_wave.push( THREE.MathUtils.lerp(s1, s2, a_trans ) );
                i2 += 1;
            }
            fs.freq = tune[ Math.floor( tune.length * a_sound2) ];
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
    return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.imageFolder, true);
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

