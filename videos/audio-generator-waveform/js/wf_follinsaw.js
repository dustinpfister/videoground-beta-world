CS.WAVE_FORM_FUNCTIONS.follinsaw = ( samp, a_wave ) => {
    samp.duty = samp.duty === undefined ? 0.5 : samp.duty;
    const p1 =  samp.p1 === undefined ? 0.75 : samp.p1;
    const p2 =  samp.p2 === undefined ? 0.25 : samp.p2;
    const p3 =  p1 * -1; //-0.75;
    const p4 =  p2 * -1; //-0.25;
    const a = a_wave * samp.frequency % 1;
    let s = THREE.MathUtils.lerp(p3, p4, (a - samp.duty) / (1 - samp.duty ) );
    if(a < samp.duty){
        s = THREE.MathUtils.lerp(p1, p2, a / samp.duty) * samp.amplitude;
    }   
    return s  * samp.amplitude;
};