(function(){

    // DS for Display Sound
    const DS = {};

    DS.create_array_disp = (sound, opt={} ) => {
        // sound display array
        const array_disp = CS.create_samp_points({
            sound: sound,
            waveform: sound.waveform,
            for_sampset: sound.for_sampset,
            i_size: sound.total_samps,
            i_start: 0,
            i_count: sound.total_samps,
            secs: sound.secs,
            step: opt.disp_step === undefined ? sound.bytes_per_frame: opt.disp_step,
            mode: 'raw'
        });
        return array_disp;
    };

    DS.create_disp_opt = (opt={}) => {
        const getsamp_lossy = opt.getsamp_lossy || DSD.getsamp_lossy_random;
        return { w: 720 - 160, h: 150, sy: 10 + 105, sx: 80, getsamp_lossy: getsamp_lossy };
    };

    // append public api to window
    window.DS = DS;
}());
