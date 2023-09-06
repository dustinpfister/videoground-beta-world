/*    video04-03-perframe-table.js - for audio-generator-1 project
          * using the table waveform, and frame by frame alphas
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
        for_sampset: ( samp, i, a_sound, opt ) => {

            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_frame = (i % spf) / spf;

            return {
                amplitude: 0.75,
                a_wave : a_frame,
                table: [
                    {  waveform: 'sin', frequency: 2, amplitude: 1.00 },
                    {  waveform: 'sin', frequency: 8 + Math.floor(10 * a_sound), amplitude: 0.25 }
                ]
            };
        },
        //sample_rate: 1000,
        disp_step: 1,
        secs: 1
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

