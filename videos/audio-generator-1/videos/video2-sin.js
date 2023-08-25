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

waveform: (samp_set, i, a_point, opt) => {
        const wave_count = samp_set.frequency * opt.secs;
        return Math.sin( Math.PI  * wave_count * a_point )  * samp_set.amplitude;
},

        for_sample: ( samp_set, i, a_point ) => {
            //const a_amp =  THREE.MathUtils.pingpong( a_point * 32, 1 );
            //samp_set.amplitude = 0.10 + 0.65 * THREE.MathUtils.smoothstep( a_amp, 0, 1 );
            //samp_set.frequency = 80 + 920 * a_point;

samp_set.amplitude = 0.75
samp_set.frequency = 500 - 250 * a_point;

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

