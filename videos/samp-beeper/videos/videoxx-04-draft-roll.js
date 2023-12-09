/*    videoxx-04-draft-roll - for samp-pitch-amp-curves
          * start what the music roll format should be for this
          * working with bit_merge waveform
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
    '../../../js/samp_create/r0/samp_tools.js',
    '../../../js/samp_create/r0/samp_create.js',
    '../../../js/samp_create/r0/samp_draw.js',
    '../js/waveform-bit-merge.js',
    '../js/samp-tracker-1bit.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);

    const BBS = sud.BBS = 8;


const data = '' +
'c-0 c-0 c-0\n' +
'c-0 c-0 c-3\n'
'c-0 c-0 ---\n'
'c-0 c-0 ---\n'

const roll = sud.roll = STRACK.parse_data(data);

console.log(roll);

const line = STRACK.get_current_params(roll, BBS, 0.5);

console.log(line)


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

    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    DSD.draw( ctx, sound.array_frame, sud.opt_frame, 0, 'sample data ( current frame )' );
};

