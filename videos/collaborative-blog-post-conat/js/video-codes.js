

window.vc = {
   states : {}
};

//-------- ----------
// threejs-examples-object-grid-wrap
// https://github.com/dustinpfister/videoground-blog-posts/tree/master/videos/threejs-examples-object-grid-wrap
//-------- ----------
vc.states['examples_object_grid_wrap'] = {
    scene: new THREE.Scene(),
    init : (sm, scene, camera) => {
        const tw = 12,
        th = 12,
        space = 1.25;
        // source objects
        const mkBox = function(h){
            const box = new THREE.Group();
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry( 1, h, 0.25 + 0.25),
                new THREE.MeshNormalMaterial() );
            mesh.position.y = h / 2;
            mesh.rotation.y = Math.PI / 180 * 20 * -1;
            box.add(mesh)  
            return box;
        };
        const array_source_objects = [
            mkBox(0.5), mkBox(1), mkBox(1.5), mkBox(2), mkBox(2.5)
        ];
        const array_oi = [],
        len = tw * th;
        let i = 0;
        while(i < len){
            array_oi.push( Math.floor( array_source_objects.length * THREE.MathUtils.seededRandom() ) );
            i += 1;
        }
        // CREATE GRID
        const gw = scene.userData.gw = ObjectGridWrap.create({
            space: space,
            tw: tw,
            th: th,
            aOpacity: 1.25,
            sourceObjects: array_source_objects,
            objectIndices: array_oi
        });
        scene.add(gw);
    },
    update: (sm, scene, camera, per, bias) => {
        const gw = scene.userData.gw;
        ObjectGridWrap.setPos(gw, (1 - per) * 2, Math.cos(Math.PI * bias) * 0.5 );
        ObjectGridWrap.update(gw);
    }
};



//-------- ----------
// buffer_geometry_set_from_points
// https://github.com/dustinpfister/videoground-blog-posts/tree/master/videos/threejs-buffer-geometry-set-from-points
//-------- ----------
vc.states['buffer_geometry_set_from_points'] = {
    scene: new THREE.Scene(),
    init : (sm, scene, camera) => {
        // HELPERS
        // a function that creates and returns an array of vector3 objects
        const myV3Array = (point_count, sec_count, rotation_count, y_mag, radius) => { 
            const v3array = [];
            for ( let i = 0; i < point_count; i ++ ) {
                const a1 = i / point_count;
                const a2 = a1 * sec_count % 1;
                const a3 = Math.floor(sec_count * a1) / sec_count;
                const a4 = 1 - Math.abs(0.5 - a1) / 0.5;
                const e = new THREE.Euler();
                e.y = Math.PI * 2 * rotation_count * a2;
                const v = new THREE.Vector3(1, 0, 0);
                v.applyEuler(e).multiplyScalar(radius * a4);
                v.y = y_mag * -1 + (y_mag * 2) * a3;
                v3array.push(v);
            }
            return v3array;
        };
        // create a geometry to begin with
        const createGeometry = (point_count, sec_count, rotation_count, y_mag, radius) => {
            const v3array =  myV3Array(point_count, sec_count, rotation_count, y_mag, radius);
            const geometry = new THREE.BufferGeometry();
            geometry.setFromPoints(v3array);
            // adding vertex color to while I am at it
            let i = 0;
            const att_pos = geometry.getAttribute('position');
            const len = att_pos.count;
            const data_color = [];
            while(i < len){
                const a1 = (i / len);
                const a2 = 1 - Math.abs(0.5 - a1) / 0.5;
                const n = 0.25 + 0.75 * a1;
                data_color.push(a2 * 0.5, 1 - n, n);
                i += 1;
            }
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(data_color, 3));
            return geometry;
        };
        // update a geometry
        const updateGeometry = scene.userData.updateGeometry = (geometry, sec_count, rotation_count, y_mag, radius) => {
            const att_pos = geometry.getAttribute('position');
            const v3array =  myV3Array(att_pos.count, sec_count, rotation_count, y_mag, radius);
            let i = 0;
            const len = att_pos.count;
            while(i < len){
                const v = v3array[i];
                att_pos.setX(i, v.x);
                att_pos.setY(i, v.y);
                att_pos.setZ(i, v.z);
                i += 1;
            }
            att_pos.needsUpdate = true;
        };
        // OBJECTS
        const geometry = scene.userData.geometry = createGeometry(600, 1, 2, 1, 3);
        const points1 = new THREE.Points(geometry, new THREE.PointsMaterial({
            size: 0.8,
            transparent: true,
            opacity: 0.8,
            vertexColors: true
        }));
        scene.add(points1);
    },
    update: (sm, scene, camera, per, bias) => {
        const updateGeometry = scene.userData.updateGeometry;
        const geometry = scene.userData.geometry;
        const a1 = per;
        const a2 = THREE.MathUtils.smoothstep(a1, 0, 1)
        const sec_count = 2 + 3 * a2;
        const rotation_count = 1 + 3 * a2;
        const y_mag = 0.5 + 1.5 * a2;
        const radius = 1 + 4 * a2;
        updateGeometry(geometry, sec_count, rotation_count, y_mag, radius);
    }
};
