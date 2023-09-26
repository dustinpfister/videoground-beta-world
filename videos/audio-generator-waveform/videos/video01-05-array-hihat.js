/*    video01-05-array-hihat - for audio-generator-waveform project
          * trying to work out what the deal is for a kind of hihat waveform
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

    const array0 = [];
    const count = 80;
    let i = 0;
    while(i < count){
        array0.push(-0.25 + 0.50 * THREE.MathUtils.seededRandom(i))
        i += 1;
    }
   
    const create_hat_array = (count=100, seed_offset=0) => {
        const array1 = [];
        let i = 0;
        while(i < count){
            let r = -0.50 + 1.0 * THREE.MathUtils.seededRandom(seed_offset + i);
            let a_wave = i / count;
            let a = Math.sin( Math.PI * a_wave );
            array1.push(r * a)
            i += 1;
        }
        return array1
    };

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            let array = array0;

            let n = frame % 8;
            fs.freq = 0.25 + 3.75 * a_sound2;
            if(n === 0){
                fs.freq = 1;
                array = create_hat_array(500, 0);
            }
            
            fs.array_wave = scene.userData.array_wave = array;
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
            samp.amplitude = 0.65;
            
            samp.frequency = fs.freq;
            return samp;
        },
        getsamp_lossy: DSD.getsamp_lossy_pingpong,
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

