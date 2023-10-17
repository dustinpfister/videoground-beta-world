/*    video03-05-import-b17-sprite - for audio-generator-waveform project
          * first take on using a wav file as a sprite sheet
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

    const sq = {
        objects: []
    };

    const total_secs = 3;
    const playback_secs = 3;

    sq.objects[0] = {
        alpha: 1,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {
            const fpi = 486;
            const fi = 160 + Math.floor( ( 253 - 160 ) * a_object);
            fs.array_wave = scene.userData.array_wave = ST.get_waveform_array2(fs.array_import, fi, 1470 );

if( frame < 10){
    console.log(fs.array_wave.length);
}

            // some additional values I might want to work with...maybe
            //const i_if = Math.floor(frame / fpi );
            //const a_if = (frame % fpi) / fpi;
            //const a_if2 = Math.sin( Math.PI * a_if );
            fs.a_amp = 1;

            return fs;
        },
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            return samp;  
        }
    };



    const sound_setup = (array_import) => {
        const sound = scene.userData.sound = CS.create_sound({
            waveform : 'array',
            // called once per frame
            for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
                fs.array_import = array_import;
                fs.array_wave = scene.userData.array_wave = [0,0];
                // frequency and amplitude
                fs.freq = 1;
                fs.a_amp = 1;
                // apply anything for the current sequence object
                ST.applySQFrame(sq, fs, frame, max_frame, a_sound2, opt);
                return fs;
            },
            // called for each sample ( so yeah this is a hot path )
            for_sampset: ( samp, i, a_sound, fs, opt ) => {
                const spf = (opt.sound.samples_per_frame );
                const a_frame = (i % spf) / spf;
                samp.array = fs.array_wave;
                samp.a_wave = a_frame;
                samp.amplitude = fs.a_amp;
                samp.frequency = fs.freq;
                ST.applySQ(sq, samp, i, a_sound, opt);


if( i < 10){
    //console.log(i, opt.sound.samples_per_frame);
}

                return samp;
            },
            disp_step: 100,
            secs: playback_secs
        });
        sm.frameMax = sound.frames;
    };

    const uri_file = videoAPI.pathJoin(sm.filePath, '../sampwav/b17-sprite.wav');
    return videoAPI.read( uri_file, { alpha: 0, buffer_size_alpha: 1, encoding:'binary'} )
    .then( (data) => {
        const wav = ST.get_wav_obj(data);
        ST.log_wav_info(wav);
        const array_import = ST.get_wav_samp_array(wav);
        sound_setup(array_import);
    });

};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    // create the data samples
    const data_samples = CS.create_frame_samples(scene.userData.sound, sm.frame, sm.frameMax );
    return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.imageFolder, true);
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

