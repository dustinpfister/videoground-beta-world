/*    video01-06-waveform-table - for audio-generator-1 project
          * testing out the table waveform
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
        for_sampset: ( samp_set, i, a_sound, opt ) => {
            return {
                amplitude: 4,
                a_wave : a_sound * opt.secs % 1,
                table: [
                    {  waveform: 'sin', frequency: 320, amplitude: 0.25 },
                    {  waveform: 'sin', frequency: 160, amplitude: 0.25 },
                    {  waveform: 'sin', frequency:  80, amplitude: 0.10 },
                    {  waveform: 'noise', amplitude: 0.25 }
                ]
            };
        },
        disp_step: 1,
        secs: 1
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

