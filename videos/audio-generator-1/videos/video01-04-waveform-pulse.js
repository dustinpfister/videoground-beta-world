/*    video01-04-waveform-pulse - for audio-generator-1 project
          * pulse waveform method
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
        waveform : 'pulse',
        for_sampset: ( samp, i, a_sound, opt ) => {
            samp.a_wave = a_sound * opt.secs % 1;
            samp.duty = 0.05 + 0.95 * a_sound;
            samp.frequency = 50;
            samp.amplitude = 0.50 
            return samp;
        },
        disp_step: 2000,
        getsamp_lossy: DSD.getsamp_lossy_pingpong,
        secs: 30
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
