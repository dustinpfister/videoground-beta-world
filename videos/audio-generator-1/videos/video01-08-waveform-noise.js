/*    video01-08-waveform-noise - for audio-generator-1 project
          * testing out a noise waveform
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
        waveform : (samp, a_wave ) => {

            //const b = 2 * Math.random() * samp.amplitude;
            //return b - samp.amplitude;;

            samp.array = [];
            let i2 = 0;
            while(i2 < 3){
                //const n = -1 + 2 * Math.random();
                const n = -1 + 2 * THREE.MathUtils.seededRandom( Math.floor( a_wave * 1000 ) );
                samp.array.push(n);
                i2 += 1;
            }

            const a = a_wave * samp.array.length;
            const i = Math.floor( a * 0.99 );
            const n = samp.array[ i ];
            return n * samp.amplitude;
        },
        for_sampset: ( samp, i, a_sound, opt ) => {
            samp.a_wave = a_sound * opt.secs % 1;
            samp.amplitude = 0.75;
            samp.frequency = 10;
            return samp;
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

