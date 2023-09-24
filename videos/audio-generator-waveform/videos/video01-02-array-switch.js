/*    video01-02-array-switch - for audio-generator-waveform project
          * more than one array
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

    const array_options = [
        [ 0.00 ],
        [
          0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,
          0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,
          0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,
          0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,

         -0.50, -0.50, -0.50, -0.50, -0.50, -0.50, -0.50, -0.50,
         -0.50, -0.50, -0.50, -0.50, -0.50, -0.50, -0.50, -0.50,
         -0.50, -0.50, -0.50, -0.50, -0.50, -0.50, -0.50, -0.50,
         -0.50, -0.50, -0.50, -0.50, -0.50, -0.50, -0.50, -0.50,

          0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,
          0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,
          0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,
          0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50,  0.50
        ],
        [
          0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,
         -0.39,  0.10,  0.74,  0.12, -0.28,  0.44,  0.09,  0.80,
          0.43, -0.27,  0.45, -0.04, -0.39,  0.54, -0.88, -0.72,
          0.11, -0.31,  0.38,  0.14, -0.33,  0.28, -0.10,  0.22,
          0.13,  0.24, -0.05,  0.16,  0.00,  0.00,  0.00,  0.00,
          0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00
        ],
        [ 0.00,  0.50,  0.50,  0.00, -0.50, -0.50,  0.00,  0.00 ],
        [ 0.00,  0.25, -0.75,  0.75,  0.75, -0.75,  0.25,  0.00 ]

    ];

    const indices = [
        1,1,2,2,3,3,4,4, 1,1,2,2,3,3,4,4, 1,1,2,2,3,3,4,4, 1,1,2,2,3,3,4,4,
    ];

    const sq = {
        objects: []
    };

    sq.objects[0] = {
        alpha: 5 / 20,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.frequency = 3;
            return samp;  
        }
    };

    sq.objects[1] = {
        alpha: 10 / 20,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            //samp.frequency = 3 + 3 * a_object;
            //samp.frequency = 3 + 3 * ( Math.pow(2, a_object) / 2 );
            //samp.frequency = 3 + Math.pow(2, Math.log(3 * a_object ) / Math.log(2) );
            //samp.frequency = 3 + 3 * ( Math.floor( 30 / 2 * a_object) * 2 );
            //samp.frequency = 3 + 3 * ( Math.floor( 100 * a_object / 2) * 2 / 100 );

samp.frequency = 3 + 3 * Math.pow(2, 1 * a_object ) / Math.pow(2, 1);

            return samp;  
        }
    };

    sq.objects[2] = {
        alpha: 15 / 20,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.frequency = 6;
            return samp;  
        }
    };

    sq.objects[3] = {
        alpha: 20 / 20,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.frequency = 6 - 6 * Math.pow(2, 1 * a_object ) / Math.pow(2, 1);
            return samp;  
        }
    };

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        // called once per frame
        for_frame : (fs, frame, max_frame, a_sound2 ) => {
            const i_a1 = indices[ Math.floor( indices.length * (a_sound2 * 4 % 1) ) ];
            fs.array_wave = scene.userData.array_wave = array_options[ i_a1 ];
            return fs;
        },
        // called for each sample ( so yeah this is a hot path )
        for_sampset: ( samp, i, a_sound, fs, opt ) => {

            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_sound2 = frame / (opt.secs * 30);
            const a_frame = (i % spf) / spf;

            samp.array = fs.array_wave;
            samp.a_wave = a_frame;
            samp.amplitude = 0.75;

            samp.frequency = Math.floor( 100 / 30 );

            ST.applySQ(sq, samp, i, a_sound, opt);

            return samp;
        },
        disp_step: 100,
        secs: 20
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

