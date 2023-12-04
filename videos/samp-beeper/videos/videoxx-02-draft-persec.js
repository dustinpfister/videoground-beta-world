/*    videoxx-01-draft-slots - for samp-pitch-amp-curves
          * Just trying to work out a core idea for beeper music
          * this way I am thinking in terms of breaking each frame down into slots
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
    '../../../js/samp_create/r0/samp_tools.js',
    '../../../js/samp_create/r0/samp_create.js',
    //'../../../js/samp_create/r0/waveforms/pulse.js',
    '../../../js/samp_create/r0/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);


    const get_lines = (roll='') => {
        const roll_lines = roll.split(/\n|\r\n/).map((arr) => {
            if(arr === ''){
                return ['00', '00', '00' ];
            }
            return arr.split(' ');
        });
        return roll_lines;
    };

    const get_total_secs = (roll_lines=[]) => {
        return roll_lines.length;
    };


    const sound = sud.sound = CS.create_sound({
        waveform : (samp, a_wave) => {
            samp.amp = samp.amp === undefined ? 0.45 : samp.amp;
            samp.bit = samp.bit === undefined ? 0 : samp.bit;
            const n = samp.amp * (samp.bit === 0 ? -1 : 1);
            return n;
        },
        sample_rate: 44100,
        secs: 10,
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            return fs;
        },
        for_sampset: ( samp, i, a_sound, fs, opt ) => {
            const a = 210 - 2 * Math.floor(10 * a_sound)
            samp.bit = i % a <= 50 ? 0 : 1;
            return samp;
        }
    });
    sud.opt_frame = { w: 1200, h: 100, sy: 580, sx: 40, mode: sound.mode };
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

