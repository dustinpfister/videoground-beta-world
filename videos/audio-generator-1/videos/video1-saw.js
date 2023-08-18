/*    video1-saw - first video for audio-generator-1 project
          * for this one I just want to try out 'sawtooth'
 */

VIDEO.scripts = [
  '../js/create_samp_points.js'
];

//-------- ----------
// DRAW SAMPLE DATA - AND RELATED METHODS
//-------- ----------
const getsamp_lossy_random = (sample_array, i, index_step) => {
    const a = THREE.MathUtils.seededRandom(i);
    const i_delta = Math.floor(a * index_step);
    const samp = sample_array[i + i_delta];
    return samp;
};
const getsamp_lossy_pingpong = ( sample_array, i, index_step ) => {
    const high = i % 2;
    const frame_samps = sample_array.slice( i, i + index_step );
    const a = Math.max.apply(null, frame_samps);
    const b = Math.min.apply(null, frame_samps);
    let samp = b;
    if(high){
        samp = a;
    }
    return samp;
};
const draw_sample_data = (ctx, sample_array, opt = {} ) => {
    const sx = opt.sx === undefined ? 0 : opt.sx;
    const sy = opt.sy === undefined ? 0 : opt.sy;
    const w = opt.w === undefined ? 100 : opt.w;
    const h = opt.h === undefined ? 25 : opt.h;
    const getsamp_lossy = opt.getsamp_lossy || function(sample_array, i ){ return sample_array[i]; };
    const mode = opt.mode || 'raw';
    const sample_count = sample_array.length;
    const disp_hh = h / 2;
    let index_step = 1;
    if( sample_count >= w ){
        index_step = Math.floor( sample_count / w );
    }   
    ctx.strokeStyle = 'lime';
    ctx.linewidth = 3;
    ctx.beginPath();
    let i = 0;
    while(i < sample_count){
        const x = sx + w * ( i / sample_count );
        let samp = 0;
        if( index_step === 1 ){
           samp = sample_array[ i ];
        }
        if(index_step > 1){
           samp = getsamp_lossy(sample_array, i, index_step);
        }
        if(mode === 'bytes'){
            samp = -1 + (samp / 255) * 2;
        }
        const y = sy + disp_hh + samp * disp_hh;
        if(i === 0){
            ctx.moveTo(x, y);
        }
        if(i > 0){
            ctx.lineTo(x, y);
        }
        i += index_step;
    }
    ctx.lineWidth = 3;
    ctx.stroke();
};
const draw_sample_box = (ctx, opt, alpha = 0) => {
    const sx = opt.sx === undefined ? 0 : opt.sx;
    const sy = opt.sy === undefined ? 0 : opt.sy;
    const w = opt.w === undefined ? 100 : opt.w;
    const h = opt.h === undefined ? 25 : opt.h;
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 6;
    ctx.strokeRect(sx, sy, w, h);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillRect(sx, sy, w * alpha, h);
};
//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    sm.renderer.setClearColor(0x000000, 0.25);
    const sine = scene.userData.sine = {
        amplitude: 0.65,
        frequency: 200,
        sample_rate: 32000,
        secs: 5,
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
        waveform: 'sawtooth',
        i_size: total_bytes,
        i_start:0,
        i_count: total_bytes,
        secs: sine.secs,
        mode: 'raw'
    });
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
        waveform: 'sawtooth',
        i_size : total_bytes,
        i_start : i_start,
        i_count : sine.bytes_per_frame,
        secs: sine.secs,
        mode: 'bytes'
    });
    // write data_samples array
    const clear = sm.frame === 0 ? true: false;
    const uri = videoAPI.pathJoin(sm.filePath, 'sampdata');
    return videoAPI.write(uri, new Uint8Array(data_samples), clear )
};
//-------- ----------
// RENDER
//-------- ----------
const opt_disp = { w: 1280 - 50 * 2, h: 250, sy: 100, sx: 50, getsamp_lossy: getsamp_lossy_pingpong };
const opt_frame = { w: 1280 - 50 * 2, h: 250, sy: 400, sx: 50, mode: 'bytes' };
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sine = scene.userData.sine;
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // update and draw dom element of renderer
    // this might just be 2d, but for now I will keep this here
    //sm.renderer.render(sm.scene, sm.camera);
    //ctx.drawImage(sm.renderer.domElement, 0, 0, canvas.width, canvas.height);

    draw_sample_data(ctx, sine.array_disp, opt_disp );
    draw_sample_box(ctx, opt_disp, sm.per );
    draw_sample_data(ctx, sine.array_frame, opt_frame );
    draw_sample_box(ctx, opt_frame, 0 );

    // additional plain 2d overlay for status info
    ctx.fillStyle = 'lime';
    ctx.font = '25px courier';
    ctx.textBaseline = 'top';
    ctx.fillText('frame: ' + sm.frame + '/' + sm.frameMax, 5, 5);
    ctx.fillText('sample rate : ' + sine.sample_rate , 5, 35);
    ctx.fillText('bytes_per_frame: ' + sine.bytes_per_frame, 5, 60);
};

