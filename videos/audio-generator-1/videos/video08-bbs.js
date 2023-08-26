/*    video9-bbs - for audio-generator-1 project
          * beats per second
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

    // test song
    // https://sheetmusic-free.com/good-king-wenceslas-sheet-music-christmas-carol/
    const note_data = [
        nf.f1,nf.f1,nf.f1,nf.g1,nf.f1,nf.f1,nf.c1,nf.d1,nf.c1,nf.d1,nf.e1,nf.f1,nf.f1,
        nf.f1,nf.f1,nf.f1,nf.g1,nf.f1,nf.f1,nf.c1,nf.d1,nf.c1,nf.d1,nf.e1,nf.f1,nf.f1,
        nf.c2,nf.b1,nf.a1,nf.g1,nf.a1,nf.f1,
        nf.d1,nf.c1,nf.d1,nf.e1,nf.f1,nf.f1,
        nf.c1,nf.c1,nf.d1,nf.e1,nf.f1,nf.f1,nf.g1,
        nf.c2,nf.b1,nf.a1,nf.g1,nf.f1,nf.a1,nf.f1
    ];

    const sound = scene.userData.sound = CS.create_sound({
        //waveform : 'tri',

        waveform : 'table',

        for_sampset: ( sampset, i, a_sound, opt ) => {
            const bbs = 4;
            const i_beat = Math.floor( a_sound * opt.secs * bbs);
            const f = note_data[ i_beat ];

/*
            sampset.a_wave = a_sound * opt.secs * bbs % 1;
            sampset.step_count = 0;
            sampset.frequency = f / bbs;
            sampset.amplitude = 0;
            if(sampset.frequency > 0){
                sampset.amplitude = Math.sin( Math.PI * sampset.a_wave ) * 0.65;
            }

            return sampset;
*/

            const a_wave = a_sound * opt.secs * bbs % 1;
            let amplitude = 0;
            if(f > 0){
                amplitude = 0.5; //0.25 + 0.5 * Math.sin( Math.PI * sampset.a_wave );
            }

            const distort1 = THREE.MathUtils.seededRandom(i);
            const distort2 = THREE.MathUtils.seededRandom(i * 10);

            return {
                amplitude: amplitude * 1,
                a_wave : a_wave,
                table: [
                    {  waveform: 'sin', frequency: Math.round( (f * 0.05) / bbs), amplitude: 2.5 },
                    {  waveform: 'sawtooth', frequency: Math.round( (f * 0.10 ) / bbs), amplitude: 4 + 0.5 * distort1 },
                    {  waveform: 'sin', frequency: Math.round( (f * 0.15) / bbs), amplitude: 3.05 },
                    {  waveform: 'sin', frequency: Math.round( (f * 0.20) / bbs), amplitude: 1.1 },
                    {  waveform: 'sin', frequency: Math.round( (f * 0.25) / bbs), amplitude: 2.2 },
                    {  waveform: 'sin', frequency: Math.round( (f * 0.30) / bbs), amplitude: 1.3 },
                    {  waveform: 'sin', frequency: Math.round( (f * 0.35) / bbs), amplitude: 2.7 },
                    {  waveform: 'sin', frequency: Math.round( (f * 0.40) / bbs), amplitude: 1.2 },
                    {  waveform: 'sin', frequency: Math.round( (f * 0.45) / bbs), amplitude: 2.3 },
                    {  waveform: 'tri', frequency: Math.round( f / bbs), amplitude: 5.5, step_count: 7 },
                    {  waveform: 'sin', frequency: Math.round( (f * 1.02) / bbs), amplitude: 0.2},
                    {  waveform: 'sin', frequency: Math.round( (f * 1.04) / bbs) , amplitude: 0.1},
                    {  waveform: 'sin', frequency: Math.round( (f * 1.08) / bbs) , amplitude: 0.15},
                    {  waveform: 'sin', frequency: Math.round( (f * 1.16) / bbs) , amplitude: 0.1},
                    {  waveform: 'sin', frequency: Math.round( (f * 1.32) / bbs) , amplitude: 0.2  },
                    {  waveform: 'sin', frequency: Math.round( (f * 1.64) / bbs) , amplitude: 0.25 },
                    {  waveform: 'sin', frequency: Math.round( (f * 2.28) / bbs) , amplitude: 0.35 },
                ]
            };
        },
        secs: 13
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