/*    videoxx-03-draft-merge-down - for samp-pitch-amp-curves
          * maybe the best way to do this is to just merge down 1-bit tracks
          * new bit_merge waveform
          * if any given track has a bit value of 1 the final track value will be 1, else 0

 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
    '../../../js/samp_create/r0/samp_tools.js',
    '../../../js/samp_create/r0/samp_create.js',
    '../../../js/samp_create/r0/samp_draw.js',
    '../js/waveform-bit-merge.js',
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);

    const sound = sud.sound = CS.create_sound({
        waveform : 'bit_merge',
        sample_rate: 44100,
        secs: 1,
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            return fs;
        },
        for_sampset: ( samp, i, a_sound, fs, opt ) => {
            const t1 = Math.sin( Math.PI * 2 * ( 20 * a_sound ) ) < 0 ? 0 : 1;
            const t2 = Math.sin( Math.PI * 2 * ( 80 * a_sound ) ) < 0 ? 0 : 1;
            samp.bit_tracks = [t1,0,t2];
            return samp;
        }
    });
    sud.opt_frame = { w: 1200, h: 300, sy: 200, sx: 40, mode: sound.mode };
    sm.frameMax = sound.frames;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sud = scene.userData;
    // create the data samples
    const data_samples = CS.create_frame_samples(sud.sound, sm.frame, sm.frameMax );
    return CS.write_frame_samples(sud.sound, data_samples, sm.frame, sm.imageFolder, sm.isExport);
};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sud = scene.userData;
    const sound = sud.sound;
    //const alpha = sm.frame / ( sm.frameMax - 1);
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    DSD.draw( ctx, sound.array_frame, sud.opt_frame, 0, 'sample data ( current frame )' );
};

