/*    video04-04-perframe-array.js - for audio-generator-1 project
          * using the array waveform, and frame by frame alphas
          * using an array of data created from an audacity samp data export ( see README )
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

    // samp data for array waveform
    const data_samp =  [
    0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470,

    0.470, 0.475, 0.480, 0.490, 0.500, 0.505, 0.515, 0.523, 0.525, 0.527, 
    0.530, 0.531, 0.532, 0.530, 0.520, 0.495, 0.485, 0.480, 0.480, 0.475,
    0.490, 0.480, 0.473, 0.472, 0.478, 0.472, 0.471, 0.470, 0.470, 0.470,

    0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470,
    0.500, 0.500, 0.500, 0.500, 0.520, 0.520, 0.520, 0.520, 0.500, 0.500,
    0.500, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470

    //0.500, 0.490, 0.486, 0.471, 0.473, 0.471, 0.471, 0.470, 0.472, 0.482,
    //0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470,
    //0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470, 0.470
    ].map( (n) => {
        return ( n * 2 - 1 ) * 14;
    });


    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        for_sampset: ( samp, i, a_sound, opt ) => {


            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_frame = (i % spf) / spf;

            samp.a_wave = a_frame; //obj.a_wave; //a_frame;
            samp.array = data_samp;
            samp.amplitude = 1;
            samp.frequency = Math.floor( Math.pow(2, 8 * a_sound) );

            //samp.a_wave = a_sound;
            //samp.frequency = 1;

            return samp;

        },
        disp_step: 5,
        secs: 30
    });


    console.log(sound);

    sm.frameMax = sound.frames;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    return CS.write_frame_samples(scene.userData.sound, sm.frame, sm.filePath);
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
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

