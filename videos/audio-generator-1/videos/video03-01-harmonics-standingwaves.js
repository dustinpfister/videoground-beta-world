/*    video11-harmonics-standingwaves - for audio-generator-1 project
          * just looking into what the deal is with 'standing waves'
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

    // note freq
    // https://pages.mtu.edu/~suits/notefreqs.html
    // https://en.wikipedia.org/wiki/Musical_note
    const notefreq_by_indices = ( i_scale = 4, i_note = 5 ) => {
        const a = i_scale - 5;
        const b = i_note + 3;
        return 440 * Math.pow(2, a + b / 12);
    };

    const get_beat_count = (tune) => {
        let i = 0;
        const len = tune.length;
        let count = 0;
        while(i < len ){
            count += tune[i];
            i += 2;
        }
        return count;
    };

    const tune_to_alphas = (tune) => {
        const beat_ct = get_beat_count(tune);
        let a = 0;
        let i = 0;
        const len = tune.length;
        const a_perbeat = 1 / beat_ct;
        const data = [];
        while(i < len ){
            const d = a_perbeat * tune[i]
            data.push(a, a + d, tune[i + 1] );
            a += d;
            i += 2;
        }
        return data;
    }

    // 0=C, 1=C#, 2=D, 3=D#, 4=E, 5=F, 6=F#,  7=G,  8=G#,  9=A, 10=A#, 11=B
    const nf = {
        'c1' : notefreq_by_indices(5, 0),
        'd1' : notefreq_by_indices(5, 2),
        'e1' : notefreq_by_indices(5, 4),
        'f1' : notefreq_by_indices(5, 5),
        'g1' : notefreq_by_indices(5, 7),
        'a1' : notefreq_by_indices(5, 9),
        'b1' : notefreq_by_indices(5, 11),
        'c2' : notefreq_by_indices(6, 0)
    };

/*
    const tune =[
        1, nf.f1,
        1, nf.f1,
        1, nf.f1,
        1, nf.g1,
        1, nf.f1,
        1, nf.f1,
        2, nf.c1
    ];
*/

    const tune = [
        1,nf.f1,1,nf.f1,1,nf.f1,1,nf.g1,1,nf.f1,1,nf.f1,2,nf.c1,1,nf.d1,1,nf.c1,1,nf.d1,1,nf.e1,2,nf.f1,2,nf.f1,
        1,nf.f1,1,nf.f1,1,nf.f1,1,nf.g1,1,nf.f1,1,nf.f1,2,nf.c1,1,nf.d1,1,nf.c1,1,nf.d1,1,nf.e1,2,nf.f1,2,nf.f1,
        1,nf.c2, 1,nf.b1, 1,nf.a1, 1,nf.g1, 1,nf.a1,1,nf.g1, 2,nf.f1,
        1,nf.d1,1,nf.c1,1,nf.d1,1,nf.e1,2,nf.f1,2,nf.f1,
        1,nf.c1,1,nf.c1,1,nf.d1,1,nf.e1,1,nf.f1,1,nf.f1,2,nf.g1,
        1,nf.c2,1,nf.b1,1,nf.a1,1,nf.g1,2,nf.f1,2,nf.a1,4,nf.f1
    ];

    const data = tune_to_alphas(tune);

    const sound = scene.userData.sound = CS.create_sound({
        // custom sin waveform in which integers of half waveforms are use
        waveform : (sampset, a_wave ) => {
            const freq_int = Math.floor( sampset.frequency );
            return Math.sin( Math.PI  * freq_int * a_wave )  * sampset.amplitude;
        },
        for_sampset: ( sampset, i, a_sound, opt ) => {
            sampset.amplitude = 0;
            sampset.frequency = 0;
            let id = 0;
            while(id < data.length){
                const alow = data[id];
                const ahi = data[id + 1];
                const freq = data[id + 2];
                if( a_sound >= alow && a_sound < ahi){
                    const arange = alow - ahi;
                    const secs = arange * opt.secs;
                    //sampset.a_wave = a_sound * opt.secs % 1;
                    sampset.a_wave = (a_sound - alow) / arange;
                    sampset.amplitude = Math.sin( Math.PI * sampset.a_wave ) * 0.7;
                    sampset.frequency = freq * secs;
                    break;
                }
                id += 3;
            }

            return sampset;
        },
        secs: 30
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

