/*    video02-03-tune-tracks - for audio-generator-1 project
          * more than one track using table wave?
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
    const nf = ST.create_nf();
    // ROCK-A-BYE BABY
    // https://noobnotes.net/rock-a-bye-baby-traditional/
    const tune_rb = [
        1,'e5',1,'g5',1,'e6',2,'d6',1,'c6',1,'e5',1,'g5',1,'c6',3,'b5',1,'f5',1,'g5',1,'f6',
        2,'e6',1,'d6',1,'d6',1,'c6',1,'a5',3,'g5',
        1,'e5',1,'g5',1,'e6',2,'d6',1,'c6',1,'e5',1,'g5',1,'c6',2,'b5',1,'g5',1,'c6',1,'f6',1,'e6',1,'c6',
        1,'d6',1,'a5',1,'b5',3,'c6'
    ];
    const data_rb = ST.tune_to_alphas(tune_rb, nf);
    // TUNE for tri wave
    const tune_tri = [
1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',
1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',
1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c5',1,'c5',1,'c5',1,'c5',
1,'c5',1,'c5',1,'c5',1,'c5',1,'c5',1,'c5',1,'c5',1,'c5',1,'c5',1,'c5',
1,'c5',1,'c5',1,'c5',1,'c5',1,'c5',1,'c5'
/*
        1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',
        1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',
        1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',
        1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6',1,'c5',1,'c6'
*/
    ];
    const data_tri = ST.tune_to_alphas(tune_tri, nf);

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'table',
        for_sampset: ( samp_set, i, a_sound, opt ) => {
            // main alpha for table
            const aw_2 = a_sound * opt.secs % 1;
            // rb
            const obj_rb = ST.get_tune_sampobj(data_rb, a_sound, opt.secs);
            const a_wave_rb_sin = Math.sin(Math.PI * obj_rb.a_wave);
            // tune tri
            const obj_tri = ST.get_tune_sampobj(data_tri, a_sound, opt.secs);
            const a_wave_tri_sin = Math.sin(Math.PI * obj_tri.a_wave);
            // samp obj for table waveform
            return {
                amplitude: 0.75,
                a_wave : obj_rb.a_wave,
                table: [
                    {  waveform: 'sin', a_wave: obj_rb.a_wave, frequency: obj_rb.frequency, amplitude: 0.25 },
                    {  waveform: 'sin', a_wave: obj_tri.a_wave, frequency: obj_tri.frequency, amplitude:  0.25 }
                ]
            };
        },
        disp_step: 1,
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