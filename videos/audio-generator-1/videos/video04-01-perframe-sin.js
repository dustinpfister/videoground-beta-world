/*    video04-01-perframe-sin - for audio-generator-1 project
          * going by alpha values on a frame by fram basis
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
        waveform : 'tri',
        for_sampset: ( samp, i, a_sound, opt ) => {

            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_frame = (i % spf) / spf;


            samp.a_wave = 0;

            // squish effect
            const a_sq = Math.sin( Math.PI * ( a_sound * 4 % 1) );
            //const a_low = 0.25 * a_sq, a_hi = 1 - 0.25 * a_sq;
const a_low = 0.25 - 0.25 * a_sq, a_hi = 0.75 + 0.25 * a_sq;
            let freq = 0;
            let amp = 0.75;
            if( a_frame > a_low && a_frame < a_hi ){
                samp.a_wave = (a_frame - a_low) / ( a_hi - a_low );
                freq = 7;
                amp = 0.75;
            }

            samp.frequency = freq;
            samp.amplitude = amp;


            //const a_sound3 = frame / opt.sound.frames;
            //samp.frequency = 1; // + Math.round( 8 * a_sound2);
            //samp.amplitude = 0.65;

            return samp;
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

