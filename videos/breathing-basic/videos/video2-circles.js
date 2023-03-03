// video3-breathr0.js from template8-breathing
//    * using breath.js R0
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/breath/r0/breath.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // CONST VALUES
    //-------- ----------
    const BREATH_SECS = 60 * 2;
    const BREATH_PER_MINUTE = 5;
    const BREATH_PARTS = {restLow: 1, breathIn: 5, restHigh: 1, breathOut: 5};


    const material_orbs = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.1,
        transparent: true
    });

    const material_circles = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.1,
        transparent: true
    });

    //-------- ----------
    // CIRCLES
    //-------- ----------
    // update circle group
    const updateCircleGroup = (group_circles, alpha) => {
        group_circles.children.forEach( (mesh, i, arr) => {
            const sd = (i + 1) * 0.75 * alpha;
            const s = 1 + sd;
            group_circles.scale.set(s, s, s);
            mesh.material.opacity = 0.25 + 1 / arr.length * (i + 1) * 0.75 * alpha;
        });
    };
    // create circle group
    const group_circles = new THREE.Group();
    let ic = 0;
    while(ic < 3){
        const mesh = new THREE.Mesh(new THREE.CircleGeometry(1, 30), material_circles.clone() );
        mesh.position.z = -0.5 - 1 * ic;
        group_circles.add(mesh);
        ic += 1;
    }
    scene.add(group_circles);
    updateCircleGroup(group_circles, 0);
    //-------- ----------
    // BREATH GROUP 
    //-------- ----------
    const group = BreathMod.create({
        totalBreathSecs: BREATH_SECS,
        breathsPerMinute: BREATH_PER_MINUTE,
        breathParts: BREATH_PARTS,
        curveCount: 20,
        meshPerCurve: 16,
        radiusMin: 0.5, radiusMax: 12,
        curveUpdate: (curve, alpha, v_c1, v_c2, v_start, v_end, gud, group) => {
            const e1 = new THREE.Euler();
            e1.z = Math.PI / 180 * 60 * alpha;
            const e2 = new THREE.Euler();
            e2.z = Math.PI / 180 * -60 * alpha;
            v_c1.copy( v_start.clone().lerp(v_end, 0.25).applyEuler(e1) );
            v_c2.copy( v_start.clone().lerp(v_end, 0.75).applyEuler(e2) );
        },
        meshUpdate: (mesh, curve, alpha, index, count, group, gud) => {
            // position
            const a_meshpos = (index + 1) / count;
            mesh.position.copy( curve.getPoint(a_meshpos * alpha) );
            // opacity
            const a_meshopacity = (1 - a_meshpos) * 0.50 + 0.50 * alpha;
            mesh.material.opacity = a_meshopacity;
            // scale
            const s = 0.25 + 2.25 * a_meshpos * Math.sin(Math.PI * 0.5 * alpha);
            mesh.scale.set( s, s, s );
        },
        hooks : {
            restLow : (updateGroup, group, a_breathPart, a_fullvid, gud) => {
                updateGroup(group, 0);
                updateCircleGroup(group_circles, 0);
            },
            restHigh : (updateGroup, group, a_breathPart, a_fullvid, gud) => {
                updateGroup(group, 1);
                updateCircleGroup(group_circles, 1);
            },
            breathIn : (updateGroup, group, a_breathPart, a_fullvid, gud) => {
                const a1 = Math.sin(Math.PI * 0.5 * a_breathPart);
                updateGroup(group, a1);
                updateCircleGroup(group_circles, a1);
            },
            breathOut : (updateGroup, group, a_breathPart, a_fullvid, gud) => {
                const a1 = 1 - Math.sin(Math.PI * 0.5 * a_breathPart);
                updateGroup(group, a1);
                updateCircleGroup(group_circles, a1);
            }
        },
        material: material_orbs
    });
    scene.add(group);
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(0,2,1)
    scene.add(dl);
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
            BreathMod.update(group, seq.per);
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 1 - BREATH
    opt_seq.objects[0] = {
        secs: BREATH_SECS,
        update: function(seq, partPer, partBias){
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
 