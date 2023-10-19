/*    video01-02-import-sametime - for audio-generator-midi project
          * work like to have a way to play two notes at once
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../js/midi-parser-js/main.js',
  '../js/samp_tools/samp_tools.js',
  '../js/samp_tools_midi/samp_tools_midi.js',
  '../js/samp_create/samp_create.js',
  '../js/samp_create/waveforms/table_maxch.js',
  '../js/samp_create/waveforms/sawtooth.js',
  '../js/samp_draw/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    sm.renderer.setClearColor(0x000000, 0.25);

    //-------- ----------
    // READ MIDI FILE
    //-------- ----------
    // raw file does not work, to type 9 events? why? ... maybe format type 0...
    //const uri_file = videoAPI.pathJoin(sm.filePath, '../midi/notes_doom_e1m1_raw.mid');
    const uri_file = videoAPI.pathJoin(sm.filePath, '../midi/notes_doom_e1m1_exp2.mid');
    const track_index = 1;
    const note_index_shift = 0; //-30;

    return videoAPI.read( uri_file, { encoding: 'binary', alpha: 0, buffer_size_alpha: 1} )
    .then( (data) => {
        //-------- ----------       
        // midi object, noteon array, total_time
        //-------- ----------
        const midi = MidiParser.Uint8(data);
        const arr_noteon = STM.get_type9_array(midi, track_index);
        const total_time = STM.compute_total_midi_time(midi, track_index);
        const frame_count_frac = total_time * 30;
        const frame_count = Math.floor( frame_count_frac );
        const total_time_adjusted = frame_count / 30;

        console.log('midi: ');
        console.log(midi);
        console.log('arr_noteon: ');
        console.log(arr_noteon)
        console.log('total time: ' + total_time );
        console.log('frame count frac : ' + frame_count_frac );
        console.log('frame count : ' + frame_count );
        console.log('total time adjusted: ' + total_time_adjusted );

        //-------- ----------
        // create sound object as ushual, but
        // I now have a data2 array to use with ST.get_tune_sampobj
        //-------- ----------
        const sound = scene.userData.sound = CS.create_sound({
            waveform: 'table_maxch',
            for_sampset: ( sampset, i, a_sound, opt ) => {
                //const table = STM.get_track_table_data(midi, arr_noteon, total_time, a_sound, note_index_shift, 2);


                const table = STM.get_track_table_data(midi, arr_noteon, total_time, a_sound);

                const a_wave = a_sound * opt.secs % 1;
                return {
                   amplitude: 3,
                   a_wave: a_wave,
                   frequency: 1,
                   maxch: 8,
                   table: table
                }
            },
            disp_step: 1000,
            secs: 30
        });
        console.log('sound.frames: ' + sound.frames );
        sm.frameMax = sound.frames;
    });
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const data_samples = CS.create_frame_samples(scene.userData.sound, sm.frame );
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
    //DSD.draw( ctx, sound.array_disp, sound.opt_disp, sm.frame / ( sm.frameMax - 1 ) );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

