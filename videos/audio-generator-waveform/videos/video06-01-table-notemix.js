/*    video06-01-table-notemix - for audio-generator-waveform project
          * I have found that there are some problems with my current 'table' waveform that I would like to fix
          * The main issue has to do with how to go about mixing more than one note that is played at the same time
          * There is averaging things out, but I think it might be best to step up by a fixed delta for each note
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

    //-------- ----------
    // notes array
    //-------- ----------
    const notes = [
        [
          7,7,7,0, 7,7,7,0, 0,0,0,0, 0,0,0,0,
          7,7,7,0, 7,7,7,6, 0,0,0,0, 0,0,0,0, 
          7,7,7,0, 7,7,7,6, 5,0,0,0, 0,0,0,0, 
          7,7,7,0, 7,7,7,6, 5,4,0,0, 0,0,0,0, 
          7,7,7,0, 7,7,7,6, 5,4,3,0, 0,0,0,0,
          7,7,7,0, 7,7,7,6, 5,4,3,2, 0,0,0,0,
          7,7,7,0, 7,7,7,6, 5,4,3,2, 1,0,0,0, 
        ],
        [
          0,0,0,0, 0,0,0,6, 7,7,7,7, 7,7,7,0,
          0,0,0,0, 0,0,5,6, 7,7,7,7, 7,7,7,0,
          0,0,0,0, 0,4,5,6, 7,7,7,7, 7,7,7,0,
          0,0,0,0, 3,4,5,6, 7,7,7,7, 7,7,7,0,
          0,0,0,2, 3,4,5,6, 7,7,7,7, 7,7,7,0,
          0,0,1,2, 3,4,5,6, 7,7,7,7, 7,7,7,0,
          0,1,1,2, 3,4,5,6, 7,7,7,7, 7,7,7,0,
        ]
    ];

    //-------- ----------
    // WAVE FORMS
    //-------- ----------
    // old table waveform
    const table_old = CS.WAVE_FORM_FUNCTIONS.table;
    // new table_step waveform that allows for a max_notes samp object option that..
    // is indpepednant of table array length, although it will still default to that
    const table_step = (samp, a_wave ) => {
        const table_count = samp.table.length;
        const freq = samp.frequency === undefined ? 1 : samp.frequency;
        const max_notes = samp.max_notes === undefined ? table_count : samp.max_notes;
        let i_wf = 0;
        let s = 0;
        while(i_wf < table_count ){
            const wf = samp.table[i_wf];
            const wf_samp = CS.WAVE_FORM_FUNCTIONS[wf.waveform](wf, a_wave * freq % 1);
            s += wf_samp;
            i_wf += 1;
        }
        return s * ( 1 / max_notes ) * samp.amplitude;
    };

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        // called once per frame
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {

            fs.array_wave = scene.userData.array_wave = [];
            fs.freq = 1;
            fs.amp = 1;

            // gen table data
            const table_data = [];
            let i3 = 0;
            const max_notes = notes.length;
            while(i3 < max_notes){
                const arr_note = notes[i3];
                const amp_index = arr_note[ Math.floor( arr_note.length * (a_sound2 * (32 * a_sound2) % 1) ) ];
                const amp = amp_index / 10;
                if(amp === 0){
                    i3 += 1;
                    continue;
                }
                table_data.push({
                    waveform: 'sin2',
                    values_per_wave: 60, int_shift: 0,
                    frequency: 2.02 + 2.02 * i3,
                    amplitude: amp
                })
                i3 += 1;
            }

            // table samp object
            const samp_table = {
                amplitude: 1.00,
                frequency: 1.00,
                max_notes: max_notes,
                a_wave : a_sound2,
                table: table_data
            };

            // gen array
            let i2 = 0;
            const len = 1470;
            while(i2 < len){
                const a_frame = i2 / len;
                const s1 = table_step(samp_table, a_frame );
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
        disp_step: 10,
        secs: 60
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

