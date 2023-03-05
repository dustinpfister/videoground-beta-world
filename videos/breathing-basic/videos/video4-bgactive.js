// video4-bgactive.js from breathing-basic beta world video project
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
    const BREATH_SECS = 60 * 1.0;
    const BREATH_PER_MINUTE = 5;
    const BREATH_SECS_PER_CYCLE = 60 / BREATH_PER_MINUTE;
    const BREATH_PARTS = {restLow: 1, breathIn: 5, restHigh: 1, breathOut: 5};
    const CIRCLE_COUNT = 3;
    //!!! might want to add this as a public method for R1 of breath.js
    const secsToTimeStr = (totalSecs) => {
        const minutes = Math.floor( totalSecs / 60 );
        const secs = Math.floor(totalSecs % 60);
        return String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0')
    };
    //!!! might want to make this public, or have a GUD prop
    // get the sum of a breath parts object
    const getBreathPartsSum = (breathParts) => {
        return Object.keys( breathParts ).reduce( ( acc, key ) => { return acc + breathParts[key]; }, 0);
    };
    const BREATH_PARTS_SUM = getBreathPartsSum(BREATH_PARTS);
    const BREATH_TIMESTR = secsToTimeStr( BREATH_SECS );
    const BREATH_PARTS_STR = Object.keys(BREATH_PARTS).reduce( (acc, key, i) => {
        const n = BREATH_PARTS[key];
        const a = n / BREATH_PARTS_SUM;
        const s = BREATH_SECS_PER_CYCLE * a;
        acc += s.toFixed(2) + (i === 3 ? '' : ', ');
        return acc;
    }, '');
    //-------- ----------
    // CANVAS TEXTURES - for the background, mesh objects, ect
    //-------- ----------
    // canvas object for the background
    const canObj_bg = canvasMod.create({
        size: 256,
        palette: ['#00eeee', '#0000ee', '#dfdfdf'],
        state: {
            a_gradient: 1,
            a_dots: 0.5,
            dots: [
                [ 0, 0.85 ],   [ 45, 0.39 ],  [ 90, 0.52 ],  [ 180, 0.32 ],
                [ 270, 0.60 ], [ 315, 0.38 ], [ 350, 0.61],  [ 60, 0.90],
                [ 120, 0.84 ], [ 140, 0.81 ], [ 155, 0.49],  [ 170, 0.93],
                [ 195, 0.96 ], [ 210, 0.42 ], [ 220, 0.76],  [ 240, 0.22],
                [ 260, 0.84 ], [ 280, 0.24 ], [ 300, 0.37],  [ 290, 0.41],
                [ 330, 0.77 ], [ 337, 0.19 ], [ 370, 0.09],  [ 390, 0.55],
                [ 70, 0.96 ], [ 80, 0.52 ], [ 105, 0.11],  [ 130, 0.45],
            ]
        },
        draw: (canObj, ctx, canvas, state) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0.4 - 0.4 * state.a_gradient, canObj.palette[0]);
            gradient.addColorStop(0.6 + 0.4 * state.a_gradient, canObj.palette[1]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0, canvas.width, canvas.height);
            state.dots.forEach( (arr) => {
                const radian = Math.PI / 180 * arr[0];
                const unit_length = (arr[1] + state.a_dots) % 1;
                const v2 = new THREE.Vector2(0, 1);
                v2.x = canvas.width / 2 + Math.cos(radian) * unit_length * (canvas.width * 0.8);
                v2.y = canvas.height / 2 + Math.sin(radian) * unit_length * (canvas.height * 0.8);

                const color_dot = new THREE.Color(canObj.palette[2]);
                ctx.fillStyle = color_dot.getStyle();
                ctx.beginPath();
                const radiusX = canvas.width / (16 * 6);
                const radiusY = canvas.height / (16 * 6);
                ctx.ellipse(v2.x, v2.y, radiusX, radiusY, 0, 0, Math.PI * 2);
                ctx.fill();
            });

        }
    });
    const texture_bg = canObj_bg.texture;
//texture_bg.repeat.x = 2;
//texture_bg.

    scene.background = texture_bg;
    // texture for circles
    const canObj_circles = canvasMod.create({
        size: 32,
        palette: ['#ffff00', '#ff0000'],
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
        palette: ['#ffffff', '#000000', '#afafaf'],
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
    // diffue color map for the plane that faces the camera
    const canObj_plane_map = canvasMod.create({
        size: 512,
        palette: ['rgba(0,0,0,0.5)', '#ffffff', '#ffff00', '#00ff00'],
        state: {
           frame: 0, frameMax: 100,
           a_video: 0.5, a_breath: 0.5,
           timeStr: ''
        },
        draw: (canObj, ctx, canvas, state) => {
            ctx.clearRect( 0, 0, canvas.width, canvas.height );
            ctx.fillStyle = canObj.palette[0];
            ctx.fillRect(0,0, canvas.width, canvas.height);
            // whole video progress
            ctx.fillStyle = canObj.palette[3];
            ctx.fillRect(0,0, canvas.width * state.a_video, 5);
            // breath progress
            ctx.fillStyle = canObj.palette[2];
            ctx.fillRect(0,5, canvas.width * state.a_breath, 5);
            ctx.fillStyle = canObj.palette[1];
            // text info
            ctx.font = '20px arial';
            ctx.textBaseline = 'top';
            ctx.fillText('BPM: ' + BREATH_PER_MINUTE + ' ( ' + BREATH_SECS_PER_CYCLE.toFixed(1) +' sec cycles )', 5, 20);
            ctx.fillText('PARTS: ' + BREATH_PARTS_STR, 5, 40);
            ctx.fillText(state.timeStr + ' / ' + BREATH_TIMESTR, 5, 80);
            ctx.fillText(state.frame + ' / ' + state.frameMax, 5, 100);
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
        alphaMap: texture_plane_alpha,
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
        1,
        1
    );
    const group_plane = new THREE.Group();
    group_plane.add(mesh_plane_1);
    group_plane.add(camera);
    scene.add(group_plane);
    mesh_plane_1.position.z = 6.625;
    //-------- ----------
    // CIRCLES - the circles behind the group of spheres that follow curves created by breath.js R0
    //-------- ----------
    // update circle group
    const updateCircleGroup = (group_circles, alpha) => {
        group_circles.children.forEach( (mesh, i, arr) => {
            const sd = (i + 1) * 0.75 * alpha;
            const s = 1 + sd;
            group_circles.scale.set(s, s, s);
            mesh.material.opacity = 0.25 + 1 / (arr.length + 0) * i * 0.5 * alpha;
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
            let canState = canObj_plane_map.state;
            canState.frame = seq.frame;
            canState.frameMax = seq.frameMax;
            canState.a_video = seq.per;
            // this is done in R0 of breath.js but it is not public, added a fix for R1 in the todo list
            const gud = group.userData;
            const sec = gud.totalBreathSecs * gud.a_fullvid;
            const a1 = (sec % 60 / 60) * gud.breathsPerMinute % 1;
            canState.a_breath = a1;
            canState.timeStr = secsToTimeStr(sec);
            canvasMod.update(canObj_plane_map);
            // background
            canState = canObj_bg.state;
            canState.a_gradient = Math.sin( Math.PI * 1.0 * a1 );
            canState.a_dots = seq.per;
            canvasMod.update(canObj_bg);
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
 