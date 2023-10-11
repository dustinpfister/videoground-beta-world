
//-------- ----------
// SAMP DATA
//-------- ----------
var WP ={};
// create a wave plane object
WP.create_wp = (opt = {} ) => {
    const wp = {
        samp_points: opt.samp_points || 800,
        track_points: opt.track_points || 2
    };
    wp.geometry_source = new THREE.PlaneGeometry(10, 10, wp.samp_points - 1, wp.track_points - 1);
    wp.geometry_source.rotateX(Math.PI * 1.5);
    wp.geometry = wp.geometry_source.clone();

    const size = 256;
    const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = size; canvas.height = size;
    ctx.lineWidth = 1;
    const len = size * size;
    let i = 0;
    while(i < len){
        const x = i % size;
        const y = Math.floor( i / size );
        const a = (0.25 + 0.75 * THREE.MathUtils.seededRandom(i)).toFixed(2)
        const r = 0;
        const g = Math.floor( 255 * ( y / size ) );
        const b = Math.floor( 255 * ( x / size ) );
        ctx.fillStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
        const n = Math.floor(size / (wp.track_points - 1));
        if( y % n > n - 3 || y % n < 2 ){
            ctx.fillStyle = 'rgba(255,255,255,1)';
        }
        ctx.fillRect(x, y, 1, 1);
        i += 1;
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    wp.material = new THREE.MeshBasicMaterial({
         side: THREE.DoubleSide,
         map: texture,
         transparent: true, opacity: 1,
         wireframe:true,
         wireframeLinewidth: 2
    });
    wp.mesh = new THREE.Mesh(wp.geometry, wp.material);

    // light
    const dl = new THREE.DirectionalLight(0xffffff, 0.65);
    dl.position.set( 3, 1, 0);
    wp.mesh.add( dl );
    const al = new THREE.AmbientLight(0xffffff, 0.15);
    wp.mesh.add(al);

    return wp;
};
// apply a wave for a track in the plain by giving a track index, along with frequency, amplitude
WP.apply_wave = (wp, i_track=0, freq=1, amp=0.5 ) => {
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
WP.gen_sampdata_tracks = (wp, sample_count=100, int16=true, mix_amp=1) => {
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
