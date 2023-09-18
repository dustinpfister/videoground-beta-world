/*    video01-02-import-sametime - for audio-generator-1 project
          * work like to have a way to play two notes at once
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../js/midi-parser-js/main.js',
  '../js/samp_tools.js',
  '../js/samp_create.js',
  '../js/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    sm.renderer.setClearColor(0x000000, 0.25);

    // get type9 (note on) event object array
    const get_type9_array = (midi, track_index=0 ) => {
        return midi.track[ track_index ].event.reduce( (acc, obj) => {
            if(obj.type === 9){
               acc.push(obj);
            }
            return acc;
        },[]);
    };
    // compute total time helper
    const compute_total_midi_time = (midi, track_index=0) => {
        const arr_noteon = get_type9_array(midi, track_index);
        let t = 0;
        const data_tune = [];
        arr_noteon.forEach( (obj, i) => {
            t += obj.deltaTime;
        });
        return t / midi.timeDivision;
    };


    //-------- ----------
    // READ MIDI FILE
    //-------- ----------
    const uri_file = videoAPI.pathJoin(sm.filePath, '../midi/notes_same.mid')
    return videoAPI.read( uri_file, { encoding: 'binary', alpha: 0, buffer_size_alpha: 1} )
    .then( (data) => {
        //-------- ----------       
        // midi object, noton array, total_time
        //-------- ----------
        const midi = MidiParser.Uint8(data);
        const arr_noteon = get_type9_array(midi, 0);
        const total_time = compute_total_midi_time(midi);
        //-------- ----------
        // work out a way to find a current set of samp objects to use with a table
        //-------- ----------
        const a_sound = 0.25;
        const samp_current = [];
        let t = 0;
        arr_noteon.forEach( (obj, i, arr) => {
            t += obj.deltaTime;
            const sec = t / midi.timeDivision;
            const note_start = obj.data[1] != 0;
            if(note_start){
                const note_index = obj.data[0];
                const a_start = parseFloat( (sec / total_time).toFixed(2));
                // get a_end value
                let i2 = i;
                let t2 = t;
                let a_end = a_start;
                while(i2 < arr.length){
                    const obj2 = arr[i2];
                    t2 += obj2.deltaTime;
                    if(obj2.data[0] === obj.data[0] && obj2.data[1] === 0){
                        const sec = t2 / midi.timeDivision;
                        a_end = parseFloat( (sec / total_time).toFixed(2));
                        break;
                    }
                    i2 += 1;
                }
                console.log( t, a_start,a_end, note_start, note_index );
                if( a_sound >= a_start && a_sound <= a_end){
                    samp_current.push({
                        a_wave: (a_sound - a_start) / (a_end - a_start),
                        ni: note_index,
                        frequency: 10 * note_index,
                        amplitude: 1.00
                    });
                }
            }
        });






        //-------- ----------
        // create sound object as ushual, but
        // I now have a data2 array to use with ST.get_tune_sampobj
        //-------- ----------
        const shift_values = [0, 1000];
        const sound = scene.userData.sound = CS.create_sound({
            waveform : 'seedednoise',
            for_sampset: ( sampset, i, a_sound, opt ) => {
                sampset.a_wave = a_sound;
                sampset.values_per_wave = 40;
                sampset.int_shift = 0; 
                sampset.amplitude = 0.75;
                sampset.frequency = 30;
                return sampset;
            },
            disp_step: 100,
            secs: 3
        });
        sm.frameMax = sound.frames;
    });
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const data_samples = CS.create_frame_samples(scene.userData.sound, sm.frame );
    return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.filePath, true);
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

