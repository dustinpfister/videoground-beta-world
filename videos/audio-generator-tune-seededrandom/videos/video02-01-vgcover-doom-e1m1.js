/*    video02-01-vgcover-doom-e1m1 - for audio-generator-tune-seededrandom project
          * a Video Game cover of 'E1M1' from DOOM 
 */
VIDEO.resmode = 6;
//-------- ----------
// THUM
//-------- ----------
VIDEO.thum_frame = 0;
VIDEO.thum_overlay = (sm, canvas, ctx) => {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.font = '100px arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText('DOOM e1m1', canvas.width / 2, canvas.height / 2);
    ctx.fillText('DOOM e1m1', canvas.width / 2, canvas.height / 2);
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

    const tune_1 = [
        // e1m1.mid - track2 - m1
        0.25,'e2', 0.25,'e2', 0.25,'e3', 0.25,'e2', 0.25,'e2', 0.25,'d3', 0.25,'e2', 0.25,'e2', 0.25,'c3', 0.25,'e2', 0.25,'b2',
        0.25,'e2', 0.25,'e2', 0.25,'b2', 0.25,'c3',

        // e1m1.mid - track2 - m1 
        0.25,'e2', 0.25,'e2', 0.25,'e3', 0.25,'e2', 0.25,'e2', 0.25,'d3', 0.25,'e2', 0.25,'e2', 0.25,'c3', 0.25,'e2', 3.00,'b2'

    ];
    const data_1 = ST.tune_to_alphas(tune_1, nf);

    const sq = {
        objects: []
    };

    sq.objects[0] = {
        alpha: 55 / 55,
        for_sampset: function(samp, i, a_sound, opt, a_object, sq){ 

            const obj_1 = ST.get_tune_sampobj(data_1, a_object, 55, false);
            const a_tune1sin = Math.sin(Math.PI * obj_1.a_wave);

            samp.frequency = obj_1.frequency / 30;
            samp.amplitude = 0.25;
            if(samp.frequency != 0){
                samp.amplitude = 0.25 + 0.75 * (a_tune1sin * 1.50);
            }

            return samp;  
        }
    };

    const shift_values = [0, 20, 0, 40, 0, 60, 0, 1000];
    //const shift_values = [0, 1000];

    // the sound object
    const sound = scene.userData.sound = CS.create_sound({
        waveform : 'seedednoise',
        for_sampset: ( samp, i, a_sound, opt ) => {
            const spf = opt.sound.samples_per_frame;
            const frame = Math.floor(i / spf);
            const a_frame = (i % spf) / spf;
            samp.a_wave = a_frame;
            samp.values_per_wave = 20;

            //samp.int_shift = 200 * a_sound;

            // not the place for this... ( do this kind of thing for the 'original' set of videos here )
            //samp.int_shift = frame % 2 === 0 ? 0 : 1000;
            samp.int_shift = shift_values[ frame %  shift_values.length ];

            samp.frequency = 1;
            samp.amplitude = 0.75;
            ST.applySQ(sq, samp, i, a_sound, opt);
            return samp;
        },
        disp_step: 100,
        getsamp_lossy: DSD.getsamp_lossy_random,
        secs: 5
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
    //return CS.write_frame_samples(scene.userData.sound, data_samples, sm.frame, sm.filePath, true);
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

