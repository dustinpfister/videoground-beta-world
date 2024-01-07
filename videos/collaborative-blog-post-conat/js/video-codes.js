


window.vc = {
   states : {}
};

//-------- ----------
// threejs-examples-object-grid-wrap
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
