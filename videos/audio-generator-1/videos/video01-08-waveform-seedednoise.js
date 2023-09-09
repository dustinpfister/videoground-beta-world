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

    const tune1 = [
       10, 20, 30, 40, 50, 60, 70, 80, 80,
       20, 20, 40, 40, 20, 20, 40, 40, 60, 60, 80, 80, 80, 80,
       20, 20, 40, 40, 20, 20, 40, 40, 60, 60, 40, 40, 40, 40, 

       20, 20, 40, 40, 20, 20, 40, 40, 60, 60, 80, 80, 80, 80,

       20, 20, 40, 40, 20, 20, 40, 40, 60, 60, 40, 40, 40, 40, 40, 40, 40, 40, 80, 80, 80, 80, 80, 80, 80, 80,
       20, 20, 80, 80, 20, 20, 80, 80, 20, 20, 80, 80, 40, 40, 40, 40, 60, 60, 60, 60, 80, 80, 60, 60, 80, 80,

       10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20,

       80, 70, 60, 50, 40, 30, 20, 10, 10,
    ];

    const sound = scene.userData.sound = CS.create_sound({
        waveform : (samp, a_wave ) => {

            //const b = 2 * Math.random() * samp.amplitude;
            //return b - samp.amplitude;;

            samp.array = [];
            let i2 = 0;
            while(i2 < 40){
                //const n = -1 + 2 * Math.random();
                //const n = -1 + 2 * THREE.MathUtils.seededRandom( Math.floor( a_wave * 20 ) );

                const n = -1 + 2 * THREE.MathUtils.seededRandom( i2 );

                samp.array.push(n);
                i2 += 1;
            }

            const a = (a_wave * samp.frequency % 1) * samp.array.length;
            const i = Math.floor( a * 0.99 );
            const n = samp.array[ i ];
            return n * samp.amplitude;
        },
        for_sampset: ( samp, i, a_sound, opt ) => {
            samp.a_wave = a_sound * opt.secs % 1;
            samp.amplitude = 0.75;
            samp.frequency = tune1[ Math.floor( tune1.length * a_sound) ];  //20 + 80 * a_sound;
            return samp;
        },
       disp_step: 100,
       secs: 20
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

