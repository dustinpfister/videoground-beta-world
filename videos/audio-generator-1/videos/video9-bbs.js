/*    video9-bbs - for audio-generator-1 project
          * beats per second
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

    // note freq
    // https://pages.mtu.edu/~suits/notefreqs.html
    // https://en.wikipedia.org/wiki/Musical_note

    // test song
    // https://sheetmusic-free.com/good-king-wenceslas-sheet-music-christmas-carol/

    // 0=C, 1=C#, 2=D, 3=D#, 4=E, 5=F, 6=F#,  7=G,  8=G#,  9=A, 10=A#, 11=B
    const notefreq_by_indices = ( i_scale = 4, i_note = 5 ) => {
        const a = i_scale - 5;
        const b = i_note + 3;
        return 440 * Math.pow(2, a + b / 12);
    };

    const note_freq = {
        'c' : notefreq_by_indices(5, 0),
        'f' : notefreq_by_indices(5, 5),
        'g' : notefreq_by_indices(5, 7)
    };
/*
    const data = [
        1, 0, note_freq.f,
        1, 1, note_freq.f,
        1, 2, note_freq.f,
        1, 3, note_freq.g,
        1, 4, note_freq.f,
        1, 5, note_freq.f,
        2, 6, note_freq.c
    ];
    const data_index = [ 0,1,2,3,4,5,6,6 ];
*/

    // start-beat-index, end-beat-index, freq
    const note_data = [
        0, 1, note_freq.f,
        1, 2, note_freq.f,
        2, 3, note_freq.f,
        3, 4, note_freq.g,
        4, 5, note_freq.f,
        5, 6, note_freq.c,
        6, 7, note_freq.g,  // should be d
        7, 8, note_freq.c
    ];
    const note_index = [ 0, 1, 2, 3, 4, 5, 6, 7 ];
    //const note_index = [ 0, 1, 2, 3, 4, 5, 6, 6 ];

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'tri',
        for_sampset: ( sampset, i, a_sound, opt ) => {

            // beat index should be solid
            const bbs = 4;
            const i_beat = Math.floor( a_sound * opt.secs * bbs);
            const a_beat = a_sound * opt.secs * bbs % 1;

            // beat index can then be used to get a note index from the note_data array
            const i_note = note_index[ i_beat ];

            // with the note index I can now get a start and end beat index, as well as note frequency
            const sbi = note_data[ i_note * 3 + 0 ];
            const ebi = note_data[ i_note * 3 + 1 ];
            const f = note_data[ i_note * 3 + 2 ];

            // now that I have a start and end beat index I can figure out the beat length
            // and also the alpha value for the wave of the current note
            const beat_length = ebi - sbi;
            //const a_bbs = bbs / beat_length; 
            sampset.a_wave = a_sound * opt.secs * bbs % 1;
            //sampset.a_wave = a_sound * opt.secs * bbs; //( i_beat - sbi ) / beat_length;

sampset.frequency = f / bbs;
sampset.amplitude = a_beat;

/*
            const i_note = Math.floor( a_sound * opt.secs * bbs);
            const i_el = data_index[ i_wave % data_index.length ];
            let d = data[i_el * 3 + 0];
            let s = data[i_el * 3 + 1];
            let f = data[i_el * 3 + 2];
*/

/*
            const i_wave = Math.floor( a_sound * opt.secs * bbs);
            sampset.a_wave = a_sound * opt.secs * bbs % 1;

            const i_el = data_index[ i_wave % data_index.length ];
            let d = data[i_el * 3 + 0];
            let s = data[i_el * 3 + 1];
            let f = data[i_el * 3 + 2];
            sampset.frequency = Math.floor(f / ( bbs * d) );


            const a_note = sampset.a_wave;
            const a_bias = 1 - Math.abs( 0.5 - a_note ) / 0.5;
            sampset.amplitude = a_bias * 0.75;
*/

            return sampset;
        },
        secs: 2
    });
    sm.frameMax = sound.frames;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    return CS.write_frame_samples(scene.userData.sound, sm.frame, sm.filePath);
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