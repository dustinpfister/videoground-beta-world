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
  '../../../js/samp_create/r0/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);

    // parse string data to roll array, or just return if object
    const parse_data = (data, BBS=4) => {
        if(typeof data === 'object'){
            return data;
        }
        const roll = data.split(/\n|\r\n/).map((e)=>{
            return e.trim().split(' ');
        });
        const push_count = BBS - roll.length % BBS;
        let i = 0;
        while(i < push_count && push_count != BBS){
           roll.push([''])
           i += 1;
        }

        return roll;
    };

    // loop all lines of roll
    const loop_lines = (data, for_line ) => {
        const roll = parse_data(data);
        let i = 0;
        const len = roll.length;
        while(i < len){
           const e = roll[i];
           const r = for_line(e[0], e[1], e[2], e[3] || '', e);
           if(r){
              break;
           }
           i += 1;
        }
    };

    const get_total_secs = (data, BBS=4) => {
        const roll = parse_data(data);
        return roll.length / BBS;
    };

    const note_index_to_freq = (note_index) => {

        if(note_index === ''){
            return 0;
        }

        if(typeof note_index === 'string'){
            const NOTES = 'c-,c#,d-,d#,e-,f-,f#,g-,g#,a-,a#,b-'.split(',');
            const ni = NOTES.findIndex( (str) => { 
                return str === note_index.substr(0,2);
            });
            return ST.notefreq_by_indices( parseInt(note_index.substr(2,1))  , ni);
        }
        return 0;
    };


    //console.log( note_index_to_freq('c-5') );

    let BBS = 4;

    const data = '' +
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

    const roll = parse_data(data);
    //console.log(roll)

    const sound = sud.sound = CS.create_sound({
        waveform : 'seedednoise',
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            const line = roll[ Math.floor( roll.length * a_sound2 ) ];
            const freq = note_index_to_freq(line[0]);
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
        secs: get_total_secs(data, BBS)
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
    // draw frame disp, and info
    DSD.draw( ctx, sound.array_frame, sud.opt_frame, 0, 'sample data ( current frame )' );
    DSD.draw_info(ctx, sound, sm);
};

