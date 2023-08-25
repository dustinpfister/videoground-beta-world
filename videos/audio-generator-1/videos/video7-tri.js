/*    video7-tri - for audio-generator-1 project
          * triangle wavefrom method
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
    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'tri',
        for_sample: ( samp_set, i, a_sound ) => {
            samp_set.step_count = 5; //20 - 5 * a_sound;
            const a_freq = Math.sin( Math.PI * (a_sound * 2 % 1) );

            samp_set.frequency = 1000 - 50 * Math.floor( a_freq * 19 );
            samp_set.frequency = ST.freq_tune(a_sound);

            samp_set.frequency = ST.freq_tune(a_sound, [1,1,0,4,4,0,6,0,6,0,10,9,8,7,7,5,1], 80, 1000);

            samp_set.amplitude = 0.5; //0.25 + 0.5 * a_sound; 
            return samp_set;
        },
        getsamp_lossy: DSD.getsamp_lossy_random,
        secs: 5
    });
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
    DSD.draw( ctx, sound.array_disp, sound.opt_disp, alpha );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

