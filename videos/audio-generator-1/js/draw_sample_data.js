//-------- ----------
// DRAW SAMPLE DATA - AND RELATED METHODS
//-------- ----------
const DSD = {};
DSD.getsamp_lossy_random = (sample_array, i, index_step) => {
    const a = THREE.MathUtils.seededRandom(i);
    const i_delta = Math.floor(a * index_step);
    const samp = sample_array[i + i_delta];
    return samp;
};
DSD.getsamp_lossy_pingpong = ( sample_array, i, index_step ) => {
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
DSD.draw_sample_data = (ctx, sample_array, opt = {} ) => {
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
DSD.draw_sample_box = (ctx, opt, alpha = 0) => {
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
