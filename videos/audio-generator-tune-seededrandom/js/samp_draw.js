//-------- ----------
// DRAW SAMPLE DATA - AND RELATED METHODS
//-------- ----------
(function(){
    const DSD = {};
    DSD.getsamp_lossy_random = (sample_array, i, index_step, c) => {
        const a = THREE.MathUtils.seededRandom(i);
        const i_delta = Math.floor(a * index_step);
        const samp = sample_array[i + i_delta];
        return samp;
    };
    DSD.getsamp_lossy_pingpong = ( sample_array, i, index_step, c ) => {
        const high = c % 2 === 0;
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
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 4;
        ctx.beginPath();
        let i = 0, c = 0;
        while(i < sample_count){
            const x = sx + w * ( i / sample_count );
            let samp = 0;
            if( index_step === 1 ){
               samp = sample_array[ i ];
            }
            if(index_step > 1){
               samp = getsamp_lossy(sample_array, i, index_step, c);
            }
            samp = ST.mode_to_raw(samp, mode);
            const y = sy + disp_hh + samp * disp_hh * -1;
            if(i === 0){
                ctx.moveTo(x, y);
            }
            if(i > 0){
                ctx.lineTo(x, y);
            }
            i += index_step;
            c += 1;
        }
        ctx.stroke();
    };

    const draw_midline = (ctx, sx, sy, w, h) => {
        // mid line
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        const y = sy + h / 2;
        ctx.beginPath();
        ctx.moveTo(sx, y);
        ctx.lineTo(sx + w, y);
        ctx.stroke();
    };

    DSD.draw_sample_box = (ctx, opt, alpha = 0) => {
        const sx = opt.sx === undefined ? 0 : opt.sx;
        const sy = opt.sy === undefined ? 0 : opt.sy;
        const w = opt.w === undefined ? 100 : opt.w;
        const h = opt.h === undefined ? 25 : opt.h;
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 6;
        ctx.strokeRect(sx, sy, w, h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(sx, sy, w * alpha, h);
    };

    DSD.draw = (ctx, sample_array, opt = {}, alpha = 0) => {
        draw_midline(ctx, opt.sx, opt.sy, opt.w, opt.h);
        DSD.draw_sample_data(ctx, sample_array, opt );
        DSD.draw_sample_box(ctx, opt, alpha );
    };

    DSD.draw_info = (ctx, sound, sm) => {
        const alpha = sm.frame / ( sm.frameMax - 1);
        ctx.fillStyle = 'cyan';
        ctx.font = '20px courier';
        ctx.textBaseline = 'top';
        const str_frame = String(sm.frame).padStart(4, '0');
        ctx.fillText('frame: ' + str_frame + ' / ' + sm.frameMax, 5 + 70, 420);
        const str_secs = (sound.secs * alpha ).toFixed(2);
        ctx.fillText(' ( ' + str_secs + ' / ' + sound.secs + ' )', 230 + 70, 420);
    };

    window.DSD = DSD;
}());