/*    videoxx-02-draft-persec - for samp-pitch-amp-curves
          * trying to work out a per second system
          * new bit waveform
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
                return ['00'];
            }
            return arr.split(' ').map((str)=>{
                let b = str;
                const c = str.split(':');
                if(c.length > 1){
                    b = c;
                }
                return b;
            });
        });
        return roll_lines;
    };

    const get_total_secs = (roll_lines=[]) => {
        return roll_lines.length;
    };


    // total_div_count track_div_count:pitch:duty 
    const roll = '' +
    '07 06:03:50 01:01:90';

    const roll_lines = get_lines(roll);

    console.log(roll_lines);


    const sound = sud.sound = CS.create_sound({
        waveform : (samp, a_wave) => {
            samp.amp = samp.amp === undefined ? 0.45 : samp.amp;
            samp.bit = samp.bit === undefined ? 0 : samp.bit;
            const n = samp.amp * (samp.bit === 0 ? -1 : 1);
            return n;
        },
        sample_rate: 44100,
        secs: get_total_secs(roll_lines),
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {

            fs.line = roll_lines[ Math.floor( roll_lines.length * a_sound2 ) ];
            fs.div_count = parseInt(fs.line[0]);

            //!!! I will not want to do this, but rather find out what the current
            // pitch and duty values should be
            fs.tracks = [];
            let ti = 1, a=0;
            while(ti < fs.line.length){
                a += parseInt(fs.line[ti][0]) / fs.div_count;
                fs.tracks.push( {
                    a: a,
                    pitch: parseInt(fs.line[ti][1]),
                    duty: parseInt(fs.line[ti][2])
                });
                ti += 1;
            }

console.log(fs.tracks);

            return fs;
        },
        for_sampset: ( samp, i, a_sound, fs, opt ) => {

            const a_sec = i % 44100 / 44100;

            //const a = 210 - 2 * Math.floor(10 * a_sound)
            //samp.bit = i % a <= 50 ? 0 : 1;

            samp.bit = 0;
            if(a_sec < 0.75){
                samp.bit = 1;
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

