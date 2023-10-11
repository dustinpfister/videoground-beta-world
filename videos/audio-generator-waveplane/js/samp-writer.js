
//-------- ----------
// SAMP DATA
//-------- ----------

var SW ={};

SW.normal_to_int16 = ( samp = 0 ) => {
    return -32768 + 65535 * THREE.MathUtils.clamp(samp, 0, 1);
};

// build wav file header... Base on what I found here: https://gist.github.com/also/900023
SW.build_wave_header = (opts) => {
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

SW.write_frame_samples = ( data_samples = [], frame=0, filePath, total_secs=5, sample_rate=8000 ) => {
    const clear = frame === 0 ? true: false;
    if(!filePath){
        return;
    }
    const fn = 'video.wav';
    const uri = videoAPI.pathJoin(filePath, fn);
    if( frame === 0 ){
        const numChannels = 1;
        const array_header = SW.build_wave_header({
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
