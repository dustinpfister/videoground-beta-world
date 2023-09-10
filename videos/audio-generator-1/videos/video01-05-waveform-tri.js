/*   video01-05-waveform-tri - for audio-generator-1 project
          * triangle wavefrom method
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

    const data_step = [
        0,   0,  0,  0,
        6,   8,  10,  12,
        0,   0,  0,  0,
        6,6,6,6,6,6,6,
        6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6
    ];
    const data_freq = [
        60, 80, 100, 120,
        60, 80, 100, 120,
        60, 80, 100, 120,
        60, 80, 100, 120, 120, 120, 120,
        200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100, 90, 80, 70, 60, 50, 40
    ];

    sm.renderer.setClearColor(0x000000, 0.25);
    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'tri',
        for_sampset: ( sampset, i, a_sound, opt ) => {
            //sampset.a_wave = a_sound * opt.secs % 1;
            sampset.a_wave = a_sound * data_freq.length % 1;

            sampset.step_count = data_step[ Math.floor(data_step.length * a_sound ) ];
            sampset.frequency = data_freq[ Math.floor(data_freq.length * a_sound ) ];
            sampset.amplitude = 0.50;
            return sampset;
        },
        disp_step: 100,
        getsamp_lossy: DSD.getsamp_lossy_random,
        secs: 20
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
    DSD.draw( ctx, sound.array_disp, sound.opt_disp, alpha );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

