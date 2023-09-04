/*    video01-waveform-sin - for audio-generator-1 project
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

    // The Good King Song
    const tune = [
        1,'f5',1,'f5',1,'f5',1,'g5',1,'f5',1,'f5',2,'c5',1,'d5',1,'c5',1,'d5',1,'e5',2,'f5',2,'f5',
        1,'f5',1,'f5',1,'f5',1,'g5',1,'f5',1,'f5',2,'c5',1,'d5',1,'c5',1,'d5',1,'e5',2,'f5',2,'f5',
        1,'c6',1,'b5',1,'a5',1,'g5',1,'a5',1,'g5',2,'f5',
        1,'d5',1,'c5',1,'d5',1,'e5',2,'f5',2,'f5',
        1,'c5',1,'c5',1,'d5',1,'e5',1,'f5',1,'f5',2,'g5',
        1,'c6',1,'b5',1,'a5',1,'g5',2,'f5',2,'a5',4,'f5'
    ];
    const nf = ST.create_nf();
    const data = ST.tune_to_alphas(tune, nf);


    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'sin',
        for_sampset: ( sampset, i, a_sound, opt ) => {

            const obj = ST.get_tune_sampobj(data, a_sound, opt.secs);

            sampset.a_wave = obj.a_wave; //a_sound * opt.secs % 1;
            sampset.amplitude = Math.sin( Math.PI * obj.a_wave ) * 0.75;
            sampset.frequency = obj.frequency; //160;
            return sampset;
        },
        disp_step: 1,
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
    DSD.draw( ctx, sound.array_disp, sound.opt_disp, sm.frame / ( sm.frameMax - 1 ) );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

