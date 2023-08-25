/*    video2-sin - for audio-generator-1 project
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
    const sound = scene.userData.sound = CS.create_sound({
        //wavefrom : 'sin',

        // custom sin waveform
        waveform: (samp_set, i, a_point, opt) => {
            const a_beat = ST.get_beat_alpha(a_point, opt.secs, samp_set.bps );
            return Math.sin( Math.PI  * 2 * samp_set.frequency * a_beat )  * samp_set.amplitude;
        },

        for_sample: ( samp_set, i, a_point, opt ) => {

samp_set.bps = 4;
samp_set.amplitude = 0.75;
samp_set.frequency = ST.freq_tune(a_point, [1,2,3,4]);

            return samp_set;
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

