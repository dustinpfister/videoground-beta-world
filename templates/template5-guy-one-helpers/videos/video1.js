// video1 for template5-guy-one-helpers
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-plane/r0/text-plane.js',
   '../../../js/guy/r0/guy.js',
   '../../../js/texture/r0/texture.js',
   '../guy-helpers.js' // <== Using a Video folder level helpers file
];
// init
VIDEO.init = function(sm, scene, camera){
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
    // TEXT PLANE HELPERS
    //-------- ----------
    // set style helper
    const setLineStyle = (plane_text, pxSize, font ) => {
        const state = plane_text.userData.canObj.state;
        state.lines.forEach((line)=>{
            line.fs = pxSize + 'px';
            line.f = font || 'arial';
        })
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
        w: 3.2, h: 2.4,
        rows: 10, size: 256,
        palette: [TEXT_BGCOLOR, TEXT_FONTCOLORS[0], TEXT_FONTCOLORS[1]]
    });
    plane_text.position.set(-2, 2, 0);
    plane_text.rotation.set(0, Math.PI / 180 * 45, 0);
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
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    const v3Array_campos = helper.QBV3Array([
        [5,5,5, 4,2,-4,    1,0,1,      100]
    ]);
    //scene.add( helper.QBDebugV3Array(v3Array_campos, 0.1, new THREE.Color(0, 1, 1)) );
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            // guy defaults
            helper.updateGuyEffect(guy1, 0);
            // camera defaults
            camera.position.set(5, 5, 5);
            camera.lookAt(guy1.group.position);
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };

    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // GUY1

            //guy1.moveHead(1 / 8 * partPer);
            guy1.walk(1 / 4 * 0.25 + partPer, 4);
            const v3_guypos = new THREE.Vector3();
            v3_guypos.z = -5 + 5 * partPer;
            helper.setGuyPos(guy1, v3_guypos);
            GUYANI.static1( 0 );
            // TEXT
            updateText(plane_text, partPer, 0);
        }
     };


/*
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // GUY1
            helper.updateGuyEffect(guy1, 0);
            guy1.moveHead(1 / 8 * partPer);
            guy1.walk(1 / 4 * 0.25 + partPer, 4);
            const v3_guypos = new THREE.Vector3();
            v3_guypos.z = -5 + 5 * partPer;
            helper.setGuyPos(guy1, v3_guypos);
            // smile
            GUYANI.talk( seq.getBias(8) );
            // TEXT
            updateText(plane_text, partPer, 0);
        }
     };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // GUY1
            helper.updateGuyEffect(guy1, seq.getSinBias(1));
            guy1.moveHead(1 / 8);
            guy1.walk(1 / 2 * 0.25, 2);
            const v3_guypos = new THREE.Vector3();
            helper.setGuyPos(guy1, v3_guypos);
            // smile
            GUYANI.smile_creepy( 1 );
            // TEXT
            updateText(plane_text, partPer, 1);
            // CAMERA
            seq.copyPos('campos', camera);
            camera.lookAt(guy1.group.position);
        }
    };
*/
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
        guy1 = helper.createGuyHScale(3, 5, 8, material);
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
 