// video1-core.js from template8-breathing
//        * core idea of this kind of video project working
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // SETTINGS
    //-------- ----------
    const BREATH_SECS = 60;
    const BREATHS_PER_MINUTE = 5;
    const DELAY_SECS = 10;
    //-------- ----------
    // HELPER FUNCTIONS
    //-------- ----------
    // create curve Path helper
    const createCurvePath = (count) => {
        const cp = new THREE.CurvePath();
        let i = 0;
        while(i < count){
            const v_start = new THREE.Vector3();
            const radian = Math.PI * 2 * (i / count);
            const x = Math.cos(radian) * 3;
            const y = Math.sin(radian) * 3;
            const v_end = new THREE.Vector3(x,y,0);
            const curve = new THREE.LineCurve3(v_start, v_end);
            cp.add(curve);
            i += 1;
        }
        return cp;
    };
    const createMeshGroup = (count) => {
        const group = new THREE.Group();
        const geometry_sphere = new THREE.SphereGeometry(0.1, 20, 20);
        let i = 0;
        while(i < count){
            const mesh = new THREE.Mesh(geometry_sphere);
            group.add(mesh);
            i += 1;
        }
        return group;
    };
    const updateMeshGroup = (group, cp, alpha) => {
        const a2 = 1 - Math.abs(0.5 - alpha) / 0.5;
        group.children.forEach( (mesh, i, arr) => {
            const a_child = i / arr.length;
            const index_curve = Math.floor( cp.curves.length * a_child );
            const a_point1 = i  % cp.curves.length / cp.curves.length * a2;
            const a_point2 = 0.2 + 0.8 * a_point1;
            mesh.position.copy( cp.curves[index_curve].getPoint(a_point2) );
            const s = 2 - (1 - a_point1) * 1.5;
            mesh.scale.set(s, s, s);
        });
    };
    //-------- ----------
    // Curve Path, and Group used for breath circle
    //-------- ----------
    const cp = createCurvePath(10);
    const group = createMeshGroup(100);
    scene.add(group);
    //-------- ----------
    // BACKGROUND - using canvas2 and lz-string to create a background texture
    //-------- ----------
    const canObj = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#000000', '#1f1f1f', '#00ffff'],
        dataParse: 'lzstring64',
        state: { w: 8, h: 5, data: 'AwGlEYyzNCVgpcmPit1mqvTsg===' }
    });
    // can use LZString to compress and decompress
    //console.log( LZString.decompressFromBase64('AwGlEYyzNCVgpcmPit1mqvTsg===') );
    // I want to repeat the texture
    const texture = canObj.texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32, 24);
    scene.background = texture;
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(0, 0, 8);
            camera.zoom = 1;
            // update the mesh group
            updateMeshGroup(group, cp, 0);
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: DELAY_SECS,
        update: function(seq, partPer, partBias){
            updateMeshGroup(group, cp, 0);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: BREATH_SECS,
        update: function(seq, partPer, partBias){

            const sec = BREATH_SECS * partPer;
            const a1 = (sec % 60 / 60) * BREATHS_PER_MINUTE % 1;

            updateMeshGroup(group, cp, a1);
            camera.lookAt(0, 0, 0);
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
 