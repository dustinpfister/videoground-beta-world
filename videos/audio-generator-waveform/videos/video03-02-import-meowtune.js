/*    video03-02-import-meowtune - for audio-generator-waveform project
          * trying something out
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

    const tune = [
        4,4,4,5,4,4,1,2, 1,2,3,4, 4,
        4,4,4,5,4,4,1,2, 1,2,3,4, 4,
        8,7,6,5,6,4,
        2,1,2,3,4,4,
        1,1,2,3,4,4,5,
        8,7,6,5,4,6,4
    ];

    const sound_setup = (array_import) => {
        const total_secs = tune.length * 0.25;
        const sound = scene.userData.sound = CS.create_sound({
            waveform : 'array',
            // called once per frame
            for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
                fs.array_wave = scene.userData.array_wave = [];
                let i2 = 0;
                const frames_per_meow = 7.5;
                const i_meow = Math.floor(frame / frames_per_meow );
                const len = Math.floor( array_import.length / frames_per_meow );
                while(i2 < len){
                    const i_import = Math.floor( (frame % frames_per_meow) * len + i2 );
                    fs.array_wave.push( -0.75 + 1.5 * array_import[i_import] );
                    i2 += 1;
                }
                const ti = tune[ i_meow % tune.length ];
                fs.freq = 1 / 16 * (1 + ti);
                fs.a_amp = 0;
                if(ti > 0){
                    fs.a_amp = 1;
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
                return samp;
            },
            disp_step: 100,
            secs: total_secs
        });
        sm.frameMax = sound.frames;
    };

    const uri_file = videoAPI.pathJoin(sm.filePath, '../sampdata/meow.json');
    return videoAPI.read( uri_file, { alpha: 0, buffer_size_alpha: 1} )
    .then( (str_json) => {
        const obj = JSON.parse(str_json);
        const array_import = obj.sampdata.split(',').map((str) => {
            return parseFloat(str);
        });
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

