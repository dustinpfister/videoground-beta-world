// video2 for custom shader
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/tween-many/r0/tween-many.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../../../js/object-grid-wrap/r2/effects/opacity2.js'
];
// dae file
VIDEO.daePaths = [
  '../../../dae/hum/hum_lp.dae'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // SHADER MATERIAL
    // ---------- ----------
    // based on what as found at: https://codepen.io/EvanBacon/pen/xgEBPX
    // by EvanBacon ( https://codepen.io/EvanBacon , https://twitter.com/baconbrix )
    // * made it so that there are just two colors
    // * figured out how to make the lines thicker
    // * figured out how to mutate color
    const shader_hatch = {};
    // unifrom values for hatching shader
    shader_hatch.uniforms = {
        uDirLightPos: { type: 'v3', value: new THREE.Vector3() },
        uDirLightColor: { type: 'c', value: new THREE.Color(0xeeeeee) },
        uAmbientLightColor: { type: 'c', value: new THREE.Color(0x050505) },
        uBaseColor: { type: 'c', value: new THREE.Color(0xffffff) },
        uLineColor1: { type: 'c', value: new THREE.Color(0x000000) }
    };
    // vertex shader for hatching shader
    shader_hatch.vertexShader = [
        'varying vec3 vNormal;',
        'void main() {',
        '     gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '     vNormal = normalize( normalMatrix * normal );',
        '}'
    ].join('\n');
    // fragment shader for hatching shader
    shader_hatch.fragmentShader = [
        //'uniform vec3 uBaseColor;',
        'uniform vec3 uLineColor1;',
        'uniform vec3 uDirLightPos;',
        'uniform vec3 uDirLightColor;',
        'uniform vec3 uAmbientLightColor;',
        'varying vec3 vNormal;',
        'const float fSpace = 10.0;',    // added an fSpace Float
        '',
        'void main() {',
        '    float directionalLightWeighting = max( dot( vNormal, uDirLightPos ), 0.0);',
        '    vec3 lightWeighting = uAmbientLightColor + uDirLightColor * directionalLightWeighting;',
        '    float len = length(lightWeighting);',     // added a len Float
        //'    gl_FragColor = vec4( uBaseColor, 1.0 );',
        '    vec3 color = vec3(len * 0.50);', // figured out how to mutate color
        //'    color[0] = len * 0.40;',
        '    gl_FragColor = vec4(color, 1.0);',
        '    if ( len < 1.00 ) {',
        '        float n = mod(gl_FragCoord.x + gl_FragCoord.y, fSpace);', // added a n Float for each of these
        '        if ( n < 4.0 ) {', // new expression that allows for thicker lines
        '            gl_FragColor = vec4( uLineColor1, 1.0 );',
        '        }',
        '    }',
        '    if ( len < 0.75 ) {',
        '        float n = mod(gl_FragCoord.x - gl_FragCoord.y, fSpace);',
        '        if ( n < 4.0 ) {',
        '            gl_FragColor = vec4( uLineColor1, 1.0 );',
        '        }',
        '    }',
        '    if ( len < 0.50 ) {',
        '        float n = mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, fSpace);',
        '        if ( n < 4.0 ) {',
        '            gl_FragColor = vec4( uLineColor1, 1.0 );',
        '        }',
        '    }',
        '    if ( len < 0.25 ) {',
        '        float n = mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, fSpace);',
        '        if ( n < 4.0 ) {',
        '            gl_FragColor = vec4( uLineColor1, 1.0 );',
        '        }',
        '    }',
        '}'
    ].join('\n');
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(0.2, 0.2, 0.7);
    scene.add(dl);
    // ---------- ----------
    // SHADER MATERIAL
    // ---------- ----------
    const material1 = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(shader_hatch.uniforms),
        vertexShader: shader_hatch.vertexShader,
        fragmentShader: shader_hatch.fragmentShader
    });
    material1.uniforms.uDirLightColor.value = dl.color;
    material1.uniforms.uDirLightPos.value = dl.position;
    //const lineColor1 = 0xff0000;
    //material1.uniforms.uBaseColor.value.setHex(0xff0000);
    //material1.uniforms.uLineColor1.value.setHex(lineColor1);
    // ---------- ----------
    // GEOMETRY, MESH
    // ---------- ----------
    const scene_dae = VIDEO.daeResults[0].scene;
    const hum_0 = scene_dae.getObjectByName('hum_0');
    const hum_1 = scene_dae.getObjectByName('hum_1');
    hum_0.geometry.rotateX(Math.PI / 180 * 60);
    hum_0.geometry.rotateZ(Math.PI / 180 * 280);
    hum_1.geometry.rotateX(Math.PI / 180 * 60);
    hum_1.geometry.rotateZ(Math.PI / 180 * 280);
    const mesh = new THREE.Mesh(hum_0.geometry.clone(), material1);
    mesh.position.y = 1.0;
    scene.add(mesh);
	
        //-------- ----------
        // GRID OPTIONS
        //-------- ----------
        const tw = 20,
        th = 10,
        space = 5.5;
        // source objects
        //const mkBox = function(){
        //    const mesh = new THREE.Mesh(
        //        new THREE.BoxGeometry(2, 0.25, 2),
        //        new THREE.MeshNormalMaterial() );
        //    return mesh;
        //};
        const array_source_objects = [
            new THREE.Mesh(
                new THREE.BoxGeometry(4, 0.25, 3),
                material1
            ),
            new THREE.Mesh(
                new THREE.SphereGeometry(1.5, 30, 30),
                material1
            )
        ];
        const array_oi = [
            0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,
            0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,1,0,1,0,0,
            1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,0,1,1,1,
            0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,
            0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,
            0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1,0,0,
            0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,
            0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0
        ];
        //-------- ----------
        // CREATE GRID
        //-------- ----------
        const grid = ObjectGridWrap.create({
            space: space,
            tw: tw,
            th: th,
            effects: [],
            sourceObjects: array_source_objects,
            objectIndices: array_oi
        });
        scene.add(grid);
        grid.position.copy(mesh.position).add( new THREE.Vector3(0, -7, 0) );
	
	
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#ffffff');
    //-------- ----------
    // MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 30,
        update: function(seq, partPer, partBias){
            // light
            //const a1 = seq.getSinBias(2);
            //const v = new THREE.Vector3();
            //const e = new THREE.Euler();
            //e.x = Math.PI * 0.25 + Math.PI * 0.5 * a1;
           // e.z = Math.PI / 180 * -20;
           // v.set(0,1,0).applyEuler(e);
            //dl.position.copy(v);
            // move wings
            const a_hum = seq.getBias(60);
            tweenMany.tween(mesh.geometry, [
                    [ hum_0.geometry, hum_1.geometry, a_hum]
            ]);
            // camera
            const v1 = new THREE.Vector3(10, 10, 10);
            const v2 = new THREE.Vector3(5, 0, -10);
            camera.position.copy( v1.lerp(v2, partPer) );
            camera.lookAt(mesh.position.clone().add(new THREE.Vector3(0,1,0)));
            // wrap
            ObjectGridWrap.setPos(grid, seq.getPer(4), 0 );
            ObjectGridWrap.update(grid);
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
 