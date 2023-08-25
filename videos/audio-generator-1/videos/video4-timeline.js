/*    video4-timeline - for audio-generator-1 project
          * testing out a timeline feature, for making music
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


    const timeline = {
        freq_per_beat: 512,
        data_note : [
            {  i_note: 4, beats: 8 },
            {  i_note: 0, beats: 1 },
            {  i_note: 7, beats: 2 },
            {  i_note: 0, beats: 1 },
            {  i_note: 7, beats: 2 },
            {  i_note: 0, beats: 1 },
            {  i_note: 6, beats: 2 },
            {  i_note: 0, beats: 1 },
            {  i_note: 6, beats: 2 },
            {  i_note: 0, beats: 1 },
            {  i_note: 4, beats: 2 },
            {  i_note: 0, beats: 1 },
            {  i_note: 3, beats: 8 }

        ]
    };


   const timeline_note = timeline.data_note.map( (obj_note) => {
         const array = [];
         let i_beat = 0;
         while(i_beat < obj_note.beats){
             let i_freq = 0;
             while(i_freq < timeline.freq_per_beat ){

                     array.push(  obj_note.i_note );

                 i_freq += 1;
             }
             i_beat += 1;
         }
         return array;
    }).flat();


    const timeline_amp = timeline.data_note.map( (obj_note) => {
         const array = [];
         let i_beat = 0;
         while(i_beat < obj_note.beats){
             let i_freq = 0;
             while(i_freq < timeline.freq_per_beat ){
                 const a_note = ( ( i_beat  + i_freq / timeline.freq_per_beat ) / obj_note.beats );
                 array.push( Math.sin( Math.PI * a_note ) );
                 i_freq += 1;
             }
             i_beat += 1;
         }
         return array;
    }).flat()

    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'table',
        for_sample: ( samp_set, i, a_sound ) => {
            const note = timeline_note[ Math.floor( timeline_note.length * a_sound ) ];
            const note_range = 8;
            const amp = timeline_amp[ Math.floor( timeline_amp.length * a_sound ) ];
            const a_amp = amp;
            const a_note = note  / note_range;
            return {
                amplitude: a_amp * 1.05,
                table: [
                    {  waveform: 'sin', frequency:  80 * a_note, amplitude: 1.00 },
                    {  waveform: 'sin', frequency:  100 * a_note, amplitude: 1.00 },
                    {  waveform: 'sin', frequency:  120 * a_note, amplitude: 1.00 },
                    {  waveform: 'sin', frequency:  160 * a_note, amplitude: 1.00 },
                    {  waveform: 'sin', frequency:  500 * a_note, amplitude: 1.00 },
                    {  waveform: 'pulse', frequency:  1000 * a_note, amplitude: 0.25 + 0.75 * a_note, duty: 0.25 + 0.5 * a_note }
                ]
            };
        },
        secs: 4
    });

    sm.frameMax = sound.frames;

};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    return CS.write_frame_samples(scene.userData.sound, sm.frame, sm.filePath);
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

