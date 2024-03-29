/*    video03-03-harmonics-table-amp - for audio-generator-1 project
          * Simple demo of a table waveform, but with variable amp for one freq
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
        waveform : 'table',
        for_sampset: ( sampset, i, a_sound, opt ) => {

            //const a_wave = a_sound * opt.secs % 1;
            const a_wave = a_sound;

            const amp_var = Math.sin( Math.PI * 1 * a_wave);

            return {
                amplitude: 1.5,
                a_wave : a_wave,
                table: [
                    {  waveform: 'sin', frequency:  200 * opt.secs, amplitude: 1.00 * amp_var  },
                    {  waveform: 'sin', frequency:  400 * opt.secs, amplitude: 0.3}
                ]
            };

        },
        secs: 10
    });

    sm.frameMax = sound.frames;

};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    return CS.write_frame_samples(scene.userData.sound, sm.frame, sm.filePath, true);
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

