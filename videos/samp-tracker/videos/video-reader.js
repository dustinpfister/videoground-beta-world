/*    video-reader - for samp-tracker
          * This is a common 'reader' video to read a music roll file
          * I want to get note, waveform index, and amp values working
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../../../js/samp_create/r0/samp_tools.js',
  '../../../js/samp_create/r0/samp_create.js',
  '../../../js/samp_create/r0/waveforms/table_maxch.js',
  '../../../js/samp_create/r0/waveforms/array.js',
  '../../../js/samp_create/r0/waveforms/seedednoise.js',
  '../../../js/samp_create/r0/samp_draw.js',
  '../js/samp-tracker.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);

    const BBS = sud.BBS = 8;

    const WAVEFORM_MAP = [
        ['sin', {} ],
        ['seedednoise', {}],
        ['array', { array:[0,0.25,1,0] }]
    ];

    //const uri_file = videoAPI.pathJoin(sm.filePath, 'video01-01-test-scale.txt');
    const uri_file = videoAPI.pathJoin(sm.filePath, 'video01-04-test-awave.txt');

    return videoAPI.read( uri_file, { alpha: 0, buffer_size_alpha: 1} )
    .then( (data) => {



        const roll = sud.roll = STRACK.parse_data(data);

        //console.log('**********');
        //const a = STRACK.get_current_params(roll, BBS, 0.05);
        //console.log(a);
        //console.log('**********');

        const sound = sud.sound = CS.create_sound({
            waveform : 'table_maxch', //'seedednoise',
            for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
                // get current param data
                //const line = STRACK.get_current_line_by_alpha(roll, BBS, a_sound2, false, 1);

                const line = STRACK.get_current_params(roll, BBS, a_sound2);

                const line_param = line.slice(4, line.length);
                let p = [];
                let p_index = 0;
                let p_value = 1;
                let p_total = 1;
                if(line_param.length > 0){
                   // get the param index, and then values after ':'
                   p = line_param[0].split(':');
                   const e = p[1].split(',');
                   p_index = parseInt(p[0]);
                   // how values after ':' are treated will depend on the index
                   // for now I can just to a parseInt though for 0
                   p_value = parseInt(e[0]);
                   p_total = parseInt(e[1]);
                }
                const p_alpha = 1 - p_value /p_total;


                //!!! geting a 'p_alpha' value now, but this will need to be adjusted for a frame by frame value
                const fpa = 30 / BBS;
                const p_alpha_adjust = frame % fpa / fpa / p_total;

                fs.p_alpha = p_alpha;
                fs.p_alpha_adjusted = p_alpha + p_alpha_adjust;


console.log(fs.p_alpha_adjusted);

                const freq = STRACK.note_index_to_freq(line[1]);
                if(freq > 0){
                    //fs.freq = freq / 30;
                    fs.freq = 1;
                    //fs.freq = freq;
                }
                fs.wf_index = parseInt(line[2]) || 0;
                const amp = parseFloat(line[3]);
                fs.amp = String(amp) === 'NaN' ? 0 : amp;
                return fs;
            },
            for_sampset: ( samp, i, a_sound, fs, opt ) => {

                const spf = opt.sound.samples_per_frame;
                const frame = Math.floor(i / spf);

//const i2 = i - 44100 * frame;
//const a2 = i2 / 44100;
//const a3 = 0.03333 * a2; 

                //const a_sound2 = frame / (opt.secs * 30);
                //const a_frame = (i % spf) / spf;

                const total_secs = opt.max_frame / 30;

                return {

                    //!!! I might want to go with an expression such as this for a_wave
                    // and then use fs.alpha to adjust other things
                    a_wave: a_sound * total_secs % 1,

                    //!!! This is starting to look good but I will need to refine things still
                    // as this is not tied to secs
                    //a_wave: fs.p_alpha_adjusted + a3,

                    //!!! trying out fs.p_alpha for this
                    // what I need to do now is figure out how to set a final a_wave value for each sample
                    //a_wave: (fs.p_alpha + a_frame) % 1,

                    //!!! this expression seems to work to set things to the number of lines
                    // but will not be in sync with per second which is not what I want
                    //a_wave: (fs.p_alpha + a_frame) / 2,


                    //a_wave: (fs.p_alpha + a_frame) % 1,
                    
                    //a_wave: a_frame,




                    frequency: 1,
                    amplitude: 1,
                    maxch: 1,
                    table: [
                        { waveform: WAVEFORM_MAP[fs.wf_index][0], frequency: fs.freq, amplitude: fs.amp}
                    ]
                }
            },
            secs: STRACK.get_total_secs(data, BBS)
        });
        sud.opt_frame = { w: 1200, h: 200, sy: 480, sx: 40, mode: sound.mode };
        sm.frameMax = sound.frames;
    });
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sud = scene.userData;
    // create the data samples
    const data_samples = CS.create_frame_samples(sud.sound, sm.frame, sm.frameMax );
    return CS.write_frame_samples(sud.sound, data_samples, sm.frame, sm.imageFolder, sm.isExport);
};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sud = scene.userData;
    const sound = sud.sound;
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    // draw current tracker data
    const arr_lines = STRACK.get_current_line_by_alpha(sud.roll, sud.BBS, sm.per, false, 8);
    const i_line = STRACK.get_current_line_by_alpha(sud.roll, sud.BBS, sm.per, true, 1);
    ctx.font = '40px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    arr_lines.forEach((line, i) => {
       ctx.fillStyle = 'lime';
       if(i === 0){
           ctx.fillStyle = 'white';
       }
       const i2 = String(i_line + i).padStart(4, '.');
       const a = line[0] === undefined ? '---' : line[0].padStart(3,'-');
       const b = line[1] === undefined ? '---' : line[1].padStart(3,'-');
       const c = line[2] === undefined ? '----' : line[2].padStart(4,'-');
       ctx.fillText(i2 + ' ' + a + ' ' + b + ' ' + c, 80, 100 + 40 * i);
    });
    // draw frame disp, and info
    DSD.draw( ctx, sound.array_frame, sud.opt_frame, 0, 'sample data ( current frame )' );
    DSD.draw_info(ctx, sound, sm);
};

