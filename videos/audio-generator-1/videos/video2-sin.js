/*    video2-sin - for audio-generator-1 project
          * Just using the sin wavefrom
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
    const sound = scene.userData.sound = CS.create_sound({
        wavefrom : 'sin',
        for_sample: ( samp_set, i, a_point ) => {
            const a_amp =  THREE.MathUtils.pingpong( a_point * 32, 1 );
            samp_set.amplitude = 0.10 + 0.65 * THREE.MathUtils.smoothstep( a_amp, 0, 1 );
            samp_set.frequency = 80 + 920 * a_point;
            return samp_set;
        },
        secs: 10
    });


console.log( THREE.MathUtils.pingpong(1.25, 1) );

    sm.frameMax = sound.frames;

};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sound = scene.userData.sound;
    const total_bytes = sound.sample_rate * sound.secs;
    const i_start = sound.bytes_per_frame * sm.frame;
    const data_samples =  sound.array_frame = CS.create_samp_points({
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

