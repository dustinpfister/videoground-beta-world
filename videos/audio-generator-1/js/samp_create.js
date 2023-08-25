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
    // WAVE FORMS - return should be in what I am calling 'raw' mode ( -1 to 1 )
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
        const a_wave = ( wave_count * a_point % 1 );
        return -1 * samp_set.amplitude + 2 * a_wave * samp_set.amplitude;
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
    // tri
    WAVE_FORM_FUNCTIONS.tri = (samp_set, i, a_point, opt) => {
            const sc = samp_set.step_count === undefined ? 10 : samp_set.step_count;
            const wave_count = samp_set.frequency * opt.secs;
            const a_wave = wave_count * a_point % 1;
            let a_bias = 1 - Math.abs( 0.5 - a_wave ) / 0.5;
            if(sc >= 2){
                a_bias = Math.floor( a_bias * sc) / sc;
            }
            const amp = samp_set.amplitude; 
            return  amp * -1 + amp * 2 * a_bias;
    };
    // table
    WAVE_FORM_FUNCTIONS.table = (samp_set, i, a_point, opt ) => {
        const table_count = samp_set.table.length;
        let i_wf = 0;
        let samp = 0;
        while(i_wf < table_count ){
            const wf = samp_set.table[i_wf];
            const wf_samp = WAVE_FORM_FUNCTIONS[wf.waveform](wf, i, a_point, opt)
            samp += wf_samp;
            i_wf += 1;
        }
        return (samp /= table_count) * samp_set.amplitude;
    };
    // square
    WAVE_FORM_FUNCTIONS.square = (samp_set, i, a_point, opt ) => {
            const wave_count = samp_set.frequency * opt.secs;
            const a_wave = wave_count * a_point % 1;
            if(a_wave < 0.5){
                return -1 * samp_set.amplitude ;
            }
            return samp_set.amplitude;
    };
    // pulse ( like square only I can adjust duty )
    WAVE_FORM_FUNCTIONS.pulse = (samp_set, i, a_point, opt ) => {
        const duty = samp_set.duty === undefined ? 0.5 : samp_set.duty;
        const wave_count = samp_set.frequency * opt.secs;
        const a_wave = wave_count * a_point % 1;
        if(a_wave < duty){
            return  -1 * samp_set.amplitude;
        }
        return samp_set.amplitude
    };

//!!! testing out wavefroms here
//let i = 0;
//while(i < 20){
//console.log( WAVE_FORM_FUNCTIONS.sin({ frequency: 80, amplitude: 1 }, 0, i / 19, { secs: 1 }) );
//   i += 1;
//}

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
    // PUPLIC API
    //-------- ----------
    const CS = {};
    // create an array of sample values
    CS.create_samp_points = ( opt = {} ) => {
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
            let samp = waveform(samp_set, i, a_point, opt);
            samp = ST.raw_to_mode(samp, opt.mode);
            sine_points.push( parseFloat( samp.toFixed(2)) );
            i += step;
        }
        return sine_points;
    };
    // create sound object
    CS.create_sound = ( opt = {} ) => {
        const sound = {
            waveform: opt.waveform || 'sin',
            for_sample: opt.for_sample || null,
            mode: 'int16', //  'int16' 'bytes',
            sample_rate: 44100,
            secs: opt.secs === undefined ? 10 : opt.secs,
            disp_offset: new THREE.Vector2(50, 200),
            disp_size: new THREE.Vector2( 1280 - 100, 200),
            array_disp: [],   // data for whole sound
            array_frame: [],  // data for current frame
            frames: 0
        };
        sound.frames = 30 * sound.secs;
        sound.total_samps = sound.sample_rate * sound.secs;
        sound.samples_per_frame = sound.sample_rate / 30;
        sound.bytes_per_frame = sound.samples_per_frame;
        if(sound.mode === 'int16'){
            sound.bytes_per_frame = Math.floor( sound.sample_rate * 2 / 30 );
        }
        // sound display array
        sound.array_disp = CS.create_samp_points({
            waveform: sound.waveform,
            for_sample: sound.for_sample,
            i_size: sound.total_samps,
            i_start: 0,
            i_count: sound.total_samps,
            secs: sound.secs,
            mode: 'raw'
        });
        const getsamp_lossy = opt.getsamp_lossy || DSD.getsamp_lossy_pingpong
        sound.opt_disp = { w: 1280 - 50 * 2, h: 250, sy: 100, sx: 50, getsamp_lossy: getsamp_lossy };
        sound.opt_frame = { w: 1280 - 50 * 2, h: 250, sy: 400, sx: 50, mode: sound.mode };
        return sound;
    };
    // get frame samples
    CS.write_frame_samples = (sound, frame = 0, filePath ) => {
        const i_start = Math.floor(sound.samples_per_frame * frame);
        const data_samples =  sound.array_frame = CS.create_samp_points({
            waveform: sound.waveform,
            for_sample: sound.for_sample,
            i_size : sound.total_samps,
            i_start : i_start,
            i_count : sound.samples_per_frame,
            secs: sound.secs,
            mode: sound.mode
        });
        // write data_samples array
        const clear = frame === 0 ? true: false;
        const uri = videoAPI.pathJoin(filePath, 'sampdata');
        if( sound.mode === 'int16'){
            return videoAPI.write(uri, new Int16Array(data_samples), clear );
        }
        return videoAPI.write(uri, new Uint8Array(data_samples), clear );
    };
    // append public api to window
    window.CS = CS;
}());
