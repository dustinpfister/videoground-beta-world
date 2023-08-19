(function(){
    //-------- ----------
    // DEFAULT FOR SAMPLE FUNCITON
    //-------- ----------
    const DEFAULT_FOR_SAMPLE = ( samp_set, i, a_point ) => {
        samp_set.amplitude = 0.5;
        samp_set.frequency = 160;
        return samp_set;
    };
    //-------- ----------
    // WAVE FORMS
    //-------- ----------
    const WAVE_FORM_FUNCTIONS = {};
    // sin
    WAVE_FORM_FUNCTIONS.sin = (samp_set, i, a_point, opt ) => {
        const wave_count = samp_set.frequency * opt.secs;
        return Math.sin( Math.PI * 2 * wave_count * a_point )  * samp_set.amplitude;
    };
    // sawtooth
    WAVE_FORM_FUNCTIONS.sawtooth = (samp_set, i, a_point, opt ) => {
        const wave_count = samp_set.frequency * opt.secs;
        return -1 * samp_set.amplitude + 2 * ( wave_count * a_point % 1 ) * samp_set.amplitude;
    };
    WAVE_FORM_FUNCTIONS.sawtooth2 = (samp_set, i, a_point, opt ) => {
        const wave_count = samp_set.frequency * opt.secs;
        const low = samp_set.low === undefined ? -1 : samp_set.low;
        const high = samp_set.high === undefined ? 1 : samp_set.high;
        const alpha = wave_count * a_point % 1;
        const low_start = low * samp_set.amplitude;
        const high_end = ( Math.abs( low_start ) + high * samp_set.amplitude )  * alpha 
        return low_start + high_end;
    };
    // table
    WAVE_FORM_FUNCTIONS.table = (samp_set, i, a_point, opt ) => {
        const waveform_count = samp_set.length;
        let i_wf = 0;
        let samp = 0;
        while(i_wf < waveform_count ){
            const wf = samp_set[i_wf];
            const wf_samp = WAVE_FORM_FUNCTIONS[wf.waveform](wf, i, a_point, opt)
            samp += wf_samp;
            i_wf += 1;
        }
        return (samp /= waveform_count) * 4;
    };

    //-------- ----------
    // HELPERS
    //-------- ----------
    const parse_waveform = ( opt ) => {
        let waveform = opt.waveform || WAVE_FORM_FUNCTIONS.sin;
        if(typeof waveform === 'string'){
            waveform = WAVE_FORM_FUNCTIONS[waveform];
        }
        return waveform;
    };
    //-------- ----------
    // PUPLIC FUNCITON
    //-------- ----------
    const create_samp_points = ( opt = {} ) => {
        const i_size = opt.i_size === undefined ? 20 : opt.i_size;
        const i_start = opt.i_start === undefined ? 8 : opt.i_start;
        const i_count = opt.i_count === undefined ? 8 : opt.i_count;
        const secs = opt.secs === undefined ? 1 : opt.secs;
        const mode = opt.mode === undefined ? 'bytes' : opt.mode;
        const step = opt.step === undefined ? 1 : opt.step;
        // what to do for the sample settings object each time
        const for_sample = opt.for_sample || DEFAULT_FOR_SAMPLE;
        // the expression to use with the samp_set object
        const waveform = parse_waveform(opt);
        const sine_points = [];
        let samp_set = {};
        const i_end = i_start + i_count;
        let i = i_start;
        while(i < i_end){
            const a_point = i / i_size;
            samp_set = for_sample(samp_set, i, a_point, opt);
            //const wave_count = samp_set.frequency * opt.secs;
            //let samp = waveform(samp_set, i, a_point, wave_count, opt);
            let samp = waveform(samp_set, i, a_point, opt);
            samp = ST.raw_to_mode(samp, opt.mode);
            sine_points.push( parseFloat( samp.toFixed(2)) );
            i += step;
        }
        return sine_points;
    };
    window.create_samp_points = create_samp_points;
}());
