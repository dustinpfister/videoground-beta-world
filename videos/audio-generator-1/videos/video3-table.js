/*    video3-table - for audio-generator-1 project
          * testing out the table waveform
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
/*
    const sound = scene.userData.sound = {
        waveform: 'table',
        for_sample: ( samp_set, i, a_point ) => {
            return {
                amplitude: 4,
                table: [
                    {  waveform: 'sin', frequency: 320, amplitude: 0.25 },
                    {  waveform: 'sin', frequency: 160, amplitude: 0.25 },
                    {  waveform: 'sin', frequency:  80, amplitude: 0.25 },
                    {  waveform: 'sin', frequency: 1000, amplitude: 0.25 }
                ]
            };
        },
        mode: 'int16', //  'int16' 'bytes',
        sample_rate: 44100,
        secs: 3,
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
    sound.array_disp = CS.create_samp_points({
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
*/

    const sound = scene.userData.sound = CS.create_sound({
        wavefrom : 'table',
        for_sample: ( samp_set, i, a_point ) => {
            return {
                amplitude: 4,
                table: [
                    {  waveform: 'sin', frequency: 320, amplitude: 0.25 },
                    {  waveform: 'sin', frequency: 160, amplitude: 0.25 },
                    {  waveform: 'sin', frequency:  80, amplitude: 0.25 },
                    {  waveform: 'sin', frequency: 1000, amplitude: 0.25 }
                ]
            };
        },
        secs: 3
    });

    sm.frameMax = sound.frames;


    //!!! might not need to do anything with cameras if renderer dome element is not used in render process
    //camera.position.set(2, 2, 2);
    //camera.lookAt( 0, 0, 0 );
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sound = scene.userData.sound;
    const i_start = Math.floor(sound.samples_per_frame * sm.frame);
    const data_samples =  sound.array_frame = CS.create_samp_points({
        waveform: sound.waveform,
        for_sample: sound.for_sample,
        i_size : sound.total_samps,
        i_start : i_start,
        i_count : sound.samples_per_frame,
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

