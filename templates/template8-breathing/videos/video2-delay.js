// video2-curves.js from template8-breathing
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
    const RADIUS = 3;
    //-------- ----------
    // BREATH MESH GROUP
    //-------- ----------
    const BreathGroup = {};

    const getMeshName = (gud, index_curve, index_mesh) => {
        return 'breath_id' + gud.id + '_curve' + index_curve + '_mesh' + index_mesh;
    };

    BreathGroup.update = (group, alpha) => {
        const gud = group.userData;
        let index_curve = 0;
        while(index_curve < gud.curveCount){
            //const a_curve_index = index_curve / gud.curveCount;
            const curve = gud.curvePath.curves[index_curve];

            let index_mesh = 0;
            while(index_mesh < gud.meshPerCurve){
                // get mesh object by name
                const name = getMeshName(gud, index_curve, index_mesh);
                const mesh = group.getObjectByName(name);

                mesh.position.copy( curve.getPoint(index_mesh / gud.meshPerCurve) );

                index_mesh += 1;
            }
            index_curve += 1;
        };
    };

    // main create method
    BreathGroup.create = (opt) => {
        opt = opt || {};
        const group = new THREE.Group();
        const gud = group.userData;
        gud.radiusMin = opt.radiusMin === undefined ? 0.75 : opt.radiusMin;
        gud.radiusMax = opt.radiusMax === undefined ? 3.00 : opt.radiusMax;
        gud.curveCount = opt.curveCount === undefined ? 15 : opt.curveCount;
        gud.meshPerCurve = opt.meshPerCurve === undefined ? 10 : opt.meshPerCurve;
        gud.curvePath = new THREE.CurvePath();
        gud.id = opt.id || '1';
        let index_curve = 0;
        while(index_curve < gud.curveCount){
            const a_curve_index = index_curve / gud.curveCount;
            // add current curve
            const e = new THREE.Euler();
            e.z = Math.PI * 2 * a_curve_index;
            const v_start = new THREE.Vector3(1, 0, 0);
            const v_end = new THREE.Vector3(1, 0, 0);
            v_start.applyEuler(e).multiplyScalar(gud.radiusMin);
            v_end.applyEuler(e).multiplyScalar(gud.radiusMax);

            const v_c1 = v_start.clone().lerp(v_end, 0.25);
            const v_c2 = v_start.clone().lerp(v_end, 0.75);
            const curve = new THREE.CubicBezierCurve3(v_start.clone(), v_c1, v_c2, v_end);
            gud.curvePath.add(curve);
            // add mesh objects for each curve
            let index_mesh = 0;
            const geometry = new THREE.SphereGeometry(0.1, 20, 20);
            while(index_mesh < gud.meshPerCurve){
                const mesh = new THREE.Mesh(geometry);
                mesh.name = getMeshName(gud, index_curve, index_mesh);
                group.add(mesh);
                index_mesh += 1;
            }
            index_curve += 1;
        };
        BreathGroup.update(group, 0);
        return group;
    };


const group = BreathGroup.create();
scene.add(group);

    //-------- ----------
    // HELPER FUNCTIONS
    //-------- ----------
/*
    const getControlRadian = (i, count, deg, alpha) => {
        return Math.PI * 2 * (i / count) + Math.PI / 180 * (deg * alpha);
    };
    // set the control points for a curve
    const setControlPoints = (curve, i, count, deg1, deg2, alpha) => {
        const v_start = curve.v0.clone();
        const v_end = curve.v3.clone();

        let ci = 0;
        while(ci < 2){
            const deg = ci === 0 ? deg1 : deg2;
            const cRadian = getControlRadian(i, count, deg, alpha);
            const cRadius = (ci === 0 ? 0.25 : 0.75) * RADIUS * alpha;
            const v = curve['v' + (ci + 1)];
            v.x = Math.cos(cRadian) * cRadius;
            v.y = Math.sin(cRadian) * cRadius;
            ci += 1;
        }
    };
    // create curve Path helper
    const createCurvePath = (count) => {
        const cp = new THREE.CurvePath();
        let i = 0;
        while(i < count){
            const v_start = new THREE.Vector3();
            const radian = getControlRadian(i, count, 0, 0, 0);
            const x = Math.cos(radian) * RADIUS;
            const y = Math.sin(radian) * RADIUS;
            const v_end = new THREE.Vector3(x,y,0);
            const v_c1 = new THREE.Vector3();
            const v_c2 = new THREE.Vector3();
            const curve = new THREE.CubicBezierCurve3(v_start, v_c1, v_c2, v_end);
            setControlPoints(curve, i, count, 0, 0, 0);
            cp.add(curve);
            i += 1;
        }
        return cp;
    };
    // create a mesh group of spheres
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
    // update a given mesh group with the given curve path and an alpha value
    const updateMeshGroup = (group, cp, alpha) => {
        const a2 = 1 - Math.abs(0.5 - alpha) / 0.5;
        let i = 0;
        const count = group.children.length;
        while(i < count){
            const mesh = group.children[i];
            const a_child = i / count;
            const index_curve = Math.floor( cp.curves.length * a_child );
            const curve = cp.curves[index_curve];


            setControlPoints(curve, i, count, 0, 0, a2);


            const a_point1 = i  % cp.curves.length / cp.curves.length * a2;
            const a_point2 = 0.2 + 0.8 * a_point1;

            mesh.position.copy( curve.getPoint(a_point2) );

            const s = 1 - (1 - a_point1) * 0.75;
            mesh.scale.set(s, s, s);
            i += 1;
        }
    };
    //-------- ----------
    // Curve Path, and Group used for breath circle
    //-------- ----------
    const cp = createCurvePath(8);
    const group = createMeshGroup(90);
    scene.add(group);
*/
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
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - DELAY PART
    opt_seq.objects[0] = {
        secs: DELAY_SECS,
        update: function(seq, partPer, partBias){
            //updateMeshGroup(group, cp, 0.5 - 0.5 * partPer);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - BREATH
    opt_seq.objects[1] = {
        secs: BREATH_SECS,
        update: function(seq, partPer, partBias){

            const sec = BREATH_SECS * partPer;
            const a1 = (sec % 60 / 60) * BREATHS_PER_MINUTE % 1;

            //updateMeshGroup(group, cp, a1);
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
 