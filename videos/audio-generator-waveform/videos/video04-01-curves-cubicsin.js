/*    videoxx-01-curves-test - for audio-generator-waveform project
      * a Start for using Curves to help with the formation of a waveform
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

    const v_start = new THREE.Vector2(0, 0);
    const v_end = new THREE.Vector2(1, 0);
    const v_c1 = v_start.clone().lerp(v_end, 0.5).add( new THREE.Vector2(0,-1) );
    const v_c2 = v_start.clone().lerp(v_end, 0.5).add( new THREE.Vector2(0,1) );
    const curve = new THREE.CubicBezierCurve(v_start, v_c1, v_c2, v_end);

    const sq = {
        objects: []
    };

    const total_secs = 20;
    const tune = [
        9,9,8,8,7,7,6,6,
        5,5,4,4,3,3,2,2,
        1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,
        2,2,2,2,1,1,1,1,
        2,2,2,2,1,1,1,1,
        2,2,1,1,2,2,1,1,
        2,2,1,1,2,2,1,1,
        2,1,2,1,1,2,1,2,
        2,2,3,3,1,2,1,2,
        2,2,3,3,6,6,6,6,
        5,4,5,4,5,4,5,4,
        5,5,5,5,4,4,3,3,
        2,2,2,2,1,1,1,1,
        1,1,2,2,1,1,4,4,
        1,1,2,2,1,1,4,4,
        1,1,2,2,1,1,6,6,
        1,1,2,2,1,1,6,6,
        6,6,5,5,5,4,3,2,
        1,1,1,1,1,1,1,1,
    ];

    sq.objects[0] = {
        alpha: 0.20,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {
            curve.v1.x = 0.25 + 6.75 * a_object;
            curve.v2.x = 0.25 + 3.75 * a_object;
            curve.v1.y = -1;
            curve.v2.y = 1 + 1.5 * a_object;
            return fs;
        },
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            return samp;  
        }
    };

    sq.objects[1] = {
        alpha: 0.4,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {
            curve.v1.x = 7;
            curve.v2.x = 4;
            curve.v1.y = -1;
            curve.v2.y = 2.5;
            return fs;
        },
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            return samp;  
        }
    };

    sq.objects[2] = {
        alpha: 0.6,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {
            curve.v1.x = 7 - 7 * a_object;
            curve.v2.x = 4;
            curve.v1.y = -1 + 1 * a_object;
            curve.v2.y = 2.5 - 2 * a_object;
            return fs;
        },
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            return samp;  
        }
    };

    sq.objects[3] = {
        alpha: 1,
        for_frame: (fs, frame, max_frame, a_sound2, opt, a_object, sq) => {
            curve.v1.x = 0 + 0.5 + a_object;
            curve.v2.x = 4;
            curve.v1.y = 0 + 2.25 * a_object;
            curve.v2.y = 0.5 - 3.0 * a_object;
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
                fs.array_wave = scene.userData.array_wave = [];



                // frequency and amplitude defaults for frame
                fs.freq = 2 * tune[ Math.floor( tune.length * 0.999 * a_sound2) ]; 
                fs.a_amp = 1;
                fs.count = 500;

                // apply anything for the current sequence object
                ST.applySQFrame(sq, fs, frame, max_frame, a_sound2, opt);

                let i = 0;
                const count = fs.count || 50;
                while(i < count){
                    const v2 = curve.getPoint(i / count);
                    fs.array_wave.push( v2.y * Math.sin(Math.PI * v2.x) );
                    i += 1;
                }





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

