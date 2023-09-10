/*    video04-03-perframe-table.js - for audio-generator-1 project
          * using the table waveform, and frame by frame alphas
          * worked out a sound that sounds like a car ( Rad Racer like )
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


    const speed_array = [];

    let si = 0;
    while(si < 50){
        speed_array.push(si  / 100);
        si += 1;
    }

    si = 50;
    while(si > 20){
        speed_array.push(si  / 100);
        si -= 10;
    }

    si = 20;
    while(si < 70){
        speed_array.push(si  / 100);
        si += 1;
    }

    si = 70;
    while(si > 40){
        speed_array.push(si  / 100);
        si -= 10;
    }

    si = 40;
    while(si < 100){
        speed_array.push(si  / 100);
        si += 1;
    }

    si = 0;
    while(si < 50){
        const n = Math.floor(si / 5);
        speed_array.push(0.90 + THREE.MathUtils.seededRandom(n) * 0.10);
        si += 1;
    }


    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'table',
        for_sampset: ( samp, i, a_sound, opt ) => {

            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_frame = (i % spf) / spf;

            const a_speed = speed_array[ Math.floor( speed_array.length * a_sound ) ];
            return {
                amplitude: 0.75,
                a_wave : a_frame,
                table: [
                    {  waveform: 'sin', frequency: 4, amplitude: 1.40 * a_speed },
                    {  waveform: 'pulse', frequency: 4 + 4 * a_speed, amplitude: 0.75 * a_speed  }
                ]
            };
        },
        //sample_rate: 1000,
        disp_step: 1,
        secs: 10
    });


    console.log(sound);

    sm.frameMax = sound.frames;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    return CS.write_frame_samples(scene.userData.sound, sm.frame, sm.filePath, true);
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

