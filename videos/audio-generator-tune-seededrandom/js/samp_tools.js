(function(){
    const ST = {};
    //-------- ----------
    // APPLY SQ - methods that helper with 'SeQuence' Objects
    //-------- ----------

    ST.applySQ = ( sq, samp, i, a_sound, opt ) => {
        let i2 = 0;
        const len = sq.objects.length;
        let a_base = 0;
        while( i2 < len ){
            const obj = sq.objects[i2];
            if( a_sound <= obj.alpha ){
                let a_object = ( a_sound - a_base ) /  ( obj.alpha - a_base );
                return obj.for_sampset(samp, i, a_sound, opt, a_object, sq);
            }
            a_base = obj.alpha;
            i2 += 1;
        }
    };

    //-------- ----------
    // FOR_SAMPLE HELPER : to help with the for sample methods used in sound objects
    //-------- ----------
    ST.get_beat_alpha = ( alpha=0, total_secs=1, bps=4) => {
        return bps * total_secs * alpha % 1;
    };
    ST.get_wave_alpha_totalsecs = (a_sound = 0, total_secs = 10) => {
        return a_sound * total_secs % 1;
    };
    //-------- ----------
    // BASIC TUNE TOOLS
    //-------- ----------
    // simple tune frequency helper function, can pass an array of 'note index values'
    // a note index of 0 means silence, while 1 to the max value in the array is the range
    // what the range is can be set by a low and high frequency arguments
    ST.freq_tune = (alpha=0, tune=[ 1,0,1,1,0,7,0,6,0,5 ], hz_low=80, hz_high=1000 ) => {
        const i_high = Math.max.apply(null, tune);
        const note = tune[ Math.floor( tune.length * alpha * 0.99 ) ];
        if(note === 0){
            return 0;
        }
        return hz_low + ( hz_high - hz_low ) * ( note / i_high );
    };
    // step a frequency from a start frequency, by a step frequency, and count of times over an alpha
    // value up or down depending on dir
    ST.freq_step = (alpha=0, hz_start=1000, hz_step=50,  count_step=10, dir=1 ) => {
        return hz_start + hz_step * Math.floor( alpha *  count_step ) * dir
    };
    //-------- ----------
    // ADVANCED TUNE TOOLS
    //-------- ----------
    // https://pages.mtu.edu/~suits/notefreqs.html
    // https://en.wikipedia.org/wiki/Musical_note
    ST.notefreq_by_indices = ( i_scale = 4, i_note = 5 ) => {
        const a = i_scale - 5;
        const b = i_note + 3;
        return 440 * Math.pow(2, a + b / 12);
    };
    ST.create_nf = () => {
        // 0=C, 1=C#, 2=D, 3=D#, 4=E, 5=F, 6=F#, 7=G, 8=G#, 9=A, 10=A#, 11=B
        const array_notes = 'c,c#,d,d#,e,f,f#,g,g#,a,a#,b'.split(',');
        const nf = {
           r: 0,     // r for rest
           rest: 0   // also just rest
        };
        let scale = 0;
        while(scale < 8){
            let ni = 0;
            while(ni < 12){
                const freq = ST.notefreq_by_indices(scale, ni);
                const key = array_notes[ ni ] + scale;
                nf[key] = freq;
                ni += 1;
            }
            scale += 1;
        }
        return nf;
    };
    const get_beat_count = (tune) => {
        let i = 0;
        const len = tune.length;
        let count = 0;
        while(i < len ){
            count += tune[i];
            i += 2;
        }
        return count;
    };
    ST.tune_to_alphas = (tune, nf) => {
        const beat_ct = get_beat_count(tune);
        let a = 0;
        let i = 0;
        const len = tune.length;
        const a_perbeat = 1 / beat_ct;
        const data = [];
        while(i < len ){
            const beat_count = tune[i];
            const note_key = tune[i + 1];
            const freq = nf[ note_key ];
            const d = a_perbeat * beat_count;
            data.push(a, a + d, freq );
            a += d;
            i += 2;
        }
        return data;
    };
    ST.get_tune_sampobj = ( data=[], a_sound=0, secs=1, freq_adjust=true ) => {
        let id = 0;
        const obj = { a_wave: 0, frequency: 0 };
        while(id < data.length){
            const alow = data[id];
            const ahi = data[id + 1];
            const freq = data[id + 2];
            if( a_sound >= alow && a_sound < ahi){
                const arange = alow - ahi;
                const s = arange * secs;
                obj.a_wave = Math.abs( ( a_sound - alow ) / arange);
                obj.a_wavesin = Math.sin( Math.PI * obj.a_wave );
                obj.frequency = freq;
                if(freq_adjust){
                    obj.frequency = freq * s;
                }
                break;
            }
            id += 3;
        }
        return obj;
    };
    //-------- ----------
    // SAMP VALUES: Methods to help with sample values
    //-------- ----------
    ST.get_range = (min, max) => {
        const v_min = new THREE.Vector2( min, 0);
        const v_max = new THREE.Vector2( max, 0);
        return v_min.distanceTo(v_max);
    };
    ST.get_normal = ( samp=0, min=-32768, max=32767 ) => {
        const v_samp = new THREE.Vector2( samp, 0);
        const v_min = new THREE.Vector2( min, 0);
        const range = ST.get_range(min, max);
        return v_samp.distanceTo( v_min ) / range;
    };
    ST.get_raw = ( samp=0, min=0, max=255 ) => {
        const samp_normal = ST.get_normal(samp, min, max);
        return -1 + samp_normal * 2;
    };
    ST.raw_to_mode = ( samp = 0, mode = 'bytes' ) => {
        if(mode === 'bytes'){
           let byte = Math.round( 127.5 + 128 * samp );
           samp = THREE.MathUtils.clamp(byte, 0, 255);
        }
        if(mode === 'int16'){
            samp = ( samp + 1 ) / 2;
            samp = THREE.MathUtils.clamp(samp, 0, 1);
            samp = -32768 + ( 32768 + 32767 ) * samp;
        }
        if(mode === 'normal'){
            samp = ( samp + 1 ) / 2;
            samp = THREE.MathUtils.clamp(samp, 0, 1);
        }
        return samp;
    };
    ST.mode_to_raw = ( samp = 0, mode = 'bytes' ) => {
        if(mode === 'bytes'){
            samp = ST.get_raw( samp, 0, 255 );
        }
        if(mode === 'int16'){
            samp = ST.get_raw( samp, -32768,  32767 );
        }
        return samp;
    };
    window.ST = ST;
}());
