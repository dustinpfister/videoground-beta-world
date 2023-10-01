/*    videoxx-03-import-wav - for audio-generator-waveform project
          * I would like to read wav files directly
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../js/samp_tools.js',
  '../js/samp_create.js',
  '../js/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    sm.renderer.setClearColor(0x000000, 0.25);
    let array_wave = [];

    const sound_setup = (array_import) => {
        const sound = scene.userData.sound = CS.create_sound({
            waveform : 'array',
            // called once per frame
            for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
                fs.array_wave = scene.userData.array_wave = [];
                let i2 = 0;
                const frames_per_meow = 5; //60 - 45 * a_sound2;
                const i_meow = Math.floor(frame / frames_per_meow );
                const len = Math.floor( array_import.length / frames_per_meow );
                while(i2 < len){
                    const i_import = Math.floor( (frame % frames_per_meow) * len + i2 );
                    //fs.array_wave.push( -0.75 + 1.5 * array_import[i_import] );

fs.array_wave.push( array_import[i_import] )

                    i2 += 1;
                }
                fs.freq = 0.25 + 2.75 * a_sound2;
                fs.a_amp = 1; Math.sin(Math.PI * (frame % frames_per_meow) / frames_per_meow);
                return fs;
            },
            // called for each sample ( so yeah this is a hot path )
            for_sampset: ( samp, i, a_sound, fs, opt ) => {
                const spf = opt.sound.samples_per_frame;
                const a_frame = (i % spf) / spf;
                samp.array = fs.array_wave;
                samp.a_wave = a_frame;
                samp.amplitude = fs.a_amp;
                samp.frequency = fs.freq;
                return samp;
            },
            disp_step: 100,
            //sample_rate: 8000,
            //secs: 0.65,
            secs: 30
        });
        sm.frameMax = sound.frames;
    };

    //const uri_file = videoAPI.pathJoin(sm.filePath, '../sampwav/meow.wav');

const uri_file = videoAPI.pathJoin(sm.filePath, '../sampwav/quack.wav');

    return videoAPI.read( uri_file, { alpha: 0, buffer_size_alpha: 1, encoding:'binary'} )
    .then( (data) => {


const header_uint8 = data.slice(0, 44);
const header_buff = header_uint8.buffer;
const header_dv = new DataView(header_buff);
const data_uint8 = data.slice(44, data.length);
const data_dv = new DataView( data_uint8.buffer );


const chunk_size = header_dv.getUint32(4, true);
const format = header_dv.getUint16(20, true); 
const num_channels = header_dv.getUint16(22, true); 
const sample_rate = header_dv.getUint32(24, true);
const byte_rate = header_dv.getUint32(28, true);


console.log('**********');
console.log('read file: ' + uri_file);

console.log( 'chunk_size  : ' + chunk_size   );
console.log( 'sample rate : ' + sample_rate  );
console.log( 'channels    : ' + num_channels );
console.log( 'format      : ' + format );
console.log( 'byte rate   : ' + byte_rate );





console.log('**********');
console.log('**********');

console.log('creating import array from wav file...');

const array_import = [];
let i_byte = 0;
const len = data_uint8.length; 
while(i_byte < len){
    const samp = data_dv.getInt16(i_byte, true);
    const samp_raw = ST.mode_to_raw(samp, 'int16');

array_import.push(samp_raw);

    i_byte += 2;
}

console.log('**********');



sound_setup(array_import);

    });

};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    // create the data samples
    const data_samples = CS.create_frame_samples(scene.userData.sound, sm.frame, sm.frameMax );
    return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.filePath, true);
};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sound = scene.userData.sound;
    const alpha = sm.frame / ( sm.frameMax - 1);
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    // draw disp
    DSD.draw( ctx, sound.array_disp, sound.opt_disp, sm.frame / ( sm.frameMax - 1 ) );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    DSD.draw( ctx, scene.userData.array_wave, sound.opt_wave, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

