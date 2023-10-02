/*    video01-01-alpha-hello - for audio-generator-waveplain project
          * Just Getting the core idea of what I want working
 */

//-------- ----------
// INIT
//-------- ----------
VIDEO.init = function(sm, scene, camera){
    sm.renderer.setClearColor(0x000000, 0.25);

    // geometry, material, mesh
    const geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    geometry.rotateX(Math.PI * 1.5)
    const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // grid
    //const grid = new THREE.GridHelper(10, 10);
    //scene.add(grid);

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

    // render threejs scene object
    sm.renderer.render(sm.scene, sm.camera);
    ctx.drawImage(sm.renderer.domElement, 0, 0, canvas.width, canvas.height);

};

