/*    video01-10-waveform-follinsaw - for audio-generator-1 project
          * seeing about making a cool kind of sawwave based on what I see with a tim follin tune
          * the tune is stage4 of "qhouls 'n' ghosts" for the commodore 64
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

    const sound = scene.userData.sound = CS.create_sound({
        waveform : ( samp, a_wave ) => {
            samp.duty = samp.duty === undefined ? 0.5 : samp.duty;
            const p1 =  samp.p1 === undefined ? 0.75 : samp.p1;
            const p2 =  samp.p2 === undefined ? 0.25 : samp.p2;
            const p3 =  p1 * -1; //-0.75;
            const p4 =  p2 * -1; //-0.25;
            const a = a_wave * samp.frequency % 1;
            let s = THREE.MathUtils.lerp(p3, p4, (a - samp.duty) / (1 - samp.duty ) );
            if(a < samp.duty){
                s = THREE.MathUtils.lerp(p1, p2, a / samp.duty) * samp.amplitude;
            }   
            return s  * samp.amplitude;
        },
        for_sampset: ( samp, i, a_sound, opt ) => {
            samp.a_wave = a_sound * (opt.secs / 2) % 1;
            samp.duty = 0.25 + 0.75 * samp.a_wave; //0.25 + 0.75 * Math.sin( Math.PI * samp.a_wave);
            samp.amplitude = 1;
            samp.p1 = 0.85;
            samp.p2 = 0.15;
            samp.frequency = 80 + 40 * Math.floor( (opt.secs / 2) * a_sound );
            return samp;
        },
        disp_step: 10,
        secs: 10
    });

    sm.frameMax = sound.frames;

};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    return CS.write_frame_samples(scene.userData.sound, sm.frame, sm.filePath, true);
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

