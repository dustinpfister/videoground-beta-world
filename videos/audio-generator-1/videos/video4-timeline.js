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

    const sound = scene.userData.sound = {
        waveform: 'table',
        for_sample: ( samp_set, i, a_point ) => {

            const note = timeline_note[ Math.floor( timeline_note.length * a_point ) ];
            const note_range = 8;

            const amp = timeline_amp[ Math.floor( timeline_amp.length * a_point ) ];
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
        mode: 'int16', //  'int16' 'bytes',
        sample_rate: 44100,
        secs: 4,
        disp_offset: new THREE.Vector2(50, 200),
        disp_size: new THREE.Vector2( 1280 - 100, 200),
        array_disp: [],   // data for whole sound
        array_frame: [],  // data for current frame
        frames: 0
    };
    sound.frames = 30 * sound.secs;
    sound.bytes_per_frame = Math.floor(sound.sample_rate / 30 );
    sm.frameMax = sound.frames;
    const total_bytes = sound.sample_rate * sound.secs;
    sound.array_disp = CSP.create_samp_points({
        waveform: sound.waveform,
        for_sample: sound.for_sample,
        i_size: total_bytes,
        i_start:0,
        i_count: total_bytes,
        secs: sound.secs,
        mode: 'raw'
    });
    sound.opt_disp = { w: 1280 - 50 * 2, h: 250, sy: 100, sx: 50, getsamp_lossy: DSD.getsamp_lossy_random };
    sound.opt_frame = { w: 1280 - 50 * 2, h: 250, sy: 400, sx: 50, mode: sound.mode };
    //!!! might not need to do anything with cameras if renderer dome element is not used in render process
    //camera.position.set(2, 2, 2);
    //camera.lookAt( 0, 0, 0 );
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sound = scene.userData.sound;
    const total_bytes = sound.sample_rate * sound.secs;
    const i_start = sound.bytes_per_frame * sm.frame;
    const data_samples =  sound.array_frame = CSP.create_samp_points({
        waveform: sound.waveform,
        for_sample: sound.for_sample,
        i_size : total_bytes,
        i_start : i_start,
        i_count : sound.bytes_per_frame,
        secs: sound.secs,
        mode: sound.mode
    });
    // write data_samples array
    const clear = sm.frame === 0 ? true: false;
    const uri = videoAPI.pathJoin(sm.filePath, 'sampdata');
    if( sound.mode === 'int16'){
        return videoAPI.write(uri, new Int16Array(data_samples), clear );
    }
    return videoAPI.write(uri, new Uint8Array(data_samples), clear );
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
    ctx.fillStyle = 'lime';
    ctx.font = '25px courier';
    ctx.textBaseline = 'top';
    ctx.fillText('frame: ' + sm.frame + '/' + sm.frameMax + '  ( ' + (sound.secs * alpha ).toFixed(2) + ' / ' + sound.secs + ' ) ', 5, 5);
    const sample_depth = sound.mode === 'bytes' ? '8bit' : '16bit';
    ctx.fillText('sample depth@rate : ' +  sample_depth + ' @ ' + (sound.sample_rate / 1000).toFixed(3) + 'kHz' , 5, 35);
    ctx.fillText('wavefrom : ' + sound.waveform + ', bytes_per_frame: ' + sound.bytes_per_frame, 5, 60);
};

