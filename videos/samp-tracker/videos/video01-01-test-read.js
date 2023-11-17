/*    video01-01-test-read - for samp-tracker
          * first test video for samp-tracker where I just want to read a file
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../../../js/samp_create/r0/samp_tools.js',
  '../../../js/samp_create/r0/samp_create.js',
  '../../../js/samp_create/r0/waveforms/seedednoise.js',
  '../../../js/samp_create/r0/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);

    const data_to_event_array = (data) => {
        return data.trim().split(/\n|\r\n/).map((e)=>{
            return e.trim().split(' ');
        });
    };

    const get_total_secs = (event_array) => {
        if(typeof event_array === 'string'){
            event_array = data_to_event_array(event_array);
        }
        let secs = 0;
        let i = 0;
        const len = event_array.length;
        let bbs = 8;
        while(i < len){
           const e = event_array[i];
           if(parseInt(e[0]) === 0){
              bbs = parseInt(e[2]);
           }
           if(parseInt(e[0]) === 2){
              secs += parseInt(e[2]) / bbs;
           }
           i += 1;
        }
        return secs;
    };


    let BBS = 8;

    const data = '' +
    '0 0 8\n' +
    '2 0 2 e3\n' +
    '2 0 2 e3\n' +
    '2 0 4 c3\n';

    const event_array = data_to_event_array(data);

console.log(event_array)

    const sound = sud.sound = CS.create_sound({
        waveform : 'seedednoise',
        for_frame : (fs, frame, max_frame, a_sound2, opt ) => {
            return fs;
        },
        for_sampset: ( samp, i, a_sound, fs, opt ) => {
            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_sound2 = frame / (opt.secs * 30);
            const a_frame = (i % spf) / spf;
            samp.a_wave = a_frame;
            samp.amplitude = fs.amp;
            samp.frequency = fs.freq;
            samp.values_per_wave = fs.values_per_wave;
            return samp;
        },
        secs: get_total_secs(data)
    });

    sud.opt_frame = { w: 1200, h: 200, sy: 480, sx: 40, mode: sound.mode };
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
    // draw frame disp, and info
    DSD.draw( ctx, sound.array_frame, sud.opt_frame, 0, 'sample data ( current frame )' );
    DSD.draw_info(ctx, sound, sm);
};

