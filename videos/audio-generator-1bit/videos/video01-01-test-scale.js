/*    video01-01-test-scale - for audio-generator-1bit project
          *  first video just testing out a scale
 */

    // can only do a pulse wave with 1-bit music
    const pulse = (opt, a_wave ) => {
        opt = opt || {};
        opt.duty = opt.duty === undefined ? 0.5 : opt.duty;
        opt.frequency = opt.frequency === undefined ? 10 : opt.frequency;
        opt.amplitude = opt.amplitude || 0;
        const a = opt.frequency * a_wave % 1;
        if(a < opt.duty){
            return  0 * opt.amplitude;
        }
        return opt.amplitude
    };

    const normal_to_int16 = ( samp = 0 ) => {
        return -32768 + 65535 * THREE.MathUtils.clamp(samp, 0, 1);
    };

    // build wav file header... Base on what I found here: https://gist.github.com/also/900023
    const build_wave_header = (opts) => {
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

    const write_frame_samples = ( data_samples = [], frame=0, filePath, total_secs=5, sample_rate=8000 ) => {
        const clear = frame === 0 ? true: false;
        const fn = 'video.wav';
        const uri = videoAPI.pathJoin(filePath, fn);
        if( frame === 0 ){
            const numChannels = 1;
            const array_header = build_wave_header({
                numFrames: sample_rate * numChannels * total_secs,
                numChannels: numChannels,
                sampleRate: sample_rate,
                bytesPerSample: 2
            });
            return videoAPI.write(uri, new Int16Array( array_header ), true )
            .then(()=>{
                return videoAPI.write(uri, new Int16Array( data_samples ), false );
            });
        }
        return videoAPI.write(uri, new Int16Array(data_samples), clear );
    };

//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;

    sm.renderer.setClearColor(0x000000, 0.25);
    
    sm.frameMax = 30;
    sud.total_secs = sm.frameMax / 30;
    sud.sample_rate = 9990;
    sud.samples_per_frame = sud.sample_rate / 30;


};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sud = scene.userData;

    const data_samples = [];
    let i_sample = 0;
    while(i_sample < sud.samples_per_frame ){
        const a_frame = i_sample / sud.samples_per_frame;

        //const samp = Math.floor( Math.random() * 2 );
        const freq = 1;
        const samp = pulse({ frequency: freq, amplitude: 1, duty: 0.5 }, a_frame);

        data_samples.push(  normal_to_int16( 0.1 + 0.8 * samp )  );
        i_sample += 1;
    };

    return write_frame_samples(data_samples, sm.frame, sm.filePath, sud.total_secs, sud.sample_rate );

};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sud = scene.userData;
    const alpha = sm.frame / ( sm.frameMax - 1);
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
};

