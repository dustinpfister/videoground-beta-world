/*    video01-01-test-read - for samp-tracker
          * first test video for samp-tracker where I just want to read a file
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../../../js/samp_create/r0/samp_tools.js',
  '../../../js/samp_create/r0/samp_create.js',
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
    //console.log( note_index_to_freq('c-5') );
    let BBS = sud.BBS = 8;
    const data = '' +
    '#foo\n' +
    '# foo\n' +
    'c-0 9 1\n' +
    'c#0 0 1\n' +
    'd-0 0 1\n' +
    'd#0 0 1\n' +
    'e-0 9 1\n' +
    'f-0 0 1\n' +
    'f#0 0 1\n' +
    'g-0 0 1\n' +
    'g#0 9 1\n' +
    'a-0 0 1\n' +
    'a#0 0 1\n' +
    'b-0 0 1\n' +
    '# foo\n' +
    'c-1 9 1\n' +
    'c#1 0 1\n' +
    'd-1 0 1\n' +
    'd#1 0 1\n' +
    'e-1 9 1\n' +
    'f-1 0 1\n' +
    'f#1 0 1\n' +
    'g-1 0 1\n' +
    'g#1 9 1\n' +
    'a-1 0 1\n' +
    'a#1 0 1\n' +
    'b-1 0 1\n' +

    'c-2 9 1\n' +
    'c#2 0 1\n' +
    'd-2 0 1\n' +
    'd#2 0 1\n' +
    'e-2 9 1\n' +
    'f-2 0 1\n' +
    'f#2 0 1\n' +
    'g-2 0 1\n' +
    'g#2 9 1\n' +
    'a-2 0 1\n' +
    'a#2 0 1\n' +
    'b-2 0 1\n' +

    'c-3 9 1\n' +
    'c#3 0 1\n' +
    'd-3 0 1\n' +
    'd#3 0 1\n' +
    'e-3 9 1\n' +
    'f-3 0 1\n' +
    'f#3 0 1\n' +
    'g-3 0 1\n' +
    'g#3 9 1\n' +
    'a-3 0 1\n' +
    'a#3 0 1\n' +
    'b-3 0 1\n' +

    'c-4 9 1\n' +
    'c#4 0 1\n' +
    'd-4 0 1\n' +
    'd#4 0 1\n' +
    'e-4 9 1\n' +
    'f-4 0 1\n' +
    'f#4 0 1\n' +
    'g-4 0 1\n' +
    'g#4 9 1\n' +
    'a-4 0 1\n' +
    'a#4 0 1\n' +
    'b-4 0 1\n' +

    'c-5 9 1\n' +
    'c#5 0 1\n' +
    'd-5 0 1\n' +
    'd#5 0 1\n' +
    'e-5 9 1\n' +
    'f-5 0 1\n' +
    'f#5 0 1\n' +
    'g-5 0 1\n' +
    'g#5 9 1\n' +
    'a-5 0 1\n' +
    'a#5 0 1\n' +
    'b-5 0 1\n';

    const roll = sud.roll = STRACK.parse_data(data);

    const sound = sud.sound = CS.create_sound({
        waveform : 'seedednoise',
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {

            const line = STRACK.get_current_line_by_alpha(roll, BBS, a_sound2, false, 1);
    
            const freq = STRACK.note_index_to_freq(line[0]);
            if(freq > 0){
                fs.freq = freq / 30;
            }
            fs.amp = 1;
            return fs;
        },
        for_sampset: ( samp, i, a_sound, fs, opt ) => {
            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_sound2 = frame / (opt.secs * 30);
            const a_frame = (i % spf) / spf;
            samp.a_wave = a_frame;
            samp.amplitude = fs.amp;
            samp.frequency = fs.freq;
            samp.values_per_wave = fs.values_per_wave;
            return samp;
        },
        secs: STRACK.get_total_secs(data, BBS)
    });

    sud.opt_frame = { w: 1200, h: 200, sy: 480, sx: 40, mode: sound.mode };
    sm.frameMax = sound.frames;

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

    ctx.font = '40px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    arr_lines.forEach((line, i) => {
       ctx.fillStyle = 'lime';
       if(i === 0){
           ctx.fillStyle = 'white';
       }
       ctx.fillText(line[0], 100, 100 + 40 * i);
    });


    // draw frame disp, and info
    DSD.draw( ctx, sound.array_frame, sud.opt_frame, 0, 'sample data ( current frame )' );
    DSD.draw_info(ctx, sound, sm);
};

