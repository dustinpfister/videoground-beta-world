(function(api){
    //-------- ----------
    // MATERIALS
    //-------- ----------
    api.createMaterials = () => {
        const material = {};
        material.leg = new THREE.MeshPhongMaterial({
                color: 0x00aaff, side: THREE.DoubleSide
        });
        // material used for the arms
        material.arm = new THREE.MeshPhongMaterial({
                color: 0x00ff88, side: THREE.DoubleSide
            });
        // material used for the body
        material.body = new THREE.MeshPhongMaterial({
                color: 0x00ff88, side: THREE.DoubleSide
            });
        // array of materials used for the head
        material.head = [
            // 0 face
            new THREE.MeshPhongMaterial({
                color: 0xffaf00, side: THREE.DoubleSide
            }),
            // 1
            new THREE.MeshPhongMaterial({
                color: 0xffffff, side: THREE.DoubleSide
            }),
            // 2
            new THREE.MeshPhongMaterial({
                color: 0xffffff, side: THREE.DoubleSide
            }),
            // 3
            new THREE.MeshPhongMaterial({
                color: 0xffffff, side: THREE.DoubleSide
            }),
            // 4
            new THREE.MeshPhongMaterial({
                color: 0xffffff, side: THREE.DoubleSide
            }),
            // 5
            new THREE.MeshPhongMaterial({
                color: 0xffffff, side: THREE.DoubleSide
            })
        ];
        return material;
    };
    //-------- ----------
    // CANVAS HEAD
    //-------- ----------
    // draw from sheet method
    const drawFromSheet = (canObj, ctx, canvas, state) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0, canvas.width, canvas.height);
        const img = state.textureObj[state.key].image;
        const sx = state.xi * 32;
        const sy = state.yi * 32;
        ctx.drawImage(img, sx, sy, 32, 32, 0, 0, 32, 32);
    };
    // set the head canvas to the given cell index in the given sheet key
    api.setHeadCanvasTo = (canObj_head, xi, yi, key) => {
        const state = canObj_head.state;
        state.xi = xi;
        state.yi = yi;
        state.key = key || state.key;
        canvasMod.update(canObj_head);
    };
    // Create Animations
    const setHeadAni = (canObj_head, key, cells, alpha) => {
        const i = cells[ Math.round( ( cells.length - 1 ) * alpha) ];
        api.setHeadCanvasTo(canObj_head, i[0], i[1], key);
    };
    api.createHeadAniAlphas = (canObj_head, arr) => {
        const ani = {};
        arr.forEach( (opt) => {
            ani[opt.aniKey] = function(alpha){
                setHeadAni(canObj_head, opt.sheetKey, opt.cells, alpha);
            };
        });
        return ani;
    };
    // create a canvasObj for the head
    api.createCanvasHead = (textureObj) => {
        // create the canvas object
        const canObj_head = canvasMod.create({
            size: 32,
            update_mode: 'canvas',
            state: {
                textureObj: textureObj,
                key: 'smile_sheet_128',
                xi: 1, yi: 0
            },
            draw: drawFromSheet
        });
        return canObj_head;
    };
    // create a new canvas texture from the current state of the given canvas element
    const copyCanvas = (canvas_source) => {
         const canvas_new = document.createElement('canvas');
         const ctx = canvas_new.getContext('2d');
         canvas_new.width = canvas_source.width;
         canvas_new.height = canvas_source.height;
         ctx.drawImage(canvas_source, 0, 0, canvas_new.width, canvas_new.height);
         return new THREE.CanvasTexture(canvas_new);
    };
    // set up the head textures
    api.setHeadTextures = (canObj_head, faceData, material, sheetKey) => {
        faceData.forEach( (fd) => {
            api.setHeadCanvasTo(canObj_head, fd[1], fd[2], sheetKey);
            const m = material.head[ fd[3] ];
            if(fd[4]){
                m.map = canObj_head.texture;
            }else{
                m.map = copyCanvas(canObj_head.canvas);
            }
        });
    };
    //-------- ----------
    // CREATE A GUY
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
        // set index values for head
        guy.head.geometry.groups[0].materialIndex = 2;
        guy.head.geometry.groups[1].materialIndex = 3;
        guy.head.geometry.groups[2].materialIndex = 4;
        guy.head.geometry.groups[3].materialIndex = 5;
        guy.head.geometry.groups[4].materialIndex = 0; // face
        guy.head.geometry.groups[5].materialIndex = 1;
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
    //-------- ----------
    // GET SIZE, SET POS AND ROTATION
    //-------- ----------
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
    //-------- ----------
    // EFFECTS
    //-------- ----------
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
}(this['helper'] = {}));