/*    video01-frame-partitioning - for samp-pitch-amp-curves
          * Just work out the core idea for beeper music
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
    '../../../js/samp_create/r0/samp_tools.js',
    '../../../js/samp_create/r0/samp_create.js',
    '../../../js/samp_create/r0/waveforms/pulse.js',
    '../../../js/samp_create/r0/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);

    // Trying out a system where I div up a frame into slots and tracks
    const SLOTS_PER_FRAME = 4;
    const TRACKS_PER_SLOT = 3;

    const sound = sud.sound = CS.create_sound({
        waveform : 'pulse',
        sample_rate: 44100,
        secs: 10,
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            return fs;
        },
        for_sampset: ( samp, i, a_sound, fs, opt ) => {

            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_sound2 = frame / (opt.secs * 30);
            const a_frame = (i % spf) / spf;


            const i_slot = Math.floor(a_frame * SLOTS_PER_FRAME);
            const a_slot = a_frame * SLOTS_PER_FRAME % 1;

            const i_track = Math.floor(a_slot *  TRACKS_PER_SLOT);
            const a_track = a_slot * TRACKS_PER_SLOT % 1;

            samp.a_wave = a_track;
            samp.amplitude = 0.65;
            samp.frequency = 0;
            samp.duty = 0.50;

            if(i_track === 0){
                const ni = Math.floor(24 * a_sound);
                samp.frequency = ST.notefreq_by_indices( 3, ni) / 30;
            }

            if(i_track === 1){
                const ni = Math.floor(12 * a_sound)
                samp.frequency = ST.notefreq_by_indices( 1, ni ) / 30;
            }

            const fi = frame % 7;
            if(i_track === 2 &&  fi <= 0){
                const ni = Math.floor(48 * a_sound);
                samp.frequency = ST.notefreq_by_indices( 2, ni ) / 30;
            }

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

