/*    video01-01-test-read - for samp-tracker
          * first test video for samp-tracker where I just want to read a file
          * I want to get note,waveform index, and amp values working
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
        ['sin2', {} ],
        ['seedednoise', {}],
        ['array', { array:[0,0.25,1,0]}]
    ];

    //const uri_file = videoAPI.pathJoin(sm.filePath, 'video01-01-test-scale.txt');
    const uri_file = videoAPI.pathJoin(sm.filePath, 'video01-02-test-hold.txt');

    return videoAPI.read( uri_file, { alpha: 0, buffer_size_alpha: 1} )
    .then( (data) => {



        const roll = sud.roll = STRACK.parse_data(data);




        const sound = sud.sound = CS.create_sound({
            waveform : 'table_maxch', //'seedednoise',
            for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
                // get current param data
                //const line = STRACK.get_current_line_by_alpha(roll, BBS, a_sound2, false, 1);

                const line = STRACK.get_current_params(roll, BBS, a_sound2);

                const freq = STRACK.note_index_to_freq(line[0]);
                if(freq > 0){
                    fs.freq = freq / 30;
                }
                fs.wf_index = parseInt(line[1]) || 0;
                const amp = parseFloat(line[2]);
                fs.amp = String(amp) === 'NaN' ? 0 : amp;
                return fs;
            },
            for_sampset: ( samp, i, a_sound, fs, opt ) => {
                const spf = opt.sound.samples_per_frame;
                const frame = Math.floor(i / spf);
                //const a_sound2 = frame / (opt.secs * 30);
                const a_frame = (i % spf) / spf;
                return {
                    a_wave: a_frame,
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
       const c = line[2] === undefined ? '---' : line[2].padStart(3,'-');
       ctx.fillText(i2 + ' ' + a + ' ' + b + ' ' + c, 80, 100 + 40 * i);
    });
    // draw frame disp, and info
    DSD.draw( ctx, sound.array_frame, sud.opt_frame, 0, 'sample data ( current frame )' );
    DSD.draw_info(ctx, sound, sm);
};

