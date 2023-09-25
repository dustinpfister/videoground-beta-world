/*    video01-03-array-sin - for audio-generator-waveform project
          * working out an idea with sin waves
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

    const sq = {
        objects: []
    };

    sq.objects[0] = {
        alpha: 2 / 5,
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            fs.i_obj = 0;
            return fs;
        },
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.amplitude = 1;
            samp.frequency = 2;
            return samp;  
        }
    };

    sq.objects[1] = {
        alpha: 5 / 5,
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            fs.i_obj = 1;
            return fs;
        },
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.amplitude = 1;
            samp.frequency = 3;
            return samp;  
        }
    }


    const func = (a_h, a1=0.45, a2 = 0.55, amp=1, a_off=0) => {
        let s1 = 0;
        if(a_h > a1 && a_h < a2 ){
            const a = (a_h - a1) / ( a2 - a1);
            s1 = Math.sin( Math.PI * a_off + Math.PI * 2 * a ) * amp;
        }
        return s1;
    };


    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'array',
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {


            ST.applySQFrame(sq, fs, frame, max_frame, a_sound2, opt);

            console.log('0: ' + frame);
            console.log(fs);
            console.log('');

            const a_note = a_sound2 * 10 % 1;
            const array_wave = [];
            let i_h = 0;
            const count_h = 200;
            while(i_h < count_h){
                const a_h = i_h / count_h;
                const amp = Math.sin(Math.PI  * a_note );
                const a1 = 0.45 - 0.25 * a_note;
                const a2 = 0.55 + 0.25 * a_note;
                const s1 = func(a_h, 0.45, 0.55, amp * 1.00, 0);
                const s2 = func(a_h, a1 , a2, amp * 1.00, 0);
                const d1 = 0.25 * a_note;
                const s3 = func(a_h, a1 + d1 * 2, a2 + d1 , amp * 1.00, 0);
                const s4 = func(a_h, a1 - d1, a2 - d1 * 2 , amp * 1.00, 0);
                array_wave.push( ( s1 + s2 + s3 + s4 ) / 4 );
                i_h += 1;
            }
            fs.array_wave = scene.userData.array_wave = array_wave;
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
            samp.frequency = 10;
            ST.applySQ(sq, samp, i, a_sound, opt);
            return samp;
        },
        getsamp_lossy: DSD.getsamp_lossy_pingpong,
        disp_step: 10,
        secs: 5
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

