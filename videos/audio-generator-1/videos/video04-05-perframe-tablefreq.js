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


    const sound = scene.userData.sound = CS.create_sound({
        waveform : (sampeset, a_wave ) => {
            const table_count = sampeset.table.length;
            let i_wf = 0;
            let samp = 0;
            while(i_wf < table_count ){
                const wf = sampeset.table[i_wf];
                const wf_samp = CS.WAVE_FORM_FUNCTIONS[wf.waveform](wf, a_wave);
                samp += wf_samp;
                i_wf += 1;
            }
            return ( samp / table_count ) * sampeset.amplitude;
        },
        for_sampset: ( samp, i, a_sound, opt ) => {

            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_frame = (i % spf) / spf;
            return {
                amplitude: 0.75,
                a_wave : a_frame,
                table: [
                    {  waveform: 'sin', frequency: 4, amplitude: 0.5 }
                ]
            };
        },
        //sample_rate: 1000,
        disp_step: 1,
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

