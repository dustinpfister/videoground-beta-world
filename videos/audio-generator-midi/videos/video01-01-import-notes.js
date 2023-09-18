/*    video01-01-import-notes - for audio-generator-1 project
          * Just want to work out the process of importing notes
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../js/midi-parser-js/main.js',
  '../js/samp_tools.js',
  '../js/samp_create.js',
  '../js/samp_draw.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    sm.renderer.setClearColor(0x000000, 0.25);



//console.log( MidiParser );

    const uri_file = videoAPI.pathJoin(sm.filePath, '../midi/notes.mid')
    return videoAPI.read( uri_file, { encoding: 'binary', alpha: 0, buffer_size_alpha: 1} )
    .then( (data) => {
        const midi = MidiParser.Uint8(data);
        const track = midi.track[0];
        const event =  track.event;

        const arr_noteon = event.reduce( (acc, obj) => {
            if(obj.type === 9){
               acc.push(obj);
            }
            return acc;
        },[]);

        //console.log( 'full midi object' );
        //console.log( midi );


        //console.log( 'events' );
        //console.log( event );

        //console.log( 'type 9: ' );
        //console.log( arr_noteon );

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
    const freq_per_index = 12.7;
    
    arr_freq.push( ( note_index + 1) * freq_per_index);
}

        });


alphas = alphas.map( (n) => {
   return n / a;
});

// can then create that weird format that I started with the alphas array

//console.log(alphas);

let i_a =  0;
const data2 = [];
while(i_a < alphas.length){

   data2.push(alphas[i_a], alphas[i_a + 1], arr_freq[ Math.floor(i_a / 2) ]);
  
  i_a += 2;
}

console.log(data2)


const obj = ST.get_tune_sampobj(data2, 0.2, 1, false);

console.log(obj);


    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'sin',
        for_sampset: ( sampset, i, a_sound, opt ) => {

            const obj = ST.get_tune_sampobj(data2, a_sound, opt.secs, false);

            sampset.a_wave = obj.a_wave;
            sampset.amplitude = 0.75
            sampset.frequency = obj.frequency;  //80;
            return sampset;
        },
        disp_step: 1,
        secs: 3
    });

    sm.frameMax = sound.frames;



    });

};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){

    const data_samples = CS.create_frame_samples(scene.userData.sound, sm.frame );
    return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.filePath, true);

    //return CS.write_frame_samples(scene.userData.sound, sm.frame, sm.filePath, true);
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

