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

    // common objects, settings, ect
    const nf = ST.create_nf();

    // track 1
    const tune_1 = [
        1,'a6',2,'a6',1,'a5',1,'f5'
    ];
    const data_1 = ST.tune_to_alphas(tune_1, nf);

    // track 2
    const tune_2 = [
        1,'a3',1,'a3',1,'a3',3,'g3'
    ];
    const data_2 = ST.tune_to_alphas(tune_2, nf);

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'table',
        for_sampset: ( samp_set, i, a_sound, opt ) => {


            // track 1
            const obj_1 = ST.get_tune_sampobj(data_1, a_sound, opt.secs, false);
            const a_tune1sin = Math.sin(Math.PI * obj_1.a_wave);

            // track 2
            const obj_2 = ST.get_tune_sampobj(data_2, a_sound, opt.secs, false);
            const a_tune2sin = Math.sin(Math.PI * obj_2.a_wave);

            // samp obj for table waveform
            return {
                amplitude: 0.75,
                a_wave : a_sound,
                table: [
                    {  waveform: 'sin', a_wave: obj_1.a_wave, frequency: obj_1.frequency * opt.secs, amplitude: a_tune1sin * 1.00 },
                    {  waveform: 'sin', a_wave: obj_2.a_wave, frequency: obj_2.frequency * opt.secs, amplitude:  a_tune2sin * 0.00 }
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