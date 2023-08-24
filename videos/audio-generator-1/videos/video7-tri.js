/*    video7-tri - for audio-generator-1 project
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
    sm.renderer.setClearColor(0x000000, 0.25);
    const sound = scene.userData.sound = CS.create_sound({
        wavefrom : 'tri',
        for_sample: ( samp_set, i, a_point ) => {
            samp_set.step_count = 20 - 15 * a_point;
            const a = Math.sin( Math.PI * (a_point * 2 % 1) );
            samp_set.frequency = 1000 - 50 * Math.floor( a * 19 );
            samp_set.amplitude = 0.25 + 0.5 * a_point; 
            return samp_set;
        },
        getsamp_lossy: DSD.getsamp_lossy_random,
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
    DSD.draw( ctx, sound.array_disp, sound.opt_disp, alpha );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

