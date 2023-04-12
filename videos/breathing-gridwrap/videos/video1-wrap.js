// video4-message.js from breathing-basic beta world video project
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/breath/r1/breath.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // CONST VALUES
    //-------- ----------
    const BREATH_SECS = 60 * 10;
    const BREATH_PER_MINUTE = 6;
    const BREATH_SECS_PER_CYCLE = 60 / BREATH_PER_MINUTE;
    const BREATH_PARTS = {restLow: 1, breathIn: 4, restHigh: 1, breathOut: 4};
    const CIRCLE_COUNT = 3;
    //-------- ----------
    // BREATH GROUP 
    //-------- ----------
    const group = BreathMod.create({
        totalBreathSecs: BREATH_SECS,
        breathsPerMinute: BREATH_PER_MINUTE,
        breathParts: BREATH_PARTS,
        hooks : {
            restLow : (updateGroup, group, a_breathPart, a_fullvid, gud) => {
            },
            restHigh : (updateGroup, group, a_breathPart, a_fullvid, gud) => {
            },
            breathIn : (updateGroup, group, a_breathPart, a_fullvid, gud) => {
            },
            breathOut : (updateGroup, group, a_breathPart, a_fullvid, gud) => {
            }
        }
    });
    scene.add(group);
    const BREATH_GUD = group.userData;
    //-------- ----------
    // CANVAS TEXTURES - for the background, mesh objects, ect
    //-------- ----------
    const canObj_bg = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#000000', '#1f1f1f', '#00ffff'],
        dataParse: 'lzstring64',
        state: { w: 8, h: 5, data: 'AwGlEYyzNCVgpcmPit1mqvTsg===' }
    });
    // can use LZString to compress and decompress
    //console.log( LZString.decompressFromBase64('AwGlEYyzNCVgpcmPit1mqvTsg===') );
    // I want to repeat the texture
    const texture_bg = canObj_bg.texture;
    texture_bg.wrapS = THREE.RepeatWrapping;
    texture_bg.wrapT = THREE.RepeatWrapping;
    texture_bg.repeat.set(32, 24);
    scene.background = texture_bg;
    // texture for circles
    const canObj_circles = canvasMod.create({
        size: 32,
        palette: ['#888800', '#ff0000'],
        state: {},
        draw: (canObj, ctx, canvas, state) => {
            ctx.fillStyle = canObj.palette[0];
            ctx.fillRect(0,0, canvas.width, canvas.height);
            ctx.strokeStyle = canObj.palette[1];
            ctx.beginPath();
            const radius = canvas.width / 2;
            ctx.lineWidth = 3;
            ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
    const texture_circles = canObj_circles.texture;
    // alpha map for the plane that faces the camera
    const canObj_plane_alpha = canvasMod.create({
        size: 128,
        palette: ['#ffffff', '#000000', '#4f4f4f'],
        state: { },
        draw: (canObj, ctx, canvas, state) => {
            ctx.fillStyle = canObj.palette[1];
            ctx.fillRect(0,0, canvas.width, canvas.height);
            ctx.fillStyle = canObj.palette[2];
            const ymax = canvas.height / 4;
            ctx.beginPath();
            ctx.moveTo( 0, 0 );
            ctx.lineTo( 0, ymax );
            ctx.lineTo( canvas.width / 4, ymax);
            ctx.bezierCurveTo(
                canvas.width * 0.5, ymax * 1.00,
                canvas.width * 0.75, ymax * 0.50,
                canvas.width, ymax / 2 );
            ctx.lineTo(canvas.width, 0);
            ctx.fill();
        }
    });
    const texture_plane_alpha = canObj_plane_alpha.texture;
    // diffuse color map for the plane that faces the camera
    const canObj_plane_map = canvasMod.create({
        size: 512,
        palette: ['#000000', '#ffffff', '#00ff00', '#ffff00'],
        state: {
           frame: 0, frameMax: 100,
           visible: true,
           opacity: 0.5,
           a_video: 0.5, a_breath: 0.5,
           currentMessage: 'open',
           messages: {
               open: [
                   { text: BREATH_GUD.totalTimeString + ' Meditation time', mx: 0.1, my: 0.45},
                   { text: BREATH_SECS_PER_CYCLE.toFixed(1) + ' Second Breath Cycles.', mx: 0.1, my: 0.5},
                   { text: 'Timing', mx: 0.1, my: 0.6, size: 15},
                   { text: BREATH_GUD.breathPartsString, mx: 0.1, my: 0.627, size: 15},
                   { text: 'This is video1-wrap.js of \"breathing-gridwrap\" in \"videoground-beta-world\" collection.', mx: 0.1, my: 0.75, size: 10}
               ],
               end: [
                   { text: 'Good Job', mx: 0.5, my: 0.5, ta: 'center', size: 60 },
                   { text: 'Have a calm and productive day.', mx: 0.5, my: 0.6, ta: 'center'}
               ]
           },
           timeStr: ''
        },
        draw: (canObj, ctx, canvas, state) => {
            ctx.clearRect(0,0, canObj.size, canObj.size);
            ctx.globalAlpha = state.opacity;
            if(state.visible){
                ctx.fillStyle = canObj.palette[0];
                ctx.fillRect( 0, 0, canObj.size, canObj.size );
                ctx.fillStyle = canObj.palette[1];
                //ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                //ctx.font = '20px arial';
                state.messages[state.currentMessage].forEach( (textLine) => {
                    ctx.font = (textLine.size || 20) + 'px arial';
                    ctx.textAlign = textLine.ta || 'left';
                    ctx.fillText(textLine.text, canObj.size * textLine.mx, canObj.size * textLine.my);
                });
           }
        }
    });
    const texture_plane_map = canObj_plane_map.texture;
    //-------- ----------
    // MATERIALS
    //-------- ----------
    const material_orbs = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0xffffff,
        emissiveIntensity: 0.1,
        transparent: true
    });
    const material_circles = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.1,
        transparent: true,
        map: texture_circles
    });
    const material_plane = new THREE.MeshBasicMaterial({
        map: texture_plane_map, 
        //alphaMap: texture_plane_alpha,
        transparent: true,
        opacity: 1
    });
    //-------- ----------
    // PLANE
    //-------- ----------
    const geometry_plane = new THREE.PlaneGeometry(1, 1, 1, 1);
    const mesh_plane_1 = new THREE.Mesh(geometry_plane, material_plane);
    mesh_plane_1.scale.set(
        camera.aspect,
        camera.aspect,
        camera.aspect
    );
    const group_plane = new THREE.Group();
    group_plane.add(mesh_plane_1);
    group_plane.add(camera);
    scene.add(group_plane);
    mesh_plane_1.position.z = 6.63;
    //-------- ----------
    // CIRCLES - the circles behind the group of spheres that follow curves created by breath.js R0
    //-------- ----------
    // update circle group
    const updateCircleGroup = (group_circles, alpha) => {
        group_circles.children.forEach( (mesh, i, arr) => {
            const sd = (i + 1) * 0.75 * alpha;
            const s = 1 + sd;
            group_circles.scale.set(s, s, s);
            mesh.material.opacity = 0.25 + 1 / arr.length * i * 0.75 * alpha;
        });
    };
    // create circle group
    const group_circles = new THREE.Group();
    let ic = 0;
    while(ic < CIRCLE_COUNT){
        const mesh = new THREE.Mesh(new THREE.CircleGeometry(1, 30), material_circles.clone() );
        mesh.position.z = -0.5 - 1 * ic;
        group_circles.add(mesh);
        ic += 1;
    }
    scene.add(group_circles);
    updateCircleGroup(group_circles, 0);

    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(0,2,1)
    scene.add(dl);
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            // camera
            camera.position.set(0, 0, 8);
            camera.zoom = 1;
            // breath grouo
            BreathMod.update(group, seq.per);
            // diffuse map for plane
            const canState = canObj_plane_map.state;
            canState.frame = seq.frame;
            canState.frameMax = seq.frameMax;
            canState.a_video = seq.per;
            // this is done in R0 of breath.js but it is not public, added a fix for R1 in the todo list
            const gud = group.userData;
            const sec = gud.totalBreathSecs * gud.a_fullvid;
            const a1 = (sec % 60 / 60) * gud.breathsPerMinute % 1;
            canState.a_breath = a1;
            canState.timeStr = BREATH_GUD.timeString; //secsToTimeStr(sec);
            canObj_plane_map.state.visible = false;
            canObj_plane_map.state.opacity = 0.5;
            canObj_plane_map.state.currentMessage = 'open';
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
            canvasMod.update(canObj_plane_map);
        },
        objects: []
    };
    opt_seq.objects[0] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            canObj_plane_map.state.visible = true;
            camera.position.set(0, 0, 8);
            camera.lookAt(0,0,0);
        }
    };
    opt_seq.objects[1] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            canObj_plane_map.state.visible = true;
            canObj_plane_map.state.opacity = 0.5 - 0.5 * partPer;
            camera.position.set(0, 0, 8);
            camera.lookAt(0,0,0);
        }
    };
    // SEQ 1 - BREATH
    opt_seq.objects[2] = {
        secs: BREATH_SECS - 20,
        update: function(seq, partPer, partBias){
            camera.position.set(0, 0, 8);
            camera.lookAt(0,0,0);
        }
    };


    opt_seq.objects[3] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            canObj_plane_map.state.visible = true;
            canObj_plane_map.state.opacity = 0.5 * partPer;
            canObj_plane_map.state.currentMessage = 'end';
            camera.position.set(0, 0, 8);
            camera.lookAt(0,0,0);
        }
    };
    opt_seq.objects[4] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            canObj_plane_map.state.visible = true;
            canObj_plane_map.state.currentMessage = 'end';
            camera.position.set(0, 0, 8);
            camera.lookAt(0,0,0);
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
 