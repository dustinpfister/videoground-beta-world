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
        const wavelength = sampset.wavelength === undefined ? 1 : sampset.wavelength;
        const n = wavelength * Math.floor(sampset.frequency);
        return Math.sin( Math.PI  * n * a_wave )  * sampset.amplitude;
    };
    WAVE_FORM_FUNCTIONS.sin2 = (sampset, a_wave ) => {
        return Math.sin( Math.PI  * 2 * a_wave )  * sampset.amplitude;
    };
    WAVE_FORM_FUNCTIONS.sawtooth = (sampeset, a_wave ) => {
        const a = ( sampeset.frequency * a_wave % 1 );
        return -1 * sampeset.amplitude + 2 * a * sampeset.amplitude;
    };
    WAVE_FORM_FUNCTIONS.pulse = (sampeset, a_wave ) => {
        const duty = sampeset.duty === undefined ? 0.5 : sampeset.duty;
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
    WAVE_FORM_FUNCTIONS.table = (samp, a_wave ) => {
        const table_count = samp.table.length;
        const freq = samp.frequency === undefined ? 1 : samp.frequency;
        let i_wf = 0;
        let s = 0;
        while(i_wf < table_count ){
            const wf = samp.table[i_wf];
            const wf_samp = CS.WAVE_FORM_FUNCTIONS[wf.waveform](wf, a_wave * freq % 1);
            s += wf_samp;
            i_wf += 1;
        }
        return ( s / table_count ) * samp.amplitude;
    };
    WAVE_FORM_FUNCTIONS.array = (samp, a_wave ) => {
        const a = (a_wave * samp.frequency % 1) * samp.array.length;
        const i = Math.floor( a * 0.99 );
        const n = samp.array[ i ];
        return n * samp.amplitude;
    };
    WAVE_FORM_FUNCTIONS.noise = (samp, a_wave ) => {
        const b = 2 * Math.random() * samp.amplitude;
        return b - samp.amplitude;
    };
    WAVE_FORM_FUNCTIONS.seedednoise = (samp, a_wave )=> {
        samp.values_per_wave = samp.values_per_wave === undefined ? 40 : samp.values_per_wave
        samp.array = [];
        let i2 = 0;
        while(i2 < samp.values_per_wave){
            const n = -1 + 2 * THREE.MathUtils.seededRandom( i2 );
            samp.array.push(n);
            i2 += 1;
        }
        const a = (a_wave * samp.frequency % 1) * samp.array.length;
        const i = Math.floor( a * 0.99 );
        const n = samp.array[ i ];
        return n * samp.amplitude;
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
    const CS = {
        WAVE_FORM_FUNCTIONS: WAVE_FORM_FUNCTIONS
    };
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
            sample_rate: opt.sample_rate === undefined ? 44100 : opt.sample_rate,
            secs: opt.secs === undefined ? 10 : opt.secs,
            //disp_offset: new THREE.Vector2(50, 200),
            //disp_size: new THREE.Vector2( 1280 - 100, 200),
            array_disp: [],   // data for whole sound
            array_frame: [],  // data for current frame
            frames: 0,
            ud: {}
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
            sound: sound,
            waveform: sound.waveform,
            for_sampset: sound.for_sampset,
            i_size: sound.total_samps,
            i_start: 0,
            i_count: sound.total_samps,
            secs: sound.secs,
            step: opt.disp_step === undefined ? sound.bytes_per_frame: opt.disp_step,
            mode: 'raw'
        });
        const getsamp_lossy = opt.getsamp_lossy || DSD.getsamp_lossy_random;
        sound.opt_disp = { w: 720 - 160, h: 150, sy: 10 + 75, sx: 80, getsamp_lossy: getsamp_lossy };
        sound.opt_frame = { w: 720 - 160, h: 150, sy: 180 + 75, sx: 80, mode: sound.mode };
        return sound;
    };
    // Build a Wave file buffer
    // base on what I found here
    //https://gist.github.com/also/900023
    //https://ccrma.stanford.edu/courses/422-winter-2023/index.htm
    CS.buildWaveHeader = (opts) => {
        var numFrames = opts.numFrames || 0;     // default to 0 frames
        var numChannels = opts.numChannels || 1; // default to 'mono' (dp edit)
        var sampleRate = opts.sampleRate || 44100;
        var bytesPerSample = opts.bytesPerSample || 2;
        var blockAlign = numChannels * bytesPerSample;
        var byteRate = sampleRate * blockAlign;
        var dataSize = numFrames * blockAlign;
        var buffer = new ArrayBuffer(44);
        var dv = new DataView(buffer);
        var p = 0;
        function writeString(s) {
            for (var i = 0; i < s.length; i++) {
                dv.setUint8(p + i, s.charCodeAt(i));
            }
            p += s.length;
        }
        function writeUint32(d) {
            dv.setUint32(p, d, true);
            p += 4;
        }
        function writeUint16(d) {
            dv.setUint16(p, d, true);
            p += 2;
        }
        writeString('RIFF');              // ChunkID
        writeUint32(dataSize + 36);       // ChunkSize
        writeString('WAVE');              // Format
        writeString('fmt ');              // Subchunk1ID
        writeUint32(16);                  // Subchunk1Size
        writeUint16(1);                   // AudioFormat
        writeUint16(numChannels);         // NumChannels
        writeUint32(sampleRate);          // SampleRate
        writeUint32(byteRate);            // ByteRate
        writeUint16(blockAlign);          // BlockAlign
        writeUint16(bytesPerSample * 8);  // BitsPerSample
        writeString('data');              // Subchunk2ID
        writeUint32(dataSize);            // Subchunk2Size
        return buffer;
    };

    CS.create_frame_samples = (sound, frame = 0) => {
        const i_start = Math.floor(sound.samples_per_frame * frame);
        const data_samples =  sound.array_frame = CS.create_samp_points({
            sound: sound,
            waveform: sound.waveform,
            for_sampset: sound.for_sampset,
            i_size : sound.total_samps,
            i_start : i_start,
            i_count : sound.samples_per_frame,
            secs: sound.secs,
            mode: sound.mode
        });
        return data_samples;
    };

    CS.write_frame_samples = (sound, data_samples, frame = 0, filePath, as_wave = false ) => {
        // write data_samples array
        const clear = frame === 0 ? true: false;
        const fn = as_wave ? 'video.wav' : 'sampdata';
        const uri = videoAPI.pathJoin(filePath, fn);
        //!!! This will need to be adress in another way, just want to get this to work for now.
        if( frame === 0 && as_wave && sound.mode === 'int16' ){
            // what a frame is:
            // http://sporadic.stanford.edu/reference/misc/sage/media/wav.html
            const numChannels = 1;
            const array_header = CS.buildWaveHeader({
                numFrames: sound.sample_rate * numChannels * sound.secs, // a frame is not what you think it is. see the link on this ^
                numChannels: numChannels,        // going with mono alone for audo-generator-1 at least
                sampleRate: sound.sample_rate,   // 44100 is the defualt anyway so just making this exsplisit
                bytesPerSample: 2                // set on 16bit for this project at least
            });
            return videoAPI.write(uri, new Int16Array( array_header ), true )
            .then(()=>{
                return videoAPI.write(uri, new Int16Array(data_samples), false );
            });
        }else{
            if( sound.mode === 'int16'){
                return videoAPI.write(uri, new Int16Array(data_samples), clear );
            }
            return videoAPI.write(uri, new Uint8Array(data_samples), clear );
        }
    };

    // write frame samples
