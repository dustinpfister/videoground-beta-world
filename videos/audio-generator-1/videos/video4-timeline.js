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
        data_note : [
            {  i_note: 4, count: 8 },
            {  i_note: 0, count: 1 },
            {  i_note: 7, count: 2 },
            {  i_note: 0, count: 1 },
            {  i_note: 7, count: 2 },
            {  i_note: 0, count: 1 },
            {  i_note: 6, count: 2 },
            {  i_note: 0, count: 1 },
            {  i_note: 6, count: 2 },
            {  i_note: 0, count: 1 },
            {  i_note: 4, count: 2 },
            {  i_note: 0, count: 1 },
            {  i_note: 3, count: 8 }

        ]
    };


   const timeline_note = timeline.data_note.map( (obj_note) => {
         const array = [];
         let i_beat = 0;
         while(i_beat < obj_note.count){
             array.push( obj_note.i_note );
             i_beat += 1;
         }
         return array;
    }).flat();

/*
    const timeline_note = [
        4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4, 4,4,4,4,
        0,0,0,0,
        7,7,7,7, 7,7,7,7,
        0,0,0,0,
        7,7,7,7, 7,7,7,7,
        0,0,0,0,
        6,6,6,6, 6,6,6,6,
        0,0,0,0,
        6,6,6,6, 6,6,6,6,
        0,0,0,0,
        4,4,4,4, 4,4,4,4,
        0,0,0,0,
        2,2,2,2, 2,2,2,2, 3,3,4,4, 5,5,6,6, 7,7,7,7, 7,7,7,7, 7,7,6,5, 4,3,2,1
    ];
*/

    const timeline_amp = [
        1,3,5,7, 9,9,9,9, 9,9,9,9, 9,9,9,9, 9,9,9,9, 9,9,9,9, 9,9,9,9, 7,5,3,1,
        0,0,0,0,
        1,3,5,7, 7,5,3,1,
        0,0,0,0,
        1,3,5,7, 7,5,3,1,
        0,0,0,0,
        1,3,5,7, 7,5,3,1,
        0,0,0,0,
        1,3,5,7, 7,5,3,1,
        0,0,0,0,
        1,3,5,7, 7,5,3,1,
        0,0,0,0,
        1,3,5,7, 9,9,9,9, 9,9,9,9, 9,9,9,9, 9,9,9,9, 9,9,9,9, 9,9,9,9, 7,5,3,1
    ];


    const sound = scene.userData.sound = {
        waveform: 'table',
        for_sample: ( samp_set, i, a_point ) => {

            const note = timeline_note[ Math.floor( timeline_note.length * a_point ) ];
            const note_range = 8;

            const amp = timeline_amp[ Math.floor( timeline_amp.length * a_point ) ];
            const a_amp = amp / 9;
            const a_note = note  / note_range;

            return {
                amplitude: a_amp * 1.05,
                table: [
                    {  waveform: 'sin', frequency:  80 * a_note, amplitude: 1 },
                    {  waveform: 'sin', frequency:  160 * a_note, amplitude: 1 },
                    {  waveform: 'sin', frequency:  500 * a_note, amplitude: 0.75 }
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
    sound.array_disp = create_samp_points({
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
    const data_samples =  sound.array_frame = create_samp_points({
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
    // update and draw dom element of renderer
    // this might just be 2d, but for now I will keep this here
    //sm.renderer.render(sm.scene, sm.camera);
    //ctx.drawImage(sm.renderer.domElement, 0, 0, canvas.width, canvas.height);
    DSD.draw_sample_data(ctx, sound.array_disp, sound.opt_disp );
    DSD.draw_sample_box(ctx, sound.opt_disp, sm.frame / ( sm.frameMax - 1 ) );
    DSD.draw_sample_data(ctx, sound.array_frame, sound.opt_frame );
    DSD.draw_sample_box(ctx, sound.opt_frame, 0 );
    // additional plain 2d overlay for status info
    ctx.fillStyle = 'lime';
    ctx.font = '25px courier';
    ctx.textBaseline = 'top';
    ctx.fillText('frame: ' + sm.frame + '/' + sm.frameMax + '  ( ' + (sound.secs * alpha ).toFixed(2) + ' / ' + sound.secs + ' ) ', 5, 5);
    const sample_depth = sound.mode === 'bytes' ? '8bit' : '16bit';
    ctx.fillText('sample depth@rate : ' +  sample_depth + ' @ ' + (sound.sample_rate / 1000).toFixed(3) + 'kHz' , 5, 35);
    ctx.fillText('wavefrom : ' + sound.waveform + ', bytes_per_frame: ' + sound.bytes_per_frame, 5, 60);
};
