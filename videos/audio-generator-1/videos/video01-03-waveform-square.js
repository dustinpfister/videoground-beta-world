/*    video01-03--waveform-square - for audio-generator-1 project
          * square wavefrom method
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

    const tune = [
        1,'f2',1,'f2',1,'f2',1,'g2',1,'f2',1,'f2',2,'c2',1,'d2',1,'c2',1,'d2',1,'e2',2,'f2',2,'f2',
        1,'f2',1,'f2',1,'f2',1,'g2',1,'f2',1,'f2',2,'c2',1,'d2',1,'c2',1,'d2',1,'e2',2,'f2',2,'f2',
        1,'c3',1,'b2',1,'a2',1,'g2',1,'a2',1,'g2',2,'f2',
        1,'d2',1,'c2',1,'d2',1,'e2',2,'f2',2,'f2',
        1,'c2',1,'c2',1,'d2',1,'e2',1,'f2',1,'f2',2,'g2',
        1,'c3',1,'b2',1,'a2',1,'g2',2,'f2',2,'a2',3,'f2'
    ];
    const nf = ST.create_nf();
    const data = ST.tune_to_alphas(tune, nf);

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'square',
        for_sampset: ( sampset, i, a_sound, opt ) => {
            const obj = ST.get_tune_sampobj(data, a_sound, opt.secs);
            sampset.a_wave = obj.a_wave; //a_sound * opt.secs % 1;
            sampset.amplitude = Math.sin( Math.PI * obj.a_wave ) * 0.75;
            sampset.frequency = obj.frequency; //160;
            return sampset;
        },
        disp_step: 5,
        getsamp_lossy: DSD.getsamp_lossy_random,
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
    DSD.draw( ctx, sound.array_disp, sound.opt_disp, sm.frame / ( sm.frameMax - 1 ) );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

