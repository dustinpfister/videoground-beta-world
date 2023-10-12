/*    video01-04-array-trishift - for audio-generator-waveform project
          * triangle idea
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

    const create_tri_shift_array = (count_tri=21, adjust1=1, adjust2=1) => {
        let i_tri = 0;
        const data_tri = []
        while(i_tri < count_tri){
            const a_wave = i_tri  / count_tri;
            const a_bias = 1 - Math.abs(0.5 - a_wave) / 0.5;
            const samp_tri = -0.50 + 1.00 * a_bias;
            
            const v2 = new THREE.Vector2(samp_tri, 0);
            const diff = v2.distanceTo( new THREE.Vector2(1, 0) );

            let samp_adjusted = samp_tri + diff * (a_bias * adjust1); 
            if(a_wave >= 0.5 ){
                samp_adjusted = samp_tri - diff * (a_bias * adjust2);
                 
            }
            samp_adjusted = samp_adjusted > 1 ? 1 : samp_adjusted;
            samp_adjusted = samp_adjusted < -1 ? -1 : samp_adjusted;
            data_tri.push(  samp_adjusted );

            i_tri += 1;
        }
        return data_tri
    }

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            let a1 = 0, a2 = 0;
            a1 = 2 * a_sound2;
            a2 = 3 * a_sound2;
            const array = create_tri_shift_array(80, a1, a2);
            fs.array_wave = scene.userData.array_wave = array;
            fs.a_freq = Math.sin(Math.PI * ( a_sound2 * (opt.secs / 4) % 1 ) );

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
            
            samp.frequency = 2 + Math.round(4 * fs.a_freq);
            return samp;
        },
        getsamp_lossy: DSD.getsamp_lossy_pingpong,
        disp_step: 100,
        secs: 12
    });

    sm.frameMax = sound.frames;
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

