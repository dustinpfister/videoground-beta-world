// video3-holdtime.js from template8-breathing
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // CONST VALUES
    //-------- ----------
    const BREATH_SECS = 60 * 5;
    const BREATH_PER_MINUTE = 5;
    const BREATH_PARTS = {restLow: 1, breathIn: 3, restHigh: 1, breathOut: 3};
    const BREATH_PARTS_SUM = Object.keys( BREATH_PARTS ).reduce( ( acc, key ) => { return acc + BREATH_PARTS[key]; }, 0);
    //-------- ----------
    // BREATH MESH GROUP
    //-------- ----------
    const BreathGroup = {};
    // get a mesh object name to be used when creating and getting mesh objects in breath group
    const getMeshName = (gud, index_curve, index_mesh) => {
        return 'breath_id' + gud.id + '_curve' + index_curve + '_mesh' + index_mesh;
    };
    // update curve control points and mesh object values
    BreathGroup.update = (group, alpha) => {
        const a2 = alpha; //Math.sin(Math.PI * 1 * alpha);
        const gud = group.userData;
        let index_curve = 0;
        while(index_curve < gud.curveCount){
            const curve = gud.curvePath.curves[index_curve];
            const v_start = curve.v0, v_c1 = curve.v1, v_c2 = curve.v2, v_end = curve.v3;
            const e1 = new THREE.Euler();
            e1.z = Math.PI / 180 * 60 * a2;
            const e2 = new THREE.Euler();
            e2.z = Math.PI / 180 * -60 * a2;
            v_c1.copy( v_start.clone().lerp(v_end, 0.25).applyEuler(e1) );
            v_c2.copy( v_start.clone().lerp(v_end, 0.75).applyEuler(e2) );
            let index_mesh = 0;
            while(index_mesh < gud.meshPerCurve){
                const name = getMeshName(gud, index_curve, index_mesh);
                const mesh = group.getObjectByName(name);
                const a_meshpos = (index_mesh + 1) / gud.meshPerCurve;
                // position
                mesh.position.copy( curve.getPoint(a_meshpos * a2) );
                // opacity
                const a_meshopacity = (1 - a_meshpos) * 0.50 + 0.50 * a2;
                mesh.material.opacity = a_meshopacity;
                // scale
                const s = 0.5 + 1.5 * a_meshpos * a2;
                mesh.scale.set( s, s, s );
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
        gud.radiusMin = opt.radiusMin === undefined ? 0.50 : opt.radiusMin;
        gud.radiusMax = opt.radiusMax === undefined ? 2.80 : opt.radiusMax;
        gud.curveCount = opt.curveCount === undefined ? 10 : opt.curveCount;
        gud.meshPerCurve = opt.meshPerCurve === undefined ? 10 : opt.meshPerCurve;
        gud.geometry = opt.geometry || new THREE.SphereGeometry(0.1, 20, 20);
        gud.material = opt.material || new THREE.MeshPhongMaterial();
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
            while(index_mesh < gud.meshPerCurve){
                const mesh = new THREE.Mesh(gud.geometry, gud.material.clone());
                mesh.material.transparent = true;
                mesh.name = getMeshName(gud, index_curve, index_mesh);
                group.add(mesh);
                index_mesh += 1;
            }
            index_curve += 1;
        };
        BreathGroup.update(group, 0);
        return group;
    };
    //-------- ----------
    // BREATH GROUP
    //-------- ----------
    const group = BreathGroup.create({});
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
            const sec = BREATH_SECS * partPer;
            const a1 = (sec % 60 / 60) * BREATH_PER_MINUTE % 1;


const keys = 'restLow,breathIn,restHigh,breathOut'.split(',');
const alpha_targets = keys.reduce((acc, key, i, arr) => {
   let a = BREATH_PARTS[ key ];
   if(i > 0){
      a += acc[i - 1]
   }
   acc.push( a );
   return acc;
}, []).map((n)=>{
    return n / BREATH_PARTS_SUM;
});


let ki = 0;
while(ki < keys.length){
    if(a1 < alpha_targets[ki]){
        const a_base = ki > 0 ? alpha_targets[ki - 1] : 0;
        const a_breathpart = (a1 - a_base) / (alpha_targets[ki] - a_base);

        //console.log(keys[ki], a_breathpart.toFixed(2));
        if(keys[ki] === 'restLow'){
            BreathGroup.update(group, 0);
        }
        if(keys[ki] === 'restHigh'){
            BreathGroup.update(group, 1);
        }
        if(keys[ki] === 'breathIn'){
            BreathGroup.update(group, Math.sin(Math.PI * 0.5 * a_breathpart));
        }
        if(keys[ki] === 'breathOut'){
            BreathGroup.update(group, 1 - Math.sin(Math.PI * 0.5 * a_breathpart));
        }

        break;
    }
    ki += 1;;
}
            //BreathGroup.update(group, a1);
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
 