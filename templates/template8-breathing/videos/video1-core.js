// video1-core.js from template8-breathing
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js'
];
// init
VIDEO.init = function(sm, scene, camera){

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

const cp = createCurvePath(10);


    const geometry_sphere = new THREE.SphereGeometry(0.5, 20, 20);

    const mesh = new THREE.Mesh(geometry_sphere);

    mesh.position.copy(cp.getPoint(0.1))

    scene.add(mesh);


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

mesh.position.copy(cp.getPoint(seq.per))

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
            // camera
            //camera.position.set(-8, 4, -8);
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
 