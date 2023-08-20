/*    video1-saw - for audio-generator-1 project
          * for this one I just want to try out the 'sawtooth' wavefrom method
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

    const sound = scene.userData.sound = {
        waveform: 'sawtooth2',
        for_sample: ( samp_set, i, a_point ) => {
            samp_set.low = -1 + 1.25 * a_point;
            samp_set.high = 1;
            const a_amp =  THREE.MathUtils.pingpong( a_point * 8, 1 );
            samp_set.amplitude = 0.25 + 0.50 * THREE.MathUtils.smoothstep( a_amp, 0, 1 );
            samp_set.frequency = 200 + 1600 * THREE.MathUtils.smoothstep( a_point * 4 % 1, 0, 1 );
            return samp_set;
        },
        mode: 'int16', //  'int16' 'bytes',
        sample_rate: 44100,
        secs: 1,
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

