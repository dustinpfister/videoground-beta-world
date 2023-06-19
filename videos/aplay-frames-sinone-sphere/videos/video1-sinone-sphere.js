// video1-sinone-sphere.js for aplay-frames-sinone
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js'
];
// init
VIDEO.init = function(sm, scene, camera){
// ---------- ----------
// GEOMETRY
// ---------- ----------
const geometry = new THREE.SphereGeometry(4, 40, 40);
// ---------- ----------
// SCENE CHILD OBJECTS
// ---------- ----------
scene.add( new THREE.GridHelper( 10, 10 ) );
// points
const material = new THREE.PointsMaterial( { size: 0.3 } );
const points1 = new THREE.Points( geometry, material);
scene.add(points1);
// pointer mesh
const mesh_pointer = new THREE.Mesh( new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshNormalMaterial()  );
scene.add(mesh_pointer);


    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#000000');
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
const att_pos = geometry.getAttribute('position');
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(9.25, 9, 9.25);
            camera.lookAt(0, -1, 0);
            camera.zoom = 1;

    const i = Math.floor(seq.per * att_pos.count);
    const v = new THREE.Vector3( att_pos.getX(i), att_pos.getY(i), att_pos.getZ(i) );
    mesh_pointer.position.copy(v);

        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 30,
        update: function(seq, partPer, partBias){

        }
    };
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 