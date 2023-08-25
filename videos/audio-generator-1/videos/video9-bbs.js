/*    video9-bbs - for audio-generator-1 project
          * beats per second
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

    const data = [
        0.75,100,
        0.75,200,
        0.75,400,
        0.75,800,
        0.75,1600,
        0.00,0,
        0.75,400,
        0.00,0,
        0.75,200,
        0.00,0
    ];

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'sin',
        for_sampset: ( sampset, i, a_sound, opt ) => {
 
            const bbs = 16; //data.length / 2;
            const i_wave = Math.floor( a_sound * opt.secs * bbs);
            sampset.a_wave = a_sound * opt.secs * bbs % 1;
 
            const i_el = i_wave % ( data.length / 2 );
            sampset.amplitude = data[i_el * 2] || 0;
            sampset.frequency = data[i_el * 2 + 1] || 0;
            return sampset;
        },
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