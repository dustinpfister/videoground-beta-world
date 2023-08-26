(function(){
    //-------- ----------
    // DEFAULT FOR SAMPLE FUNCITON
    //-------- ----------
    const DEFAULT_FOR_SAMPSET = ( sampeset, i, a_sound, opt ) => {
        sampeset.a_wave = ST.get_wave_alpha_totalsecs( a_sound, opt.secs );
        sampeset.amplitude = 0.5;
        sampeset.frequency = 160;
        return sampeset;
    };
    //-------- ----------
    // WAVE FORMS - return should be in what I am calling 'raw' mode ( -1 to 1 )
    //-------- ----------
    const WAVE_FORM_FUNCTIONS = {};
    WAVE_FORM_FUNCTIONS.sin = (sampset, a_wave ) => {
        return Math.sin( Math.PI  * 2 * sampset.frequency * a_wave )  * sampset.amplitude;
    };
    WAVE_FORM_FUNCTIONS.sawtooth = (sampeset, a_wave ) => {
        const a = ( sampeset.frequency * a_wave % 1 );
        return -1 * sampeset.amplitude + 2 * a * sampeset.amplitude;
    };
    WAVE_FORM_FUNCTIONS.pulse = (sampeset, a_wave ) => {
        const duty = sampeset.duty === undefined ? 0.5 : sampeset.duty;
        //const wave_count = sampeset.frequency * opt.secs;
        const a = sampeset.frequency * a_wave % 1;
        if(a < duty){
            return  -1 * sampeset.amplitude;
        }
        return sampeset.amplitude
    };
    WAVE_FORM_FUNCTIONS.square = (sampset, a_wave ) => {
        sampset.duty = 0.5;
        return WAVE_FORM_FUNCTIONS.pulse(sampset, a_wave);
    };
    WAVE_FORM_FUNCTIONS.tri = (sampeset, a_wave ) => {
        const sc = sampeset.step_count === undefined ? 10 : sampeset.step_count;
        const a = sampeset.frequency * a_wave % 1;
        let a_bias = 1 - Math.abs( 0.5 - a ) / 0.5;
        if(sc >= 2){
            a_bias = Math.floor( a_bias * sc) / (sc - 1);
        }
        const amp = sampeset.amplitude; 
        return  amp * -1 + amp * 2 * a_bias;
    };
    WAVE_FORM_FUNCTIONS.table = (sampeset, a_wave ) => {
        const table_count = sampeset.table.length;
        let i_wf = 0;
        let samp = 0;
        while(i_wf < table_count ){
            const wf = sampeset.table[i_wf];
            const wf_samp = WAVE_FORM_FUNCTIONS[wf.waveform](wf, a_wave);
            samp += wf_samp;
            i_wf += 1;
        }
        return ( samp /= table_count ) * sampeset.amplitude;
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
    // PUPLIC API
    //-------- ----------
    const CS = {};
    // create an array of sample values
    CS.create_samp_points = ( opt = {} ) => {
        const i_size = opt.i_size === undefined ? 20 : opt.i_size;
        const i_start = opt.i_start === undefined ? 8 : opt.i_start;
        const i_count = opt.i_count === undefined ? 8 : opt.i_count;
        const mode = opt.mode === undefined ? 'bytes' : opt.mode;
        const step = opt.step === undefined ? 1 : opt.step;
        opt.secs === undefined ? 1 : opt.secs;
        // what to do for the sample settings object each time
        const for_sampset = opt.for_sampset || DEFAULT_FOR_SAMPSET;
        // the expression to use with the sampeset object
        const waveform = parse_waveform(opt);
        const sine_points = [];
        let sampeset = {};
        const i_end = i_start + i_count;
        let i = i_start;
        while(i < i_end){
            const a_sound = i / i_size;
            sampeset = for_sampset(sampeset, i, a_sound, opt);
            const a_wave = sampeset.a_wave === undefined ? ST.get_wave_alpha_totalsecs( a_sound, opt.secs ) : sampeset.a_wave;
            let samp = waveform(sampeset, a_wave);
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
            for_sampset: opt.for_sampset || null,
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
            for_sampset: sound.for_sampset,
            i_size: sound.total_samps,
            i_start: 0,
            i_count: sound.total_samps,
            secs: sound.secs,
            mode: 'raw'
        });
        const getsamp_lossy = opt.getsamp_lossy || DSD.getsamp_lossy_random;
        sound.opt_disp = { w: 1280 - 50 * 2, h: 250, sy: 100, sx: 50, getsamp_lossy: getsamp_lossy };
        sound.opt_frame = { w: 1280 - 50 * 2, h: 250, sy: 400, sx: 50, mode: sound.mode };
        return sound;
    };
    // get frame samples
    CS.write_frame_samples = (sound, frame = 0, filePath ) => {
        const i_start = Math.floor(sound.samples_per_frame * frame);
        const data_samples =  sound.array_frame = CS.create_samp_points({
            waveform: sound.waveform,
            for_sampset: sound.for_sampset,
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
