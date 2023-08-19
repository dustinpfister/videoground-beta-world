/*    video1-saw - first video for audio-generator-1 project
          * for this one I just want to try out the 'sawtooth' wavefrom method
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../js/create_samp_points.js',
  '../js/draw_sample_data.js'
];
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    sm.renderer.setClearColor(0x000000, 0.25);
    const sine = scene.userData.sine = {
        waveform: 'sawtooth2',
        for_sample: ( samp_set, i, a_point ) => {
            samp_set.low = -1 + 1.25 * a_point;
            samp_set.high = 1;
            const a_amp =  THREE.MathUtils.pingpong( a_point * 8, 1 );
            samp_set.amplitude = 0.25 + 0.50 * THREE.MathUtils.smoothstep( a_amp, 0, 1 );
            samp_set.frequency = 80 + 120 * THREE.MathUtils.smoothstep( a_point * 4 % 1, 0, 1 );
            return samp_set;
        },
        sample_rate: 44100,
        secs: 3,
        disp_offset: new THREE.Vector2(50, 200),
        disp_size: new THREE.Vector2( 1280 - 100, 200),
        array_disp: [],   // data for whole sound
        array_frame: [],  // data for current frame
        frames: 0
    };
    sine.frames = 30 * sine.secs;
    sine.bytes_per_frame = Math.floor(sine.sample_rate / 30 );
    sm.frameMax = sine.frames;
    const total_bytes = sine.sample_rate * sine.secs;
    sine.array_disp = create_samp_points({
        waveform: sine.waveform,
        for_sample: sine.for_sample,
        i_size: total_bytes,
        i_start:0,
        i_count: total_bytes,
        secs: sine.secs,
        mode: 'raw'
    });
    sine.opt_disp = { w: 1280 - 50 * 2, h: 250, sy: 100, sx: 50, getsamp_lossy: DSD.getsamp_lossy_pingpong };
    sine.opt_frame = { w: 1280 - 50 * 2, h: 250, sy: 400, sx: 50, mode: 'int16' };
    //!!! might not need to do anything with cameras if renderer dome element is not used in render process
    //camera.position.set(2, 2, 2);
    //camera.lookAt( 0, 0, 0 );
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sine = scene.userData.sine;
    const total_bytes = sine.sample_rate * sine.secs;
    const i_start = sine.bytes_per_frame * sm.frame;
    const data_samples =  sine.array_frame = create_samp_points({
        waveform: sine.waveform,
        for_sample: sine.for_sample,
        i_size : total_bytes,
        i_start : i_start,
        i_count : sine.bytes_per_frame,
        secs: sine.secs,
        //mode: 'bytes'
        mode: 'int16'
    });
    // write data_samples array
    const clear = sm.frame === 0 ? true: false;
    const uri = videoAPI.pathJoin(sm.filePath, 'sampdata');
    //return videoAPI.write(uri, new Uint8Array(data_samples), clear )

    return videoAPI.write(uri, new Int16Array(data_samples), clear )

};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sine = scene.userData.sine;
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    // update and draw dom element of renderer
    // this might just be 2d, but for now I will keep this here
    //sm.renderer.render(sm.scene, sm.camera);
    //ctx.drawImage(sm.renderer.domElement, 0, 0, canvas.width, canvas.height);
    DSD.draw_sample_data(ctx, sine.array_disp, sine.opt_disp );
    DSD.draw_sample_box(ctx, sine.opt_disp, sm.frame / ( sm.frameMax - 1 ) );
    DSD.draw_sample_data(ctx, sine.array_frame, sine.opt_frame );
    DSD.draw_sample_box(ctx, sine.opt_frame, 0 );
    // additional plain 2d overlay for status info
    ctx.fillStyle = 'lime';
    ctx.font = '25px courier';
    ctx.textBaseline = 'top';
    ctx.fillText('frame: ' + sm.frame + '/' + sm.frameMax, 5, 5);
    ctx.fillText('sample rate : ' + sine.sample_rate , 5, 35);
    ctx.fillText('bytes_per_frame: ' + sine.bytes_per_frame, 5, 60);
};

