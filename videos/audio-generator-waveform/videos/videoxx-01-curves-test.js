/*    video03-04-import-b17 - for audio-generator-waveform project

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

    const total_secs = 1;

    sq.objects[0] = {
        alpha: 1,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {


            return fs;
        },
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            return samp;  
        }
    };

    const v_start = new THREE.Vector2(0, 0);
    const v_end = new THREE.Vector2(1, 0);
    const v_c1 = v_start.clone().lerp(v_end, 0.5).add( new THREE.Vector2(0,1.5) );
    const v_c2 = v_start.clone().lerp(v_end, 0.5).add( new THREE.Vector2(0.25,-0.75) );

    const curve = new THREE.CubicBezierCurve(v_start, v_c1, v_c2, v_end);

console.log(curve);

    const sound_setup = (array_import) => {
        const sound = scene.userData.sound = CS.create_sound({
            waveform : 'array',
            // called once per frame
            for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
                fs.array_wave = scene.userData.array_wave = [];

curve.v1.x = 0.8 - 0.8 * a_sound2;

                let i = 0;
                const count = 1000;
                while(i < count){
                    const v2 = curve.getPoint(i / count);                 
                    const i2 = Math.floor(v2.x * count);
                    
                    fs.array_wave[ i2 ] = v2.y;
                    if(fs.array_wave[ i ] === undefined){
                        fs.array_wave[ i ] = v2.y;
                    }

                    i += 1;
                }


                // frequency and amplitude
                fs.freq = 15
               fs.a_amp = 1;

                // apply anything for the current sequence object
                ST.applySQFrame(sq, fs, frame, max_frame, a_sound2, opt);

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

                ST.applySQ(sq, samp, i, a_sound, opt);
                return samp;
            },
            disp_step: 100,
            secs: total_secs
        });
        sm.frameMax = sound.frames;
    };

    const uri_file = videoAPI.pathJoin(sm.filePath, '../sampwav/b17.wav');
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

