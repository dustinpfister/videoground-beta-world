/*    video01-01-import-notes - for audio-generator-1 project
          * Just want to work out the process of importing notes from MIDI files
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../js/midi-parser-js/main.js',
  '../js/samp_tools/samp_tools.js',
  '../js/samp_create/samp_create.js',
  '../js/samp_create/waveforms/seedednoise.js',
  '../js/samp_draw/samp_draw.js',
  '../js/disp_sound/disp_sound.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    sm.renderer.setClearColor(0x000000, 0.25);
    //-------- ----------
    // READ MIDI FILE
    //-------- ----------
    const uri_file = videoAPI.pathJoin(sm.filePath, '../midi/notes.mid')
    return videoAPI.read( uri_file, { encoding: 'binary', alpha: 0, buffer_size_alpha: 1} )
    .then( (data) => {
        //-------- ----------       
        // parse data to midi object
        //-------- ----------
        const midi = MidiParser.Uint8(data);
        //-------- ----------
        // just use track 0 ( should be only on track in notes.mid anyway )
        //-------- ----------
        const track = midi.track[0];
        //-------- ----------
        // get event array
        //-------- ----------
        const event =  track.event;
        //-------- ----------
        // get array of type 9 ( note on ) events
        //-------- ----------
        const arr_noteon = event.reduce( (acc, obj) => {
            if(obj.type === 9){
               acc.push(obj);
            }
            return acc;
        },[]);
        //-------- ----------
        // start an array of alphas and also get the frequences
        //-------- ----------
        let t = 0;
        let a = 0;
        let alphas = [];
        let arr_freq = []
        arr_noteon.forEach( (obj, i) => {
            t += obj.deltaTime;
            a = t / midi.timeDivision;
            alphas.push(a);
            if(i % 2 === 0){
                const note_index = obj.data[0];
                const freq_per_index = 0.5;  // will want this to be low if using seedednoise wavform
                arr_freq.push( ( note_index + 1) * freq_per_index);
            }
        });
        //-------- ----------
        // convert array of time stamps to 0-1 alpha values
        //-------- ----------
        alphas = alphas.map( (n) => {
            return n / a;
        });
        //-------- ----------
        // I can then create that weird format that works with ST.get_tune_sampobj
        //-------- ----------
        let i_a =  0;
        const data2 = [];
        while(i_a < alphas.length){
            data2.push(alphas[i_a], alphas[i_a + 1], arr_freq[ Math.floor(i_a / 2) ]);
            i_a += 2;
        }
        //-------- ----------
        // create sound object as ushual, but
        // I now have a data2 array to use with ST.get_tune_sampobj
        //-------- ----------
        const sound = scene.userData.sound = CS.create_sound({
            waveform : 'seedednoise',
            for_sampset: ( sampset, i, a_sound, opt ) => {


                const obj = ST.get_tune_sampobj(data2, a_sound, opt.secs, true);
                sampset.a_wave = obj.a_wave;

                sampset.values_per_wave = 40;
                sampset.int_shift = 0;
                sampset.amplitude = 0.75; 
                sampset.frequency = obj.frequency;
                return sampset;
            },
            secs: 12
        });
        //-------- ----------
        // WHOLE SOUND DISP
        //-------- ----------
        scene.userData.array_disp = DS.create_array_disp(sound, { disp_step: 2000 });
        scene.userData.array_disp_opt = DS.create_disp_opt({});
        sm.frameMax = sound.frames;
    });
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const data_samples = CS.create_frame_samples(scene.userData.sound, sm.frame );
    return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.imageFolder, true);
};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sud = scene.userData;
    const sound = sud.sound;
    const alpha = sm.frame / ( sm.frameMax - 1);
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    // draw disp
    DSD.draw( ctx, sud.array_disp, sud.array_disp_opt, sm.frame / ( sm.frameMax - 1 ) );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

