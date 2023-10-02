/*    video01-01-alpha-hello - for audio-generator-waveplain project
          * Just Getting the core idea of what I want working
 */

//-------- ----------
// WP OBJECT
//-------- ----------

const create_wp = () => {
    const wp = {
        samp_points: 20,
        freq_points: 2
    };
    // geometry
    wp.geometry_source = new THREE.PlaneGeometry(10, 10, wp.samp_points - 1, wp.freq_points - 1);
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
    wp.material = new THREE.MeshBasicMaterial( { vertexColors: true,side: THREE.DoubleSide, wireframe: true, wireframeLinewidth: 6 } );
    wp.mesh = new THREE.Mesh(wp.geometry, wp.material);
    return wp;
};


//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    const sud = scene.userData;
    sm.renderer.setClearColor(0x000000, 0.25);

    const wp = sud.wp = create_wp();

    scene.add(wp.mesh);


    // start state for camera
    camera.position.set( 10, 5, 10);
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

