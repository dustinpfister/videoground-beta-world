(function(){
    const ST = {};
    //-------- ----------
    // FOR_SAMPLE Methods to help with the for sample methods used in sound objects
    //-------- ----------
    ST.freq_tune = (alpha=0, tune=[ 1,0,1,1,0,7,0,6,0,5 ], hz_low=80, hz_high=1000 ) => {
        const i_high = Math.max.apply(null, tune);
        const note = tune[ Math.floor( tune.length * alpha * 0.99 ) ];
        if(note === 0){
            return 0;
        }
        return hz_low + ( hz_high - hz_low ) * ( note / i_high );
    };

    ST.freq_step = (alpha=0, hz_start=1000, hz_step=50,  count_step=10, dir=1 ) => {
        return hz_start + hz_step * Math.floor( alpha *  count_step ) * dir
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
