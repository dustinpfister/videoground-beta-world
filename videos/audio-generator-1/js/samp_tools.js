(function(){
    const ST = {};
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
