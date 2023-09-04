/*    video12-harmonics-table - for audio-generator-1 project
          * worked out some good code, I would now like to use the table with it
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
        1,'f5',1,'f5',1,'f5',1,'g5',1,'f5',5,'f5',2,'c5',1,'d5',1,'c5',1,'d5',1,'e5',2,'f5',2,'f5',
        1,'c6',1,'b5',1,'a5',1,'g5',1,'a5',1,'g5',2,'f5',
        1,'d5',1,'c5',1,'d5',1,'e5',2,'f5',2,'f5',
        1,'c5',1,'c5',1,'d5',1,'e5',1,'f5',1,'f5',2,'g5',
        1,'c6',1,'b5',1,'a5',1,'g5',2,'f5',2,'a5',4,'f5'
    ];
    const nf = ST.create_nf();
    const data = ST.tune_to_alphas(tune, nf);
    // sound object as always
    const sound = scene.userData.sound = CS.create_sound({
        // custom sin waveform in which integers of half waveforms are use
        waveform : 'table',
        for_sampset: ( sampset, i, a_sound, opt ) => {
            let frequency = 0;
            let a_wave = a_sound;
            let id = 0;
            while(id < data.length){
                const alow = data[id];
                const ahi = data[id + 1];
                const freq = data[id + 2];
                if( a_sound >= alow && a_sound < ahi){
                    const arange = alow - ahi;
                    const secs = arange * opt.secs;
                    //sampset.a_wave = a_sound * opt.secs % 1;
                    a_wave = (a_sound - alow) / arange;
                    frequency = freq * secs;
                    break;
                }
                id += 3;
            }

            const amp_var = Math.sin( Math.PI * 1 * a_wave );
            return {
                amplitude: 1.5,
                a_wave : a_wave,
                table: [
                    {  waveform: 'sin', frequency: frequency, amplitude:  1 * amp_var  },
                    {  waveform: 'sin', frequency: frequency * 2, amplitude: 0.30 * amp_var   },
                    {  waveform: 'sin', frequency: frequency * 4, amplitude: 0.60 * amp_var   },
                    {  waveform: 'sin', frequency: frequency * 8, amplitude: 0.10 * amp_var   }
                ]
            };
        },
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

