/*    video06-03-table-follin-seeded-tune1 - for audio-generator-waveform project
          * another one 'follinsaw' and 'seedednoise' waveforms
          * this time I would like to work out two tunes, one for each waveform
 */

//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../js/samp_tools.js',
  '../js/samp_create.js',
  '../js/wf_follinsaw.js',
  '../js/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    sm.renderer.setClearColor(0x000000, 0.25);

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        // called once per frame
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {

            fs.array_wave = scene.userData.array_wave = [];
            fs.freq = 1;
            fs.amp = 1;

            // common alphas
            const a1 = a_sound2 * (opt.secs * 1 ) % 1;

            // 'seedednoise' options
            const a_sin = Math.sin( Math.PI * a1 );
            const amp_sn = 0;
            const freq_sn = 0;
            const values_per_wave = 40;
            const int_shift = 0;

            // 'follinsaw' options
            const a_duty = a_sound2 * opt.secs % 1;


            const freq_fs = 2;
            const amp_fs = 1;
            const p1 = 0.95
            const p2 = 0.25;
            const duty = 0.9 - 0.6 * a_duty;


            // table samp object
            const samp_table = {
                amplitude: 1.00,
                frequency: 1.00,
                maxch: 2,
                a_wave : a_sound2,
                table: [
                    { waveform: 'seedednoise', frequency: freq_sn, amplitude: amp_sn,
                      values_per_wave: values_per_wave, int_shift: int_shift },
                    { waveform: 'follinsaw',   frequency: freq_fs, amplitude: amp_fs,
                      duty: duty, p1: p1, p2: p2 },
                ]
            };

            // gen array
            let i2 = 0;
            const len = 200;
            while(i2 < len){
                const a_frame = i2 / len;
                const s1 = CS.WAVE_FORM_FUNCTIONS.table_maxch(samp_table, a_frame );
                fs.array_wave.push( s1 );
                i2 += 1;
            }

            scene.userData.array_wave = fs.array_wave;

            return fs;
        },
        // called for each sample ( so yeah this is a hot path )
        for_sampset: ( samp, i, a_sound, fs, opt ) => {
            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_sound2 = frame / (opt.secs * 30);
            const a_frame = (i % spf) / spf;
            samp.array = fs.array_wave;
            samp.a_wave = a_frame;
            samp.amplitude = fs.amp;
            samp.frequency = fs.freq;
            return samp;
        },
        disp_step: 100,
        secs: 3
 });
    sm.frameMax = sound.frames;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    // create the data samples
    const data_samples = CS.create_frame_samples(scene.userData.sound, sm.frame, sm.frameMax );
    return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.imageFolder, true);
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
    DSD.draw( ctx, scene.userData.array_wave, sound.opt_wave, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

