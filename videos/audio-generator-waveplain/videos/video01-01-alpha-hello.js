/*    video01-01-alpha-hello - for audio-generator-waveplain project
          * Just Getting the core idea of what I want working
 */

//-------- ----------
// WP OBJECT
//-------- ----------

const create_wp = () => {
    const wp = {
        samp_points: 20,
        track_points: 2
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
    wp.material = new THREE.MeshBasicMaterial( { vertexColors: true,side: THREE.DoubleSide, wireframe: true, wireframeLinewidth: 3 } );
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
        let y = Math.sin( Math.PI * (freq * a_wave) ) * amp;
        y = THREE.MathUtils.clamp(y, -1, 1);
        pos.setY(i, y);
        i += 1;
    }
    pos.needsUpdate = true;
};
// gen sample data for the current state of the wp object
const gen_sampdata_tracks = (wp, sample_count=100) => {
    const pos = wp.geometry.getAttribute('position');
    const samp_tracks = [];
    let i_samp = 0;
    while(i_samp < sample_count){
        const a_samp = i_samp / sample_count;
        let i_tp = 0;
        while(i_tp < wp.track_points ){
            const i_sp = Math.floor( a_samp * wp.samp_points);
            const i_pos = i_tp * wp.samp_points + i_sp;
            let n = parseFloat( pos.getY(i_pos).toFixed(2)  );
            samp_tracks[i_tp] = samp_tracks[i_tp] === undefined ? [] : samp_tracks[i_tp];
            samp_tracks[i_tp][i_samp] = n;
            i_tp += 1;
        }
        i_samp += 1;
    }
    return samp_tracks;
};

//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);

    const wp = sud.wp = create_wp();
    scene.add(wp.mesh);
    apply_wave(wp, 0, 2, 1);
    apply_wave(wp, 1, 1, 1);


    const sampdata = gen_sampdata_tracks(wp, 100);

    // start state for camera
    camera.position.set( 5, 5, 15);
    camera.lookAt(0,-1,0);
    // work out number of frames
    sm.frameMax = 30;
};
//-------- ----------
// UPDATE
//-------- ----------
VIDEO.update = function(sm, scene, camera, per, bias){
    const sud = scene.userData;
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

