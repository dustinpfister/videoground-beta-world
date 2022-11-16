(function(api){
    //-------- ----------
    // MATERIALS
    //-------- ----------
    api.createMaterials = () => {
        const material = {};
        material.leg = new THREE.MeshLambertMaterial({
                color: 0x00aaff, side: THREE.DoubleSide
        });
        // material used for the arms
        material.arm = new THREE.MeshLambertMaterial({
                color: 0x00ff88, side: THREE.DoubleSide
            });
        // material used for the body
        material.body = new THREE.MeshLambertMaterial({
                color: 0x00ff88, side: THREE.DoubleSide
            });
        // array of materials used for the head
        material.head = [
            // 0 default material
            new THREE.MeshLambertMaterial({
                color: 0xffaf00, side: THREE.DoubleSide
            }),
            // 1 used for the face
            new THREE.MeshLambertMaterial({
                color: 0xffffff, side: THREE.DoubleSide
            })
        ];
        return material;
    };
    //-------- ----------
    // GUY ONE R0 HELPERS
    //-------- ----------
    // create guy helper
    api.createGuy = (scale, maxUnitDelta, maxRotation, material) => {
        material = material || api.createMaterials();
        const guy = new Guy();
        const gud =  guy.group.userData;
        gud.scale = scale;
        gud.maxUnitDelta = maxUnitDelta === undefined ? 1 : maxUnitDelta;
        gud.maxRotation = maxRotation === undefined ? 1 : maxRotation;
        guy.group.scale.set(scale, scale, scale);
        // for each mesh
        guy.group.traverse(( obj ) => {
            if(obj.type === 'Mesh'){
                const mesh = obj;
                const mud = mesh.userData;
                // I WANT A NON INDEX GEOMETRY
                mesh.geometry = mesh.geometry.toNonIndexed();
                // store refs to pos and a clone of the pos
                const pos = mesh.geometry.getAttribute('position');
                mud.pos = pos;
                mud.pos_home = pos.clone();
            }
        });
        // use materials in this file
        guy.head.material = material.head.map( (m) => { return m.clone(); });
        guy.body.material = material.body.clone();
        guy.arm_left.material = material.arm.clone();
        guy.arm_right.material = material.arm.clone();
        guy.leg_right.material = material.leg.clone();
        guy.leg_left.material = material.leg.clone();
        // using set to plain surface
        api.setGuyPos(guy);
        return guy;
    };
    // create a guy by way of a hight scale value
    api.createGuyHScale = (HScale, maxUnitDelta, maxRotation, materials) => {
        const scale_h1 = 1 / api.getGuySize( api.createGuy(1) ).y;
        const guy = api.createGuy(HScale * scale_h1, maxUnitDelta, maxRotation, materials);
        return guy;
    };
    // get guy size helper
    api.getGuySize = (guy) => {
        const b3 = new THREE.Box3();
        b3.setFromObject(guy.group);
        const v3_size = new THREE.Vector3();
        b3.getSize(v3_size);
        return v3_size;
    };
    // set guy pos using box3 and userData object
    api.setGuyPos = (guy, v3_pos) => {
        v3_pos = v3_pos || new THREE.Vector3();
        const gud = guy.group.userData;
        const v3_size = api.getGuySize(guy);
        guy.group.position.copy(v3_pos);
        guy.group.position.y = ( v3_size.y + gud.scale ) / 2 + v3_pos.y;
    };
    // a set guy rotation helper
    api.setGuyRotation = (guy, v3_lookat, ignoreY) => {
        ignoreY = ignoreY === undefined ? true: ignoreY;
        const gud = guy.group.userData;
        const v3_size = api.getGuySize(guy);
        const v3 = v3_lookat.clone();
        v3.y = guy.group.position.y;
        if(!ignoreY){
            v3.y = v3_lookat.y + ( v3_size.y + gud.scale ) / 2;
        }
        guy.group.lookAt( v3 );
    };
    // update guy method
    // EFFECT 1
    const EFFECT1 = (ti, pi, v_pos_home, globalAlpha, mesh, group, mud, gud, v_delta) => {
        const a1 = ti / mud.pos.array.length;
        const e = new THREE.Euler();
        e.y = Math.PI * 2 * gud.maxRotation * globalAlpha * (0.25 + a1);
        v_delta.applyEuler(e).normalize().multiplyScalar( globalAlpha * gud.maxUnitDelta);
        return v_delta;
    };
    api.updateGuyEffect = (guy, globalAlpha, effect) => {
        globalAlpha = globalAlpha === undefined ? 0 : globalAlpha;
        effect = effect || EFFECT1;
        const group = guy.group;
        const gud = group.userData;
        group.traverse( (obj) => {
            if(obj.type === 'Mesh'){
                const mesh = obj;
                const mud = mesh.userData;
                let ti = 0;
                const ct = mud.pos.array.length;
                // for each trinagle
                while(ti < ct){
                    // for each point of a triangle
                    let pi = 0;
                    while(pi < 3){
                        const i = ti + pi * 3;
                        // create vector3 from pos_home
                        const x = mud.pos_home.array[ i ];
                        const y = mud.pos_home.array[ i + 1];
                        const z = mud.pos_home.array[ i + 2];
                        const v_pos_home = new THREE.Vector3(x, y, z);
                        // figure out the delta
                        let v_delta = new THREE.Vector3(0, 0, 1);
                        v_delta = effect(ti, pi, v_pos_home, globalAlpha, mesh, group, mud, gud, v_delta);
                        // update pos
                        const v_pos = v_pos_home.clone().add( v_delta );
                        mud.pos.array[ i ] = v_pos.x;
                        mud.pos.array[ i + 1] = v_pos.y;
                        mud.pos.array[ i + 2] = v_pos.z;
                        pi += 1;
                    }
                    ti += 9;
                }
                mud.pos.needsUpdate = true;
            }
        });
    };
    //-------- ----------
    // PATH HELPERS
    //-------- ----------
    // just a short hand for THREE.QuadraticBezierCurve3
    api.QBC3 = function(x1, y1, z1, x2, y2, z2, x3, y3, z3){
        let vs = x1;
        let ve = y1;
        let vc = z1;
        if(arguments.length === 9){
            vs = new THREE.Vector3(x1, y1, z1);
            ve = new THREE.Vector3(x2, y2, z2);
            vc = new THREE.Vector3(x3, y3, z3);
        }
        return new THREE.QuadraticBezierCurve3( vs, vc, ve );
    };
    // QBDelta helper using QBC3
    // this works by giving deltas from the point that is half way between
    // the two start and end points rather than a direct control point for x3, y3, and x3
    api.QBDelta = function(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        const vs = new THREE.Vector3(x1, y1, z1);
        const ve = new THREE.Vector3(x2, y2, z2);
        // deltas
        const vDelta = new THREE.Vector3(x3, y3, z3);
        const vc = vs.clone().lerp(ve, 0.5).add(vDelta);
        const curve = api.QBC3(vs, ve, vc);
        return curve;
    };
    // QBV3Array
    api.QBV3Array = function(data) {
        const v3Array = [];
        data.forEach( ( a ) => {
            const curve = api.QBDelta.apply(null, a.slice(0, a.length - 1))
            v3Array.push( curve.getPoints( a[9]) );
        })
        return v3Array.flat();
    };
    // debug a V3 Array helper
    api.QBDebugV3Array = (v3Array, size, color) => {
        size = size === undefined ? 1 : size;
        color = color || new THREE.Color(1,1,1);
        // PATH DEBUG POINTS
        const points_debug = new THREE.Points(
            new THREE.BufferGeometry().setFromPoints(v3Array),
            new THREE.PointsMaterial({size: size, color: color})
        );
        return points_debug;
    };

}(this['helper'] = {}));