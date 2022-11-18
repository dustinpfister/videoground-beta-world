// video1 for template5-guy-one-helpers
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/guy/r0/guy.js',
   '../../../js/texture/r0/texture.js',
   '../helpers.js' // <== Using a Video folder level helpers file
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // GUY
    //-------- ----------
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
            camera.position.set(5, 5, 5);
            camera.lookAt(guy1.group.position);
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // update guy1
            helper.updateGuyEffect(guy1, 0);
            guy1.moveHead(1 / 8 * partPer);
            guy1.walk(1 / 4 * 0.25 + partPer, 4);
            const v3_guypos = new THREE.Vector3();
            v3_guypos.z = -5 + 5 * partPer;
            helper.setGuyPos(guy1, v3_guypos);
            
        }
     };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // update guy1
            helper.updateGuyEffect(guy1, seq.getSinBias(1));
            guy1.moveHead(1 / 8);
            guy1.walk(1 / 2 * 0.25, 2);
            const v3_guypos = new THREE.Vector3();
            helper.setGuyPos(guy1, v3_guypos);
            // camera
            seq.copyPos('campos', camera);
            camera.lookAt(guy1.group.position);
        }
    };

    //-------- ----------
    // LOAD IMAGES
    //-------- ----------
    return textureMod.load({
        URLS_BASE: videoAPI.pathJoin(sm.filePath, '../../../img/smile/'),
        URLS: ['smile_sheet_128.png']
    }).then( (textureObj) => {
        //-------- ----------
        // TEXTURES
        //-------- ----------
        // draw from sheet method
        const drawFromSheet = (canObj, ctx, canvas, state) => {
            ctx.fillStyle = 'black';
            ctx.fillRect(0,0, canvas.width, canvas.height);
            const img = state.textureObj[state.key].image;
            const sx = state.xi * 32;
            const sy = state.yi * 32;
            ctx.drawImage(img, sx, sy, 32, 32, 0, 0, 32, 32);
        };
        // create the canvas object
        const canObj_head = canvasMod.create({
            size: 32,
            update_mode: 'canvas',
            state: {
                textureObj: textureObj,
                key: 'smile_sheet_128',
                xi: 1, yi: 0
            },
            draw: drawFromSheet
        });
        // create a new canvas texture from the current state of the given canvas element
        const copyCanvas = (canvas_source) => {
             const canvas_new = document.createElement('canvas');
             const ctx = canvas_new.getContext('2d');
             canvas_new.width = canvas_source.width;
             canvas_new.height = canvas_source.height;
             ctx.drawImage(canvas_source, 0, 0, canvas_new.width, canvas_new.height);
             return new THREE.CanvasTexture(canvas_new);
        };
        //-------- ----------
        // MATERIALS
        //-------- ----------
        // set the head canvas to the given cell index in the given sheet key
        const setHeadCanvasTo = (canObj_head, xi, yi, key) => {
            const state = canObj_head.state;
            state.xi = xi;
            state.yi = yi;
            state.key = key || state.key;
            canvasMod.update(canObj_head);
        };
        // create textures from canvas
        // HEAD LEFT
        setHeadCanvasTo(canObj_head, 1, 0, 'smile_sheet_128');
        const texture_head_left = copyCanvas(canObj_head.canvas);
        // HEAD BACK
        setHeadCanvasTo(canObj_head, 2, 0, 'smile_sheet_128');
        const texture_head_back = copyCanvas(canObj_head.canvas);
        // HEAD RIGHT
        setHeadCanvasTo(canObj_head, 3, 0, 'smile_sheet_128');
        const texture_head_right = copyCanvas(canObj_head.canvas);
        // HEAD TOP
        setHeadCanvasTo(canObj_head, 0, 1, 'smile_sheet_128');
        const texture_head_top = copyCanvas(canObj_head.canvas);
        // HEAD BOTTOM
        setHeadCanvasTo(canObj_head, 1, 1, 'smile_sheet_128');
        const texture_head_bottom = copyCanvas(canObj_head.canvas);
        // HEAD FACE
        setHeadCanvasTo(canObj_head, 0, 0, 'smile_sheet_128');
        const texture_head_face = canObj_head.texture;
        const material = helper.createMaterials();
        material.body.color = new THREE.Color(1, 1, 1);
        material.head = [
            // 0 used for the face
            new THREE.MeshLambertMaterial({
                color: 0xffffff, side: THREE.DoubleSide, map: texture_head_face
            }),
            // 1 
            new THREE.MeshLambertMaterial({
                color: 0xffffff, side: THREE.DoubleSide, map: texture_head_back
            }),
            // 2 
            new THREE.MeshLambertMaterial({
                color: 0xffffff, side: THREE.DoubleSide, map: texture_head_left
            }),
            // 3 
            new THREE.MeshLambertMaterial({
                color: 0xffffff, side: THREE.DoubleSide, map: texture_head_right
            }),
            // 4 
            new THREE.MeshLambertMaterial({
                color: 0xffffff, side: THREE.DoubleSide, map: texture_head_top
            }),
            // 5 
            new THREE.MeshLambertMaterial({
                color: 0xffffff, side: THREE.DoubleSide, map: texture_head_bottom
            })
        ];
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
 