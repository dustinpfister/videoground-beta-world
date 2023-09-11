/*    video04-05-perframe-tablefreq.js - for audio-generator-1 project
          * new waveform like table, only there is a frequency for the table
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


    const data_freq = [
        2,4,2,4,2,4,2,4, 8,7,6,8,7,6,
        2,4,2,4,2,4,2,4, 8,7,6,8,7,6
    ];

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'table',
/*
        waveform : (samp, a_wave ) => {
            const table_count = samp.table.length;
            const freq = samp.frequency === undefined ? 1 : samp.frequency;
            let i_wf = 0;
            let s = 0;
            while(i_wf < table_count ){
                const wf = samp.table[i_wf];
                const wf_samp = CS.WAVE_FORM_FUNCTIONS[wf.waveform](wf, a_wave * freq % 1);
                s += wf_samp;
                i_wf += 1;
            }
            return ( s / table_count ) * samp.amplitude;
        },
*/
        for_sampset: ( samp, i, a_sound, opt ) => {

            const spf = opt.sound.samples_per_frame;
            
            const frame = Math.floor(i / spf);
            const a_sound2 = frame / (opt.secs * 30);
            const a_frame = (i % spf) / spf;
            return {
                amplitude: 1,
                frequency: data_freq[ Math.floor( data_freq.length * a_sound2) ],
                a_wave : a_frame,
                table: [
                    {  waveform: 'sawtooth', frequency: 2, amplitude: 0.75 },
                    {  waveform: 'sin', frequency: 2, amplitude: 1.5 },
                    {  waveform: 'sin', frequency: 8, amplitude: 0.5 }
                ]
            };
        },
        //sample_rate: 1000,
        disp_step: 10,
        secs: 10
    });


    console.log(sound);

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
    DSD.draw( ctx, sound.array_disp, sound.opt_disp, sm.frame / ( sm.frameMax - 1 ) );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

