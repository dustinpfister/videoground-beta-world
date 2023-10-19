/*    video01-03-import-tracks - for audio-generator-midi project
          * more than one track would be nice
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
  '../js/samp_create/waveforms/seedednoise.js',
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
    const uri_file = videoAPI.pathJoin(sm.filePath, '../midi/notes_doom_e1m1_exp2.mid');

    return videoAPI.read( uri_file, { encoding: 'binary', alpha: 0, buffer_size_alpha: 1} )
    .then( (data) => {
        //-------- ----------       
        // midi object, noteon array, total_time
        //-------- ----------
        const midi = MidiParser.Uint8(data);

        let track_index = 0;
        const track_times = [];
        const track_noteon = [];
        while(track_index < midi.tracks){
            track_noteon.push( STM.get_type9_array(midi, track_index) );
            track_times.push( STM.compute_total_midi_time(midi, track_index) );
            track_index += 1;
        }
        const total_time = Math.max.apply(null, track_times);

        const frame_count_frac = total_time * 30;
        const frame_count = Math.floor( frame_count_frac );
        const total_time_adjusted = frame_count / 30;


        const samp_tracks =[
            { waveform:'sawtooth' },
            { waveform:'seedednoise', values_per_wave: 40, freq_alpha: 0.20 },
            { waveform:'sin', values_per_wave: 40, freq_alpha: 0.20 },
            { waveform:'sin', values_per_wave: 40, freq_alpha: 0.20 }
        ];

        //-------- ----------
        // create sound object as ushual, but
        // I now have a data2 array to use with ST.get_tune_sampobj
        //-------- ----------
        const sound = scene.userData.sound = CS.create_sound({
            waveform: 'table_maxch',
            for_sampset: ( sampset, i, a_sound, opt ) => {
                const a_wave = a_sound * opt.secs % 1;
                const table_tracks = [];
                let ti = 0;
                while(ti < midi.tracks ){
                    const arr_noteon = track_noteon[ti];
                    const opt_track = STM.get_track_table_options({
                        amp_mode: 2,
                        amp_max: 1,
                        amp_pad: 0.10,
                        note_index_shift: -30,
                        samp: samp_tracks[ti]
                    });
                    const table = STM.get_track_table_data(midi, arr_noteon, total_time, a_sound, opt_track);
                    table_tracks.push({
                        amplitude: 3,
                        waveform: 'table_maxch',
                        a_wave: a_wave,
                        frequency: 1,
                        maxch: 8,
                        table: table
                    });
                    ti += 1;
                }
                return {
                   amplitude: 1,
                   a_wave: a_wave,
                   frequency: 1,
                   maxch: midi.tracks,
                   table: table_tracks
                };
            },
            disp_step: 1000,
            secs: 60
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

