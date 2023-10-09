/*    video01-06-lerp-arrays - for audio-generator-waveform project
          * lerping from one array to another
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

    let samp_arrays = [];
    samp_arrays[0] = [
        0.00, 0.13,-0.13, 0.25,-0.25, 0.50,-0.50, 1.00,-1.00, 0.00
    ];
    samp_arrays[1] = [
        0.00, 0.25, 1.00, 0.25, 0.00,-0.25,-1.00,-0.25, 0.00, 0.00
    ];
    samp_arrays[2] = [
        1.00, 1.00, 1.00, 1.00, 1.00,-1.00,-1.00,-1.00,-1.00,-1.00
    ];
    samp_arrays[3] = [
       -1.00,-0.50, 0.00, 0.50, 1.00, 0.75, 0.25,-0.10,-0.25,-1.00
    ];

    const tune = [2,2,4,4,2,2,4,4,2,2,4,4,2,2,4,4,2,2,8,6,4,2,1,1,2,2,1,1,2,2,1,1,2,2,1,1,2,2];

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        // called once per frame
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {

            fs.array_wave = scene.userData.array_wave = [];

            const cycle_per_sec = 4 * a_sound2;
            const len = samp_arrays.length * (cycle_per_sec * opt.secs);
            const a_lerp = a_sound2 *  len % 1;
            const i_arr = Math.floor( len * a_sound2 );


            const arr1 = samp_arrays[ (i_arr + 0) %  samp_arrays.length ];
            const arr2 = samp_arrays[ (i_arr + 1) %  samp_arrays.length ];

            let i = 0;
            const count = 20;
            while(i < count){
                const a = i / count;     
                const s1 = arr1[ Math.floor( arr1.length * a ) ];
                const s2 = arr2[ Math.floor( arr2.length * a ) ];
                let s = THREE.MathUtils.lerp(s1, s2, a_lerp);
                fs.array_wave.push(s);
                i += 1;
            }
            
            fs.amp = 0.75;
            fs.freq = 2 * tune[ Math.floor( tune.length * ( opt.secs / 10 * a_sound2 % 1) ) ];
            return fs;
        },
        // called for each sample ( so yeah this is a hot path )
        for_sampset: ( samp, i, a_sound, fs, opt ) => {
            const spf = opt.sound.samples_per_frame;
            const a_frame = (i % spf) / spf;
            samp.array = fs.array_wave;
            samp.a_wave = a_frame;
            samp.amplitude = fs.amp;
            samp.frequency = fs.freq;
            return samp;
        },
        disp_step: 100,
        secs: 30
    });
    sm.frameMax = sound.frames;
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

