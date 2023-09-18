/*    video01-01-original-woundup - for audio-generator-tune-seededrandom project
          * First tune for the project
 */
VIDEO.resmode = 6;
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

    // the SQ Object
    const sq = {
        objects: []
    };
    sq.objects[0] = {
        alpha: 5 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.values_per_wave = 40;
            samp.frequency = 1 + 4 * a_object;
            return samp;  
        }
    };
    sq.objects[1] = {
        alpha: 7 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.values_per_wave = 40;
            samp.frequency = 5;
            return samp;
        }
    };
    sq.objects[2] = {
        alpha: 10 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.values_per_wave = 40 - 30 * a_object;
            samp.frequency = 5;
            return samp;
        }
    };
    sq.objects[3] = {
        alpha: 15 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.values_per_wave = 10 + 90 * a_object;
            samp.frequency = 5;
            return samp;
        }
    };
    sq.objects[4] = {
        alpha: 20 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.values_per_wave = 100 - 90 * Math.sin( Math.PI * ( a_object * 8 % 1 ) );
            samp.frequency = 5 - 4.5 * a_object;
            return samp;
        }
    };
    sq.objects[5] = {
        alpha: 27 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.values_per_wave = 100 - 60 * a_object;
            samp.frequency = 0.5;
            return samp;
        }
    };
    sq.objects[6] = {
        alpha: 30 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.values_per_wave = 40;
            samp.frequency = 0.5 + 0.5 * a_object;
            return samp;
        }
    };
    const tune = [
        2.0, 1.0, 0.5, 2.0, 1.0, 0.5, 2.0, 2.0, 0.5, 0.5, 0.5, 0.5,
        2.0, 1.0, 0.5, 2.0, 1.0, 0.5, 2.0, 2.0, 0.5, 0.5, 0.5, 0.5,
        2.0, 1.0, 0.5, 2.0, 1.0, 0.5, 2.0, 2.0, 0.5, 0.5, 0.5, 0.5,
        2.0, 1.0, 0.5, 2.0, 1.0, 0.5, 2.0, 2.0, 0.5, 0.5, 0.5, 0.5,
        2.0, 1.0, 0.5, 2.0, 1.0, 0.5, 2.0, 2.0, 0.5, 0.5, 0.5, 0.5,
        2.0, 1.0, 0.5, 2.0, 1.0, 0.5, 2.0, 2.0, 0.5, 0.5, 0.5, 0.5
    ];
    sq.objects[7] = {
        alpha: 40 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.values_per_wave = 40 - 20 * a_sound;
            samp.frequency = tune[ Math.floor( tune.length  * a_object ) ];
            return samp;
        }
    };
    sq.objects[8] = {
        alpha: 43 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.values_per_wave = 20  + 80 * a_sound;
            samp.frequency = 0.5 + 1.5 * a_sound;
            return samp;
        }
    };
    sq.objects[9] = {
        alpha: 53 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.values_per_wave = 100 - 90 * a_sound;
            samp.frequency = tune[ Math.floor( tune.length  * a_object ) ] * 1.25;
            return samp;
        }
    };
    sq.objects[10] = {
        alpha: 55 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){
            samp.values_per_wave = 10 + 30 * a_sound;
            samp.frequency = 0.625 + (1 - 0.625) * a_sound;
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
            samp.values_per_wave = 40;
            samp.frequency = 1;
            samp.amplitude = 0.75;
            ST.applySQ(sq, samp, i, a_sound, opt);
            return samp;
        },
        disp_step: 100,
        getsamp_lossy: DSD.getsamp_lossy_random,
        secs: 55
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
    return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.filePath, true);
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
