/*    video01-05-original-creatures - for audio-generator-tune-seededrandom project
          * I just want to name this one creatures
 */
VIDEO.resmode = 6;
//-------- ----------
// THUM
//-------- ----------
VIDEO.thum_frame = 0;
VIDEO.thum_overlay = (sm, canvas, ctx) => {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.font = '80px arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText('CREATURES', canvas.width / 2, canvas.height / 2);
    ctx.fillText('CREATURES', canvas.width / 2, canvas.height / 2);
};
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

    const nf = ST.create_nf();

    const sq = {
        objects: []
    };


    const tune_1 = [
        0,4,4,4,4,4,4,4,4,0,
        0,2,2,2,2,0,
        0,2,2,2,2,0,
        0,2,2,2,2,0,
        0,2,2,2,2,0,
        0,4,4,4,4,4,4,4,4,0,
        0,2,2,2,2,0,
        0,2,2,2,2,0,
        0,2,2,2,2,0,
        0,2,2,2,2,0,
        0,4,4,4,4,4,4,4,4,0,
        0,2,2,2,2,0,
        0,2,2,2,2,0,
        0,2,2,2,2,0,
        0,2,2,2,2,0,
        0,4,4,4,4,4,4,4,4,0,
        0,2,2,0,
        0,4,4,4,4,4,4,4,4,0,
        0,2,2,0,
        0,4,4,4,4,4,4,4,4,0
    ];


    const tune_2 = [
        0,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,0,
        0,2,2,2,2,2,2,2,2,0,
        0,2,2,2,2,0,
        0,3,3,3,3,0,
        0,2,2,2,2,2,2,2,2,0,
        0,3,3,3,3,0,
        0,3,3,3,3,3,3,3,3,0,
        0,2,2,2,2,2,2,2,2,0,
        0,1,1,1,1,1,1,1,1,0
    ];

    const total_secs = 10; //22;


    sq.objects[0] = {
        alpha: 12 / total_secs,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.int_shift = 0; //Math.floor(100 * a_object);
            samp.values_per_wave = 60;

            const ti = tune_1[ Math.floor( tune_1.length  * (a_object * 4 % 1) ) ];
            samp.frequency = ti;
            samp.amplitude = 0.0;
            if(ti > 0){      
                samp.amplitude = 0.75;
            }


            return samp;  
        }
    };

    sq.objects[1] = {
        alpha: 22 / total_secs,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.int_shift = 0; //Math.floor(100 * a_object);
            samp.values_per_wave = 60;

            const ti = tune_2[ Math.floor( tune_2.length  * (a_object * 2 % 1) ) ];
            samp.frequency = ti;
            samp.amplitude = 0.0;
            if(ti > 0){      
                samp.amplitude = 0.75;
            }


            return samp;  
        }
    };




    // the sound object
    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'seedednoise',
        for_sampset: ( samp, i, a_sound, opt ) => {
            const spf = opt.sound.samples_per_frame;
            const a_frame = (i % spf) / spf;
            samp.a_wave = a_frame;


            samp.values_per_wave = 60; 
            samp.frequency = 1;
            samp.amplitude = 0.75;

            ST.applySQ(sq, samp, i, a_sound, opt);

            return samp;
        },
        disp_step: 100,
        getsamp_lossy: DSD.getsamp_lossy_random,
        secs: total_secs
    });
    sm.frameMax = sound.frames;

    //
    const dl = new THREE.DirectionalLight( 0xffffff, 0.8 );
    dl.position.set(1,1,1);
    scene.add(dl);
    const al = new THREE.AmbientLight( 0xffffff, 0.2 );
    scene.add(al);

    // poly mesh object
    const geometry_source = scene.userData.geometry_source = new THREE.IcosahedronGeometry(1.75, 0);
    const geometry = geometry_source.clone();

    const material_1 = new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.80, side: THREE.DoubleSide, color: 0x00ffff });
    const material_2 = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ffff, wireframeLinewidth: 6 });
    const poly = scene.userData.poly = new THREE.Mesh( geometry, material_1 );
    poly.add( new THREE.Mesh( geometry, material_2 )  );
    scene.add(poly);
    camera.position.set( 0, 0, 10);
    camera.lookAt( 0, 0.85, 0 );

};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){

    const poly = scene.userData.poly;
    poly.rotation.y = Math.PI * 2 * ( 8 * sm.per);

    // create the data samples
    const data_samples = CS.create_frame_samples(scene.userData.sound, sm.frame );
    
    // mutate geometry with data samples
    const geometry = poly.geometry;
    const geometry_source = scene.userData.geometry_source;
    const pos_source = geometry_source.getAttribute('position');
    const pos = geometry.getAttribute('position');
    const samp_count = data_samples.length;
    const samp_index_delta = Math.floor( samp_count / pos.count);
    let i_vert = 0;
    while(i_vert < pos.count){
        const s = data_samples[  i_vert * samp_index_delta ];
        const sn = ST.get_normal(s);
        const x = pos_source.getX(i_vert);
        const y = pos_source.getY(i_vert);
        const z = pos_source.getZ(i_vert);
        const v = new THREE.Vector3(x, y, z);
        const l = v.length();
        v.normalize().multiplyScalar(1.50 + 0.50 * sn);
        pos.setXYZ(i_vert, v.x, v.y, v.z);
        i_vert += 1;
    };
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    // write the data samples
    //return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.filePath, true, sm.isExport);
    return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.imageFolder, true, sm.isExport);
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

    sm.renderer.render(sm.scene, sm.camera);
    const dx = 0, dy = 0;
    const dw = sm.canvas.width, dh = sm.canvas.height;
    ctx.drawImage(sm.renderer.domElement, dx, dy, dw, dh);


    // draw disp
    DSD.draw( ctx, sound.array_disp, sound.opt_disp, sm.frame / ( sm.frameMax - 1 ) );
    DSD.draw( ctx, sound.array_frame, sound.opt_frame, 0 );
    // additional plain 2d overlay for status info
    DSD.draw_info(ctx, sound, sm);
};

