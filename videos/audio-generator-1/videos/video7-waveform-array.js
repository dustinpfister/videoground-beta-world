/*    video8-waveform-array - for audio-generator-1 project
          * Just using the sin wavefrom
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
        waveform : (samp, a_wave ) => {

            const a = (a_wave * samp.frequency % 1) * samp.array.length;
            const i = Math.floor( a * 0.99 );
            const n = samp.array[ i ];
            return n * samp.amplitude;
        },
        for_sampset: ( samp, i, a_sound, opt ) => {
            samp.a_wave = a_sound * opt.secs % 1;
            samp.array = [
                -0.80,  0.80, -0.89,  0.86, -0.73,  0.77, -0.67,  0.62, -0.52,  0.58,
                -0.42,  0.47, -0.32,  0.28, -0.13,  0.11, -0.05,  0.05,  0.00,  0.00,
                -0.00,  0.00, -0.01,  0.05, -0.20,  0.13, -0.10,  0.10, -0.20,  0.50];
            samp.amplitude = 0.75 - 0.5 * a_sound;
            samp.frequency = 119;
            return samp;
        },
        secs: 10
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
    DSD.draw( ctx, sound.array_disp, sound.opt_disp, sm.frame / ( sm.frameMax - 1 ) );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

