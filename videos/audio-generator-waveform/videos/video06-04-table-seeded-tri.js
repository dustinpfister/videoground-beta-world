/*    video06-04-table-seeded-tri - for audio-generator-waveform project
          * trying out a table of seeded random noise, and tri tracks
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

    const tune_1 = [
        1,'c1',  1,'c1', 1,'c1', 0.5,'c1',  0.5,'c1',  1,'c1',
        1,'c1',  1,'c1', 1,'c1', 0.5,'c1',  0.5,'c1',  1,'c1',
        1,'b1',  1,'b1', 1,'b1', 0.5,'b1',  0.5,'b1',  1,'b1',
        1,'b1',  1,'b1', 1,'b1', 0.5,'b1',  0.5,'b1',  1,'b1',

        1,'c1',  1,'c1', 1,'c1', 0.5,'c1',  0.5,'c1',  1,'c1',
        1,'c1',  1,'c1', 1,'c1', 0.5,'c1',  0.5,'c1',  1,'c1',
        1,'b1',  1,'b1', 1,'b1', 0.5,'b1',  0.5,'b1',  1,'b1',
        1,'b1',  1,'b1', 1,'b1', 0.5,'b1',  0.5,'b1',  1,'b1'
    ];
    const tune_2 = [
        20,'rest',
        5,'f2',
        5,'f3',
        2.5,'f2',2.5,'f2', 
        1,'b3',1,'a3',1,'g3',1,'f3',1,'e3'
    ];



    const nf = ST.create_nf();
    const data_1 = ST.tune_to_alphas(tune_1, nf);
    const data_2 = ST.tune_to_alphas(tune_2, nf);
    const sq = {
        objects: []
    };

    const total_secs = 20;
    const playback_secs = 20;

    sq.objects[0] = {
        alpha: 10 / total_secs,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {
            const obj_1 = ST.get_tune_sampobj(data_1, a_object, 10, false);
            const obj_2 = ST.get_tune_sampobj(data_2, a_object, 10, false);

            fs.freq_sn = ( obj_1.frequency ) / 30;
            fs.amp_sn = ST.get_tune_amp(fs.freq_sn, obj_1.a_wave, 0.05, 0.25);


            const a = obj_1.a_wave;
            fs.values_per_wave = Math.round(10 + 60 * a);

            fs.freq_tri = ( obj_2.frequency ) / 30;
            fs.amp_tri = ST.get_tune_amp(fs.freq_tri, obj_2.a_wave, 0.25, 0.75);

            return fs;
        }
    };

    sq.objects[1] = {
        alpha: 20 / total_secs,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {

            const a_times = a_object * 2 % 1;

            const obj_1 = ST.get_tune_sampobj(data_1, a_times, 10, false);
            const obj_2 = ST.get_tune_sampobj(data_2, a_times, 10, false);

            fs.freq_sn = ( obj_1.frequency ) / 30;
            fs.amp_sn = ST.get_tune_amp(fs.freq_sn, obj_1.a_wave, 0.05, 0.25);
            const a = ST.get_alpha_sin(obj_1.a_wave, 1, 1);

            fs.values_per_wave = Math.round(70 - 30 * a);

            fs.freq_tri = ( obj_2.frequency ) / 30;
            fs.amp_tri = ST.get_tune_amp(fs.freq_tri, obj_2.a_wave, 0.25, 0.75);       
            return fs;
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

            fs.amp_sn = 1;
            fs.freq_sn = 1;
            fs.values_per_wave = 80;
            fs.int_shift = 0;

            fs.freq_tri = 4;
            fs.amp_tri = 1;
            fs.step_count = 100;

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
                    { waveform: 'tri',
                      frequency: fs.freq_tri,
                      amplitude: fs.amp_tri,
                      step_count: fs.step_count
                    },
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

