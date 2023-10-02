/*    video01-01-alpha-hello - for audio-generator-waveplane project
          * Just Getting the core idea of what I want working
 */
//-------- ----------
// SCRIPTS
//-------- ----------
VIDEO.scripts = [
  '../js/samp-writer.js'
];
//-------- ----------
// WP OBJECT
//-------- ----------

const create_wp = () => {
    const wp = {
        samp_points: 100,
        track_points: 3
    };
    // geometry
    wp.geometry_source = new THREE.PlaneGeometry(10, 10, wp.samp_points - 1, wp.track_points - 1);
    wp.geometry_source.rotateX(Math.PI * 1.5);
    wp.geometry = wp.geometry_source.clone();
    // add colors attribute
    const pos = wp.geometry.getAttribute('position');
    const data_color = [];
    let i = 0;
    while(i < pos.count){
        const a_count = i / pos.count;
        const r = 0;
        const g = a_count;
        const b = i % 2 === 0 ? 0.5 : 0.25;
        data_color.push( r, g, b);
        i += 1;
    }
    wp.geometry.setAttribute('color', new THREE.BufferAttribute( new Float32Array(data_color), 3 ) );
    // material, mesh
    //wp.material = new THREE.MeshBasicMaterial( { vertexColors: true,side: THREE.DoubleSide, wireframe: true, wireframeLinewidth: 2 } );
    wp.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });

    wp.mesh = new THREE.Mesh(wp.geometry, wp.material);
    return wp;
};
// apply a wave for a track in the plain by giving a track index, along with frequency, amplitude
const apply_wave = (wp, i_track=0, freq=1, amp=0.5 ) => {
    const pos = wp.geometry.getAttribute('position');
    const i_start = wp.samp_points * i_track;
    const i_end = wp.samp_points * (i_track + 1);
    let i = i_start;
    while(i < i_end){
        const gx = i % wp.samp_points;
        const gy = Math.floor(i / wp.samp_points);
        const a_wave = gx / wp.samp_points;
        let y = Math.sin( Math.PI * ( freq * a_wave ) ) * amp;
        y = THREE.MathUtils.clamp(y, -1, 1);
        pos.setY(i, y);
        i += 1;
    }
    pos.needsUpdate = true;
    wp.geometry.computeVertexNormals();
};
// gen sample data for the current state of the wp object
const gen_sampdata_tracks = (wp, sample_count=100, int16=true, mix_amp=1) => {
    const pos = wp.geometry.getAttribute('position');
    const samp_tracks = [];
    const mixed = [];
    let i_samp = 0;
    while(i_samp < sample_count){
        const a_samp = i_samp / sample_count;
        let i_tp = 0;
        while(i_tp < wp.track_points ){
            const i_sp = Math.floor( a_samp * wp.samp_points);
            const i_pos = i_tp * wp.samp_points + i_sp;
            let n = parseFloat( pos.getY(i_pos).toFixed(2)  );
            if(int16){
                n = SW.normal_to_int16( (n + 1) / 2 );
            }
            samp_tracks[i_tp] = samp_tracks[i_tp] === undefined ? [] : samp_tracks[i_tp];
            samp_tracks[i_tp][i_samp] = n;
            if(i_tp === wp.track_points - 1){
                let i_tp2 = 0;
                let n2 = 0;
                while(i_tp2 < wp.track_points ){
                    n2 += samp_tracks[i_tp2][i_samp];
                    i_tp2 += 1;
                }
                mixed.push( n2 / wp.track_points * mix_amp );
            }
            i_tp += 1;
        }
        i_samp += 1;
    }
    return {
        tracks: samp_tracks,
        mixed: mixed
    };
};

//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);

    const wp = sud.wp = create_wp();
    scene.add(wp.mesh);


    //const sampdata_tracks = gen_sampdata_tracks(wp, 100);
    //console.log(sampdata_tracks);

    // start state for camera
    camera.position.set( 10, 8, 10);
    camera.lookAt(0,-2.0,0);
    // work out number of frames
    sm.frameMax = 30 * 5;
    sud.total_secs = sm.frameMax / 30;
    sud.sample_rate = 44100;
    sud.samples_per_frame = sud.sample_rate / 30;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sud = scene.userData;
    const wp = sud.wp;

    const a1 = Math.sin( Math.PI * (32 * per % 1) );
    const a2 = Math.sin( Math.PI * (16 * per % 1) );
    const a3 = Math.sin( Math.PI * (8 * per % 1) );

    apply_wave(wp, 0,   8, a1);
    apply_wave(wp, 1,  16, a2);
    apply_wave(wp, 2,  32, a3);

    const mix_amp = 1.0;

    const sampdata_tracks = gen_sampdata_tracks(wp, sud.samples_per_frame, true, mix_amp);
    return SW.write_frame_samples(sampdata_tracks.mixed, sm.frame, sm.filePath, sud.total_secs, sud.sample_rate );
};
//-------- ----------
// RENDER
//-------- ----------
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
    const sud = scene.userData;
    // background
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    // render threejs scene object
    sm.renderer.render(sm.scene, sm.camera);
    ctx.drawImage(sm.renderer.domElement, 0, 0, canvas.width, canvas.height);
};

