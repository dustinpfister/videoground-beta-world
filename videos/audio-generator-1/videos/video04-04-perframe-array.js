/*    video04-04-perframe-array.js - for audio-generator-1 project
          * using the array waveform, and frame by frame alphas
          * using an array of data created from an audacity samp data export ( see README )
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

    // 8000 samps from an audio file of macho man randy savage
    // saying 'Oh Yeah!' I kid you not. Why you might ask? I have no words.
    const data_samp =  [
        0,1,0,1,0,1
    ].map( (n) => {
        return ( n * 2 - 1 ) * 1;
    });

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        for_sampset: ( samp, i, a_sound, opt ) => {

            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_frame = (i % spf) / spf;

            samp.a_wave = a_frame;
            samp.array = data_samp;
            samp.amplitude = 1;
            samp.frequency = 1; //Math.floor( Math.pow(2, 4 * a_sound) );

            samp.a_wave = a_sound;
            samp.frequency = 1;

            return samp;

        },
        disp_step: 1,
        secs: 0.5
    });


    console.log(sound);

    sm.frameMax = sound.frames;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    return CS.write_frame_samples(scene.userData.sound, sm.frame, sm.filePath);
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
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

