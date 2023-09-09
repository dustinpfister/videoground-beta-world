/*    video01-08-waveform-noise - for audio-generator-1 project
          * testing out a noise waveform
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

    const tune1 = [40, 40, 40, 80, 80, 80, 40, 80, 40, 80, 40, 80, 40, 99, 99, 99, 99, 99, 80, 40, 20];
    const tune2 = [ 0,  0,  0,  0,  0,  0,  0,  0,500,500,  0,  0,  0,500,  0,500,  0,  0,  0,  0,  0]

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'table',
        for_sampset: ( samp, i, a_sound, opt ) => {
            const a_noise = Math.sin( Math.PI * (a_sound * opt.secs / 2 % 1) );
            const freq1 = tune1[ Math.floor( tune1.length * a_sound ) ];
            const freq2 = tune2[ Math.floor( tune2.length * a_sound ) ];
            return {
                amplitude: 2.00,
                a_wave : a_sound * opt.secs % 1,
                table: [
                    {  waveform: 'noise', amplitude: 0.75 * a_noise },
                    {  waveform: 'sawtooth', frequency:  freq1, amplitude: 0.25 },
                    {  waveform: 'sin', frequency: freq2, amplitude: 0.25 }
                ]
            };
        },
       disp_step: 1,
       secs: 4
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

