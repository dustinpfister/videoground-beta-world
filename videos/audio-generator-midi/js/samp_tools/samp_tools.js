(function(){
    const ST = {};
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
    ST.get_tune_sampobj = ( data=[], a_sound=0, secs=1, freq_adjust=true ) => {
        let id = 0;
        const obj = { a_wave: 0, frequency: 0 };
        while(id < data.length){
            const alow = data[id];
            const ahi = data[id + 1];
            const freq = data[id + 2];
            if( a_sound >= alow && a_sound < ahi){
                // fixed a bug where I was getting -range
                const arange = ahi - alow;
                const s = arange * secs;
                obj.a_wave = ( a_sound - alow ) / arange;
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
