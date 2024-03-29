// 'frink1' - Got the basic idea of what I wanted to do working.
// 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/sphere-mutate/r2/sphere-mutate.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // HELPERS - helper functions from sequence hook demos
    //-------- ----------
    // frink adjust helper
    const frinkAdjust = function(mesh, uls, uld){
        const mud = mesh.userData;
        mud.uls = uls;
        mud.uld = uld;
    };
    //-------- ----------
    //  SPHERE MUTATE MESH OBJECTS, UPDATE OPTIONS
    //-------- ----------
    const updateOpt1 = {
        forPoint : function(vs, i, x, y, mesh, alpha){
            const mud = mesh.userData;
            const state = mud.state = mud.state === undefined ? [] : mud.state;
            const size = mesh.geometry.parameters.radius;
            const muld = mud.muld === undefined ? 2 : mud.muld;
            const uls = mud.uls === undefined ? 1 : mud.uls; // Unit Length Speed
            const uld = mud.uld === undefined ? 0 : mud.uld; // Unit Length Damp
            if(!state[i]){
                state[i] = {
                    v: vs.clone().normalize().multiplyScalar(size + muld * Math.random()),
                    count: 16 + Math.floor( Math.random() * 32 ),
                    offset: Math.random()
                };
            }
            const alpha2 = (state[i].offset + (state[i].count) * alpha) % 1;
            const alpha3 = 1 - Math.abs(0.5 - alpha2) / 0.5  * uls;
            return vs.lerp(state[i].v, alpha3 * ( 1- uld) );
        }
    };
    const material_sphere = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, transparent: true, opacity:0.8 });
    const mesh1 = sphereMutate.create({
        size: 2, w: 40, h: 40, material: material_sphere
    });
    scene.add(mesh1);
    sphereMutate.update(mesh1, 1, updateOpt1);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(6, 6, 6);
            camera.lookAt(0, 0, 0);
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            sphereMutate.update(mesh1, seq.per, updateOpt1);
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - three seconds of silence, frink mesh is a sphere
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // frink
            frinkAdjust(mesh1, 0, 1);
        }
    };
    // SEQ 1 - 2 seconds for frink noise1, sphere gets pointy and back down
    opt_seq.objects[1] = {
        secs: 2,
        update: function(seq, partPer, partBias){
            // frink
            let a = seq.getSinBias(1, true);
            frinkAdjust(mesh1, a, 1 - a);
        }
    };
    // SEQ 2 - 7 secs, silence
    opt_seq.objects[2] = {
        secs: 7,
        update: function(seq, partPer, partBias){
            // frink
            frinkAdjust(mesh1, 0, 1);
        }
    };
    // SEQ 3 - 3 secs, frink unexspected sound
    opt_seq.objects[3] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // frink
            let a = seq.getSinBias(1, true);
            frinkAdjust(mesh1, a, 1 - a);
        }
    };
    // SEQ 4 - 8 secs, silence
    opt_seq.objects[4] = {
        secs: 8,
        update: function(seq, partPer, partBias){
            // frink
            frinkAdjust(mesh1, 0, 1);
        }
    };
    // SEQ 5 - 7 secs, frink custom 7 sec sound
    opt_seq.objects[5] = {
        secs: 7,
        update: function(seq, partPer, partBias){
            // frink
            let a = seq.getSinBias(1, true);
            frinkAdjust(mesh1, a, 1 - a);
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
 