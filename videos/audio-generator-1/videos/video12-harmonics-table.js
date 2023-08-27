/*    video13-harmonics-table - for audio-generator-1 project
          * worked out some good code, I would now like to use the table with it
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
        'c1' : notefreq_by_indices(6, 0),
        'd1' : notefreq_by_indices(6, 2),
        'e1' : notefreq_by_indices(6, 4),
        'f1' : notefreq_by_indices(6, 5),
        'g1' : notefreq_by_indices(6, 7),
        'a1' : notefreq_by_indices(6, 9),
        'b1' : notefreq_by_indices(6, 11),
        'c2' : notefreq_by_indices(7, 0)
    };

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
        waveform : 'table',
        for_sampset: ( sampset, i, a_sound, opt ) => {
            let frequency = 0;
            let a_wave = a_sound;
            let id = 0;
            while(id < data.length){
                const alow = data[id];
                const ahi = data[id + 1];
                const freq = data[id + 2];
                if( a_sound >= alow && a_sound < ahi){
                    const arange = alow - ahi;
                    const secs = arange * opt.secs;
                    //sampset.a_wave = a_sound * opt.secs % 1;
                    a_wave = (a_sound - alow) / arange;
                    frequency = Math.floor(freq * secs);
                    break;
                }
                id += 3;
            }

            const amp = Math.sin( Math.PI * a_wave );
            return {
                amplitude: 2.0,
                a_wave : a_wave,
                table: [
                    {  waveform: 'sin', frequency: Math.floor(frequency * 0.1), amplitude: amp * 0.3 },
                    {  waveform: 'sin', frequency: Math.floor(frequency * 0.2), amplitude: amp * 0.7 },
                    {  waveform: 'sin', frequency: Math.floor(frequency * 0.3), amplitude: amp * 0.85 },
                    {  waveform: 'sin', frequency: Math.floor(frequency * 0.4), amplitude: amp * 0.5 },
                    {  waveform: 'sin', frequency: Math.floor(frequency * 0.5), amplitude: amp * 0.35 },
                    {  waveform: 'sin', frequency: Math.floor(frequency * 0.6), amplitude: amp * 0.4 },
                    {  waveform: 'sin', frequency: Math.floor(frequency * 0.7), amplitude: amp * 0.45 },
                    {  waveform: 'sin', frequency: Math.floor(frequency * 0.8), amplitude: amp * 0.5 },
                    {  waveform: 'sin', frequency: frequency, amplitude: amp  },
                    {  waveform: 'sin', frequency: Math.floor(frequency * 1.2), amplitude: amp * 0.3 },
                    {  waveform: 'sin', frequency: Math.floor(frequency * 1.4), amplitude: amp * 0.25 },
                    {  waveform: 'sin', frequency: Math.floor(frequency * 1.8), amplitude: amp * 0.2 },
                    {  waveform: 'sin', frequency: Math.floor(frequency * 2.0), amplitude: amp * 0.15 }
                ]
            };
        },
        secs: 20
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

