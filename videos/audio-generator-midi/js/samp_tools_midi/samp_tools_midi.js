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
    //-------- ----------
    // get a table array that should work with table, and table_maxch waveforms
    //-------- ----------
    // get amp helper method
    const get_amp = (a_wave, opt) => {
        const amp_mode = opt.amp_mode;
        const amp_max = opt.amp_max === undefined ? 1 : opt.amp_max;
        const amp_pad = opt.amp_pad === undefined ? 0.1 : opt.amp_pad;
        let amp = amp_max; // mode 0
        if(amp_mode === 1){
           amp = amp_max * Math.sin( Math.PI * a_wave );
        }
        if(amp_mode === 2){
            if(a_wave < amp_pad){
                const a = a_wave / amp_pad;
                amp = amp_max * a;
            }
            const b = 1 - amp_pad;
            if(a_wave > b){
                const a = 1 - (a_wave - b) / amp_pad;
                amp = amp_max * a;
            }
        }
        return amp;
    };
    // get options object
    STM.get_track_table_options = (opt={}) => {
        const opt_track = Object.assign({
            amp_mode: 2,
            amp_max: 1,
            amp_pad: 0.15,
            note_index_shift: 0,
            samp: {
                waveform: 'sin'
            }
        }, opt);
        return opt_track;
    };
    // get the table array
    STM.get_track_table_data = (midi, arr_noteon, total_time=10, a_sound=0, opt=STM.get_track_table_options() ) => {
        const table = [];
        let i_table=0;
        let t = 0;

let end_ct = 0;

        //!!! this is bad news for preformance
//        arr_noteon.forEach( (obj, i, arr) => {
        let i = 0;
        const len = arr_noteon.length;
        while(i < len){
            const obj = arr_noteon[i];

            t += obj.deltaTime;
            const sec = t / midi.timeDivision;
            const note_start = obj.data[1] != 0;
            if(note_start){
                const note_index = obj.data[0] + opt.note_index_shift;
                const a_start = sec / total_time;

                // continue if a_start is greater than a_sound
                if(a_start > a_sound){
                    i += 1;
                    continue;
                }

                // get a_end value
                let i2 = i + 1;
                let t2 = t;
                let a_end = a_start;
                while(i2 < len){
                    const obj2 = arr_noteon[i2];
                    t2 += obj2.deltaTime;
                    if(obj2.data[0] === obj.data[0] && obj2.data[1] === 0){
                        const sec = t2 / midi.timeDivision;
                        a_end = sec / total_time;

end_ct += 1;

                        break;
                    }
                    i2 += 1;
                }
                if( a_sound >= a_start && a_sound < a_end ){
                    const a_wave = (a_sound - a_start) / (a_end - a_start);
                    const amp = get_amp(a_wave, opt);
                    // set element for table
                    table[i_table] = Object.assign({
                        ni: note_index,
                        a_wave: a_wave,
                        frequency: Math.floor(note_index * 12),
                        amplitude: amp
                    }, opt.samp );
                    i_table += 1;
                }
            }

            i += 1;
        }
//        });

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

if(a_sound === 0){

    console.log('zero')
console.log(end_ct);
}

        return table;
    };
    window.STM = STM;
}());
