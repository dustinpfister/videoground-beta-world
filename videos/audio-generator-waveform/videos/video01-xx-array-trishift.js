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

    const v2_start = new THREE.Vector2(0, -1);
    const v2_end = new THREE.Vector2(1, -1);
    const v2_c1 = new THREE.Vector2(0.25, 1.5);
    const v2_c2 = new THREE.Vector2(0.5, 1.5);

    const curve = new THREE.CubicBezierCurve(v2_start, v2_c1, v2_c2, v2_end);

console.log( curve.getPoint(0.5) );

    const create_tri_shift_array = (count_tri=21, a=0.5) => {
        let i_tri = 0;
        const data_tri = []
        while(i_tri < count_tri){
            const a_wave = i_tri  / count_tri;
            const a_bias = 1 - Math.abs(0.5 - a_wave) / 0.5;
            const samp_tri = -1 + 2 * a_bias;
            //const a_shift = Math.sin( Math.PI * a * ( 1 - a_wave ) )

            const v2 = curve.getPoint(a_wave) 

            //data_tri.push( v2.y ); 

            const i = Math.floor( v2.x * count_tri );
            data_tri[i] = (v2.y + samp_tri) / 2; 

            i_tri += 1;
        }
        return data_tri
    }

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {

            fs.array_wave = scene.userData.array_wave = create_tri_shift_array(23, a_sound2);

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
            samp.amplitude = 1;
            samp.frequency = 4;
            return samp;
        },
        getsamp_lossy: DSD.getsamp_lossy_pingpong,
        disp_step: 1,
        secs: 1
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

