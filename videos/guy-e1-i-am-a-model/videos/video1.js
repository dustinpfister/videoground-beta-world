// video1 for guy-e1-i-am-a-model
// scripts
VIDEO.scripts = [
   // CORE MODULES
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/curve/r0/curve.js',
   // ADDITIONAL
   '../../../js/canvas-text-plane/r0/text-plane.js',
   '../../../js/canvas-text-plane/r0/text-plane-helpers.js',
   '../../../js/guy/r0/guy.js',
   '../../../js/guy/r0/guy-helpers.js',
   '../../../js/texture/r0/texture.js'
];
VIDEO.daePaths = [
    '../../../dae/guy-one-studio/studio.dae'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // SCALE
    //-------- ----------
    const SCALE = 0.75;  // 1 foot = SCALE units
    //-------- ----------
    // text Data
    //-------- ----------
    const textData = textPlaneHelper.createTextData({
        TEXT_PXSIZE: 90,
        TEXT_BLANK_START_LINES: 2,
        TEXT: [' 3D']
    });
    //-------- ----------
    // DAE
    //-------- ----------
    const DAE_SCENE = VIDEO.daeResults[0].scene;
    const shell = DAE_SCENE.getObjectByName('shell');
    shell.position.set(0, 0, 0);
    shell.scale.set(SCALE, SCALE, SCALE);
    shell.rotation.z = Math.PI / 180 * 90;
    shell.material.color = new THREE.Color(0.8, 0.8, 0.8);
    scene.add(shell);
    //-------- ----------
    // TEXT PLANE MESH OBJECT
    //-------- ----------
    const plane_text = TextPlane.createPlane({
        w: 8 * SCALE, h: 4.5 * SCALE,
        rows: 10, size: 256,
        palette: [textData.TEXT_BGCOLOR, textData.TEXT_FONTCOLORS[0], textData.TEXT_FONTCOLORS[1]]
    });
    plane_text.position.set(-9.45 * SCALE, 4.5 * SCALE, -1.5 * SCALE);
    //plane_text.position.set(-2, 2, 0);
    plane_text.rotation.set(0, Math.PI / 180 * 90, 0);
    scene.add(plane_text);
    // Set Line Style 
    textPlaneHelper.setLineStyle(plane_text, textData.TEXT_PXSIZE, 'courier');
    textPlaneHelper.updateText(plane_text, 0, 0, textData);
    //-------- ----------
    // GUY
    //-------- ----------
    let GUYANI = {};
    let guy1 = {}; 
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(3, 1, 2);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(al);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#000000');
    //-------- ----------
    // PATHS
    //-------- ----------
    //const v3Array_campos = curveMod.QBV3Array([
    //    [10, 10, 10, 7, 7,-7,    0, 0, 0,      100]
    //]);
    //scene.add( curveMod.debugPoints( v3Array_campos ) );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            // guy defaults
            guyHelper.updateGuyEffect(guy1, 0);
            guy1.walk(1 / 2 * 0.25, 2);
            guy1.moveHead(0);
            guyHelper.setGuyPos(guy1, new THREE.Vector3(1.5 * SCALE, 0, 0));
            // TEXT
            textPlaneHelper.updateText(plane_text, seq.per, 0, textData);
            // camera defaults
            camera.position.set(10, 10, 10);
            camera.lookAt(guy1.group.position);
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ0 - guy walks into the scene
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // GUY1
            guy1.walk(1 / 4 * 0.25 + partPer, 4);
            const v3_guypos = new THREE.Vector3();
            v3_guypos.x = 1.5 * SCALE;
            v3_guypos.z = -10 * SCALE + 10 * SCALE * partPer;
            guyHelper.setGuyPos(guy1, v3_guypos);
            GUYANI.static1( 0 );
            // CAMERA
            const a = 10 - 5 * partPer;
            camera.position.set(a, a, a);
            camera.lookAt(guy1.group.position);
        }
    };
    // SEQ1 - 
    opt_seq.objects[1] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // GUY1

            // CAMERA
            camera.position.set(5, 5, 5);
            camera.lookAt(guy1.group.position);
        }
    };
    // SEQ2 - 
    opt_seq.objects[2] = {
        secs: 4,
        update: function(seq, partPer, partBias){
            // GUY1

            // CAMERA
            camera.position.set(5, 5, 5);
            camera.lookAt(guy1.group.position);
        }
    };
    // SEQ3 - 
    opt_seq.objects[3] = {
        secs: 7,
        update: function(seq, partPer, partBias){
            // GUY1

            // CAMERA
            camera.position.set(5, 5, 5);
            camera.lookAt(guy1.group.position);
        }
    };
    // SEQ4 - 
    opt_seq.objects[4] = {
        secs: 9,
        update: function(seq, partPer, partBias){
            // GUY1

            // CAMERA
            camera.position.set(5, 5, 5);
            camera.lookAt(guy1.group.position);
        }
    };
    // SEQ 4 - 
    opt_seq.objects[5] = {
        secs: 4,
        update: function(seq, partPer, partBias){
            // GUY1

            // CAMERA
            camera.position.set(5, 5, 5);
            camera.lookAt(guy1.group.position);
        }
    };
    //-------- ----------
    // LOAD IMAGES
    //-------- ----------
    return textureMod.load({
        URLS_BASE: videoAPI.pathJoin(sm.filePath, '../../../img/smile/'),
        URLS: ['smile_sheet_128.png', 'smile_creepy_128.png']
    }).then( (textureObj) => {
        //-------- ----------
        // TEXTURES
        //-------- ---------
        const canObj_head = guyHelper.createCanvasHead(textureObj);
        //-------- ----------
        // MATERIALS
        //-------- ----------
        // create textures from canvas
        const material = guyHelper.createMaterials();
        material.body.color = new THREE.Color(1, 1, 1);
        // set up the head textures
        guyHelper.setHeadTextures(canObj_head, [
            ['face',   0, 0, 0, true],
            ['back',   2, 0, 1, false],
            ['left',   1, 0, 2, false], 
            ['right',  3, 0, 3, false],
            ['top',    0, 1, 4, false],
            ['bottom', 1, 1, 5, false]
        ], material, 'smile_sheet_128');
        // CREATE ANI ALPHA FUNCTIONS
        GUYANI = guyHelper.createHeadAniAlphas(canObj_head, [
            { aniKey: 'static1', sheetKey: 'smile_sheet_128', cells: [ [0,3] ] },
            { aniKey: 'static2', sheetKey: 'smile_sheet_128', cells: [ [0,0]] },
            {
                aniKey: 'talk', sheetKey: 'smile_sheet_128',
                cells: [ [0,3], [1,3] ]
            },
            {
                aniKey: 'smile_creepy', sheetKey: 'smile_creepy_128',
                cells: [ [0,0], [1,0], [2,0], [3,0] ]
            }
        ]);
        // SET FACE FOR FIRST TIME
        GUYANI.smile_creepy(0);
        //guyHelper.setHeadCanvasTo(canObj_head, 3, 0, 'smile_creepy_128');
        //-------- ----------
        // create guy1
        //-------- ----------
        guy1 = guyHelper.createGuyHScale(SCALE * 6, 5, 8, material);
        scene.add(guy1.group);
        //-------- ----------
        // create main seq object
        //-------- ----------
        const seq = scene.userData.seq = seqHooks.create(opt_seq);
        console.log('frameMax for main seq: ' + seq.frameMax);
        sm.frameMax = seq.frameMax;
        return Promise.resolve('image list loaded!');
    });
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