/*
    CS.write_frame_samples = (sound, frame = 0, filePath, as_wave = false ) => {
        const i_start = Math.floor(sound.samples_per_frame * frame);
        const data_samples =  sound.array_frame = CS.create_samp_points({
            sound: sound,
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
        const fn = as_wave ? 'video.wav' : 'sampdata';
        const uri = videoAPI.pathJoin(filePath, fn);
        //!!! This will need to be adress in another way, just want to get this to work for now.
        if( frame === 0 && as_wave && sound.mode === 'int16' ){
            // what a frame is:
            // http://sporadic.stanford.edu/reference/misc/sage/media/wav.html
            const numChannels = 1;
            const array_header = CS.buildWaveHeader({
                numFrames: sound.sample_rate * numChannels * sound.secs, // a frame is not what you think it is. see the link on this ^
                numChannels: numChannels,        // going with mono alone for audo-generator-1 at least
                sampleRate: sound.sample_rate,   // 44100 is the defualt anyway so just making this exsplisit
                bytesPerSample: 2                // set on 16bit for this project at least
            });
            return videoAPI.write(uri, new Int16Array( array_header ), true )
            .then(()=>{
                return videoAPI.write(uri, new Int16Array(data_samples), false );
            });
        }else{
            if( sound.mode === 'int16'){
                return videoAPI.write(uri, new Int16Array(data_samples), clear );
            }
            return videoAPI.write(uri, new Uint8Array(data_samples), clear );
        }
    };
*/
    // append public api to window
    window.CS = CS;
}());
