// video1 for custom shader
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js'
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
    dl.position.set(0.8, 1, 0.5);
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
    const geo = new THREE.TorusGeometry( 3, 1, 100, 100);
    geo.rotateX(Math.PI * 0.5);
    const mesh = new THREE.Mesh(geo, material1);
    mesh.position.y = 1.0;
    scene.add(mesh);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(4.2, 4.2, 5.7);
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
            const a1 = seq.getPer(2);
            const v = new THREE.Vector3();
            const e = new THREE.Euler();
            e.x = Math.PI * 4 * a1;
            e.z = Math.PI * 2 * a1;
            v.set(0,1,0).applyEuler(e);
            dl.position.copy(v);
            // camera
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
 