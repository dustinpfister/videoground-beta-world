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
    window.ST = ST;
}());
