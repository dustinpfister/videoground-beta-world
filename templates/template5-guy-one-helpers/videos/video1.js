// video1 for template5-guy-one-helpers
// scripts
VIDEO.scripts = [
   // CORE MODULES
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/curve/r0/curve.js',
   // ADDITIONAL
   '../../../js/canvas-text-plane/r0/text-plane.js',
   '../../../js/guy/r0/guy.js',
   '../../../js/texture/r0/texture.js',
   '../guy-helpers.js' // <== Using a Video folder level helpers file
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
    // TEXT CONST
    //-------- ----------
    const TEXT_PXSIZE = 40;
    const TEXT_BLANK_START_LINES = 7;
    const TEXT_CHAR_PER_LINE = 9;
    const TEXT_STARTY = 10;
    const TEXT_BGCOLOR = 'rgba(0,0,0,0.4)';
    const TEXT_FONTCOLORS = ['lime', 'white'];
    const TEXT = [
        'Hello, this is just some sample text.',
        'So this is some more demo text for another seq object or whatever, this is a template file after all here.'
    ];
    const TEXT_LINES = TEXT.map( (str) => {
        const lines = TextPlane.createTextLines(str + ' ', TEXT_CHAR_PER_LINE);
        let i = 0;
        while(i < TEXT_BLANK_START_LINES){
            lines.unshift('');
            i += 1;
        }
        return lines;
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
    // TEXT PLANE HELPERS
    //-------- ----------
    // set style helper
    const setLineStyle = (plane_text, pxSize, font ) => {
        const state = plane_text.userData.canObj.state;
        state.lines.forEach( (line) => {
            line.fs = pxSize + 'px';
            line.f = font || 'arial';
        });
    };
    // update text helper
    const updateText = (plane_text, alpha, TLIndex) => {
        // move the text lines ( lines, testLines, alpha, startY, deltaY )
        const lines = plane_text.userData.canObj.state.lines;
        TextPlane.moveTextLines(lines, TEXT_LINES[TLIndex], alpha, TEXT_STARTY, TEXT_PXSIZE);
        // update the canave
        canvasMod.update(plane_text.userData.canObj);
    };
    //-------- ----------
    // TEXT PLANE MESH OBJECT
    //-------- ----------
    const plane_text = TextPlane.createPlane({
        w: 8 * SCALE, h: 4.5 * SCALE,
        rows: 10, size: 256,
        palette: [TEXT_BGCOLOR, TEXT_FONTCOLORS[0], TEXT_FONTCOLORS[1]]
    });
    plane_text.position.set(-5.4 * SCALE, 5.3 * SCALE, -1 * SCALE);
    //plane_text.position.set(-2, 2, 0);
    plane_text.rotation.set(0, Math.PI / 180 * 90, 0);
    scene.add(plane_text);
    // Set Line Style 
    setLineStyle(plane_text, TEXT_PXSIZE, 'courier');
    updateText(plane_text, 0, 0);
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
    // GRID
    //-------- ----------
    //const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
    //-------- ----------
    // PATHS
    //-------- ----------
    const v3Array_campos = curveMod.QBV3Array([
        [10, 10, 10, 7, 7,-7,    0, 0, 0,      100]
    ]);
    //scene.add( curveMod.debugPoints( v3Array_campos ) );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            // guy defaults
            helper.updateGuyEffect(guy1, 0);
            guy1.walk(1 / 2 * 0.25, 2);
            guy1.moveHead(0);
            helper.setGuyPos(guy1, new THREE.Vector3(1.5 * SCALE, 0, 0));
            // TEXT
            updateText(plane_text, seq.per, 0);
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
    // SEQ0 - demo of guy walking with fixed face
    opt_seq.objects[0] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            // GUY1
            guy1.walk(1 / 4 * 0.25 + partPer, 4);
            const v3_guypos = new THREE.Vector3();
            v3_guypos.x = 1.5 * SCALE;
            //v3_guypos.z = -5 + 5 * partPer;
            v3_guypos.z = -10 * SCALE + 10 * SCALE * partPer;
            helper.setGuyPos(guy1, v3_guypos);
            GUYANI.static1( 0 );
        }
    };
    // SEQ1 - camera moves in closer and looks at head rather than body, head turns
    opt_seq.objects[1] = {
        secs: 2,
        update: function(seq, partPer, partBias){
            // GUY1
            guy1.moveHead(1 / 8 * partPer);
            GUYANI.static1( 0 );
            // CAMERA
            const a = 10 - 6 * partPer;
            camera.position.set(a, a, a);
            const v1 = guy1.group.position.clone();
            const v2 = new THREE.Vector3();
            guy1.head.getWorldPosition(v2);
            camera.lookAt( v1.lerp(v2, partPer) );
        }
    };
    // SEQ2 - head talks
    opt_seq.objects[2] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            // GUY1
            guy1.moveHead(1 / 8);
            GUYANI.talk( seq.getBias( 16 ) );
            // CAMERA
            camera.position.set(4, 4, 4);
            const v2 = new THREE.Vector3();
            guy1.head.getWorldPosition(v2);
            camera.lookAt( v2);
        }
    };
    // SEQ3 - creepy smile
    opt_seq.objects[3] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // GUY1
            guy1.moveHead(1 / 8);
            GUYANI.smile_creepy( partPer );
            // CAMERA
            camera.position.set(4, 4, 4);
            const v2 = new THREE.Vector3();
            guy1.head.getWorldPosition(v2);
            camera.lookAt( v2);
        }
    };
    // SEQ4 - camera moves out
    opt_seq.objects[4] = {
        secs: 2,
        update: function(seq, partPer, partBias){
            // GUY1
            guy1.moveHead(1 / 8);
            GUYANI.smile_creepy( 1 );
            // CAMERA
            const a = 4 + 6 * partPer;
            camera.position.set(a, a, a);
            const v1 = new THREE.Vector3();
            guy1.head.getWorldPosition(v1);
            const v2 = guy1.group.position.clone();
            camera.lookAt( v1.lerp(v2, partPer) );
        }
    };
    // SEQ 4 - EFFECT DEMO
    opt_seq.objects[5] = {
        secs: 13,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // GUY1
            helper.updateGuyEffect(guy1, seq.getSinBias(1));
            guy1.moveHead(1 / 8);
            GUYANI.smile_creepy( 1 );
            // CAMERA
            seq.copyPos('campos', camera);
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
        const canObj_head = helper.createCanvasHead(textureObj);
        //-------- ----------
        // MATERIALS
        //-------- ----------
        // create textures from canvas
        const material = helper.createMaterials();
        material.body.color = new THREE.Color(1, 1, 1);
        // set up the head textures
        helper.setHeadTextures(canObj_head, [
            ['face',   0, 0, 0, true],
            ['back',   2, 0, 1, false],
            ['left',   1, 0, 2, false], 
            ['right',  3, 0, 3, false],
            ['top',    0, 1, 4, false],
            ['bottom', 1, 1, 5, false]
        ], material, 'smile_sheet_128');
        // CREATE ANI ALPHA FUNCTIONS
        GUYANI = helper.createHeadAniAlphas(canObj_head, [
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
        //helper.setHeadCanvasTo(canObj_head, 3, 0, 'smile_creepy_128');
        //-------- ----------
        // create guy1
        //-------- ----------
        guy1 = helper.createGuyHScale(SCALE * 6, 5, 8, material);
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
 