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

    const sq = {
        objects: []
    };

    const total_secs = 25;
    const playback_secs = total_secs; //5;

    sq.objects[0] = {
        alpha: 5 / total_secs,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {
            // 'seedednoise' options
            fs.amp_sn = 1 - 0.75 * a_object;
            fs.freq_sn = 1;
            fs.values_per_wave = Math.floor(200 - 160 * a_object);
            fs.int_shift = 0;
            // 'follinsaw' options
            const a_duty = ST.get_alpha_sin(a_object, 1, (10 - 8 * a_object ) * opt.secs);
            fs.freq_fs = 10 - 6 * a_object;
            fs.amp_fs = 1;
            fs.p1 = 0.75 - 0.25 * a_object;
            fs.p2 = 0.25 + 0.25 * a_object;
            fs.duty = 0.75 - 0.25 * a_duty;
            return fs;
        },
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            return samp;  
        }
    };
    const tune_fs = [
        4,4,4,4, 4,4,4,4, 4,4,4,4, 5,5,5,5, 5,5,5,5,
        5,5,5,5, 0,4,4,0, 0,4,4,0, 0,5,5,5, 5,5,5,5,
        5,5,5,0, 0,4,4,0, 0,4,4,0, 0,5,5,0, 0,5,5,0,
        0,4,4,0, 0,4,4,0, 0,5,5,0, 0,5,5,4, 4,2,2,1
    ];
    const tune_seed = [
        1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 2,2,2,2,
        2,2,2,2, 2,2,2,2, 2,2,2,2, 1,1,1,1, 1,1,1,1,
        3,3,3,3, 3,3,3,3, 2,2,2,2, 2,2,2,2, 1,1,1,1,
        1,1,1,1, 1,1,2,2, 3,3,3,3, 2,2,1,1, 1,1,1,1
    ];
    sq.objects[1] = {
        alpha: 25 / total_secs,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {
            // common alphas
            const a1 = a_sound2 * (opt.secs * 1 ) % 1;
            // 'seedednoise' options
            const ti1 = 0.25 + 0.25 * tune_seed[ Math.floor(tune_seed.length * a_object) ];
            fs.amp_sn = 0.25 + 0.75 * a_object;
            fs.freq_sn = ti1;
            fs.values_per_wave = 40;
            fs.int_shift = 0;
            // 'follinsaw' options
            const a_duty = ST.get_alpha_sin(a_object, 1, 2 * opt.secs);
            const ti2 = tune_fs[ Math.floor(tune_fs.length * a_object) ];
            fs.freq_fs = ti2;
            fs.amp_fs = ti2 > 0 ? 1: 0;
            fs.p1 = 0.75 - 0.25 * a_object;
            fs.p2 = 0.25 + 0.25 * a_object;
            fs.duty = 0.75 - 0.25 * a_duty;
            return fs;
        },
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            return samp;  
        }
    };

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        // called once per frame
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {

            // default waveform options
            fs.array_wave = scene.userData.array_wave = [];
            fs.freq = 1;
            fs.amp = 1;
            fs.amp_sn = 0.1;
            fs.freq_sn = 1;
            fs.values_per_wave = 40;
            fs.int_shift = 0;
            fs.freq_fs = 2;
            fs.amp_fs = 1;
            fs.p1 = 0.75;
            fs.p2 = 0.25;
            fs.duty = 0.5;

            // apply logic for current frame
            ST.applySQFrame(sq, fs, frame, max_frame, a_sound2, opt);

            // table samp object
            const samp_table = {
                amplitude: 1.00,
                frequency: 1.00,
                maxch: 2,
                a_wave : a_sound2,
                table: [
                    { waveform: 'seedednoise',
                      frequency: fs.freq_sn,
                      amplitude: fs.amp_sn,
                      values_per_wave: fs.values_per_wave,
                      int_shift: fs.int_shift
                    },
                    { waveform: 'follinsaw',
                      frequency: fs.freq_fs,
                      amplitude: fs.amp_fs,
                      duty: fs.duty,
                      p1: fs.p1,
                      p2: fs.p2
                    }
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
            ST.applySQ(sq, samp, i, a_sound, opt);
            return samp;
        },
        disp_step: 100,
        secs: playback_secs
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

