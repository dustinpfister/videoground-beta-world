(function(){
    const STM = {};

    // get type9 (note on) event object array
    STM.get_type9_array = (midi, track_index=0 ) => {
        return midi.track[ track_index ].event.reduce( (acc, obj) => {
            if(obj.type === 9){
               acc.push(obj);
            }
            return acc;
        },[]);
    };
    // compute total time helper
    STM.compute_total_midi_time = (midi, track_index=0) => {
        const arr_noteon = STM.get_type9_array(midi, track_index);
        let t = 0;
        const data_tune = [];
        arr_noteon.forEach( (obj, i) => {
            t += obj.deltaTime;
        });
        return t / midi.timeDivision;
    };
    // get a table array that should work with table, and table_maxch waveforms
    STM.get_track_table_data = (midi, arr_noteon, total_time=10, a_sound=0, note_index_shift=0, amp_mode=0, samp_opt = {} ) => {
        const table = [];
        let i_table=0;
        let t = 0;
        arr_noteon.forEach( (obj, i, arr) => {
            t += obj.deltaTime;
            const sec = t / midi.timeDivision;
            const note_start = obj.data[1] != 0;
            if(note_start){
                const note_index = obj.data[0] + note_index_shift;
                const a_start = sec / total_time
                // get a_end value
                let i2 = i + 1;
                let t2 = t;
                let a_end = a_start;
                while(i2 < arr.length){
                    const obj2 = arr[i2];
                    t2 += obj2.deltaTime;
                    if(obj2.data[0] === obj.data[0] && obj2.data[1] === 0){
                        const sec = t2 / midi.timeDivision;
                        a_end = sec / total_time;
                        break;
                    }
                    i2 += 1;
                }
                //console.log( t, a_start,a_end, note_start, note_index );
                if( a_sound >= a_start && a_sound < a_end ){
                    const a_wave = (a_sound - a_start) / (a_end - a_start);
                    let amp = 1; // amp mode 0
                    if(amp_mode === 1){ // amp mode 1
                        amp = a_wave_sin = Math.sin( Math.PI * a_wave );
                    }
                    if(amp_mode === 2){
                        if(a_wave < 0.10){
                            const a = a_wave / 0.10;
                            amp = 1.00 * a;
                        }
                        if(a_wave > 0.90){
                            const a = 1 - (a_wave - 0.90) / 0.10;
                            amp = 1.00 * a;
                        }
                    }

                    // set element for table
                    table[i_table] = {
                        ni: note_index,
                        a_wave: a_wave,
                        frequency: Math.floor(note_index * 12),
                        amplitude: amp, 
                        waveform: 'sin',
                        //values_per_wave: 60,
                        //freq_alpha: 1.00,
                        //int_shift: 0
                    };
                    i_table += 1;
                }
            }
        });
        // if we have nothing?
        if(table.length === 0){
            table[i_table] = {
                ni: 0,
                a_wave: 0,
                frequency: 0,
                amplitude: 0,
                waveform: 'sin'
            };
        }
        return table;
    };
    window.STM = STM;
}());
