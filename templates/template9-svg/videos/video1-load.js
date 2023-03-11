// video1-load.js from template9-svg
// scripts
VIDEO.scripts = [
   // CORE MODULES
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(-2, 1, 2);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(al);
    //-------- ----------
    // GRID
    //-------- ----------
const grid = new THREE.GridHelper(10, 10);
scene.add(grid)


    //-------- ----------
    // BACKGROUND
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
            // CAMERA DEFAULTS
            camera.position.set(10, 10, 10);
            camera.lookAt(0, 0, 0);
            camera.zoom = 1.26;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - count down
    opt_seq.objects[0] = {
        secs: 30,
        update: function(seq, partPer, partBias){
        }
    };
    //-------- ----------
    // SET FRAME MAX
    //-------- ----------
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};


// video1-load.js for template9-svg
// scripts
/*
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/threejs/r146/SVGLoader.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 0.85);
    dl.position.set(-3, 2, 1)
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(al);
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = new THREE.GridHelper(0xffffff, 1);
    scene.add(grid);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#000000');
    //-------- ----------
    // MAIN SEQ OBJECT
    //-------- ----------
    var seq_opt = {
        fps: 30,
        beforeObjects: function(seq){
            // camera
console.log('yes');
            camera.position.set(12, 12, 12);
            camera.lookAt(0, 0, 0);
        },
        afterObjects: function(seq){
        },
        objects: []
    };
    seq_opt.objects[0] = {
        secs: 30,
        update: function(seq, partPer, partBias){
            

        }
    };

    const seq = scene.userData.seq = seqHooks.create(seq_opt);

    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
    //-------- ----------
    // SVG LOADER
    //-------- ----------
    return new Promise((resolve, reject)=>{
        // instantiate a loader
        const loader = new THREE.SVGLoader();
        // load a SVG resource
        loader.load(
            // resource URL
            videoAPI.pathJoin(sm.filePath, '../../../img/svg-test/test1.svg'),
            // called when the resource is loaded
            function ( data ) {
                // resolve
                resolve();
            },
            // called when loading is in progresses
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
                console.log(error);
                reject(error);
            }
        );
    });

};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
console.log('hello');
    var seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
*/
