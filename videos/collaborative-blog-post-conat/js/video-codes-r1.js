// video-codes-r1.js

// * (done) remove curve-line-group video
// * (done) add video1 from example line-sphere-circles
// * (done) examples_object_grid_wrap : new materials for objects that are not mesh normal material
// * (done) examples_object_grid_wrap : get opacity effect working

// * () vector3_wrap_video2_wraplength : new material for objects that is not mesh normal material
// * () vector3_apply_euler : new material for objects that is not mesh normal material
// * () vector3_multiply_scalar_video1 : new material for objects that is not mesh normal material

(function(){

    window.vc = {
        states : {}
    };

}());


//-------- ----------
// threejs-fat-width
// https://github.com/dustinpfister/videoground-blog-posts/blob/master/videos/threejs-line-fat-width/videos/video1.js
//-------- ----------
vc.states['line-fat-width'] = {
    scene: new THREE.Scene(),
    init : (sm, scene, camera) => {
        const sud = scene.userData;
        // HELPERS
        // create sin wave position array to use with the setPositions method
        const sinWave = (zStart, zEnd, x, waves, yMax, pointCount, radianOffset) => {
            const pos = [];
            let i = 0;
            while(i < pointCount){
                const a1 = i / (pointCount - 1);
                const z = zStart - (zStart - zEnd) * a1;
                let r = Math.PI * 2 * waves * a1 + radianOffset;
                r = THREE.MathUtils.euclideanModulo(r, Math.PI * 2);
                const y = Math.sin(r) * yMax;
                pos.push(x, y, z);
                i += 1;
            }
            return pos;
        };
        // color trans
        const colorTrans = (color1, color2, posArray, camera) => {
            const colors = [];
            let i = 0;
            const pointCount = posArray.length / 3;
            while(i < pointCount){
               const a1 = i / (pointCount - 1);
               // raw color values
               let r = color1.r * (1 - a1) + color2.r * a1;
               let g = color1.g * (1 - a1) + color2.g * a1;
               let b = color1.b * (1 - a1) + color2.b * a1;
               // vector3 in pos Array
               let v3 = new THREE.Vector3( posArray[i], posArray[i + 1], posArray[i + 2] );
               const d = v3.distanceTo(camera.position);
               let a_d = 0;
               if(d >= camera.near && d <= camera.far){
                    a_d = 1 - 1 * (d - camera.near) / ( camera.far - camera.near );
               }
               colors.push(r * a_d, g * a_d, b * a_d);
               i += 1;
            }
            return colors;
        };
        // update line group
        const updateLine2Group = sud.updateLine2Group = (l2Group, camera, a1 ) => {
            const a2 = 1 - Math.abs(0.5 - a1) / 0.5;
            let i = 0;
            const count = l2Group.children.length;
            const pointCount = 120;
            while(i < count){
                const a_line = i / (count);
                const a_line2 = 1 - Math.abs(0.5 - a_line) / 0.5;
                const line = l2Group.children[i];
                const x = -5 + 10 * a_line;
                const yMax = 1 + 3 * a_line2;
                const radianOffset = Math.PI * 2 / count * i + Math.PI * 2 * a1;
                const posArray = sinWave(5, -5, x, 4, yMax, pointCount, radianOffset);
                line.geometry.setPositions( posArray );
                // color
                const c1 = new THREE.Color(1,0,1 - a_line);
                const c2 = new THREE.Color(a_line, 1, 0);
                const colorArray = colorTrans( c1, c2, posArray, sm.camera );
                line.geometry.setColors( colorArray );
                i += 1;
            }
        };
        const createLine2Group = (count) => {
            const group = new THREE.Group();
            let i = 0;
            while(i < count){
                const a_line = i / (count - 1);
                const geo = new THREE.LineGeometry();
                // use vertex colors when setting up the material
                const line_material = new THREE.LineMaterial({
                    linewidth: 0.05, //0.05 - 0.025 * a_line,
                    vertexColors: true
                });
                const line = new THREE.Line2(geo, line_material);
                group.add(line);
                i += 1;
            }
            return group;
        };
        // LINE2
        const group = sud.group = createLine2Group(10);
        scene.add(group);
        updateLine2Group(group, sm.camera, 0);
    },
    update: (sm, scene, camera, per, bias) => {
        const sud = scene.userData;
        sud.updateLine2Group(sud.group, sm.camera, per * 8 % 1);

    }
};

//-------- ----------
// threejs-examples-lines-sphere-circles
// https://github.com/dustinpfister/videoground-blog-posts/blob/master/videos/threejs-examples-lines-sphere-circles/videos/video1.js
//-------- ----------
vc.states['examples_lines_sphere_circles_video1'] = {
    scene: new THREE.Scene(),
    init : (sm, scene, camera) => {
        const sud = scene.userData;
        // opt1 is plain sphere
        var opt0 = sud.opt0 = { 
            maxRadius: 30, pointsPerCircle: 40, circleCount: 60, linewidth: 8,
            colors: [ 0x606060, 0x505050, 0x404040  ]
        }
        var g0 = sud.g0 = LinesSphereCircles.create(opt0);
        g0.position.set(0, 0, 0)
        scene.add(g0);
        // opt1 is plain sphere
        var opt1 = sud.opt1 = { 
            maxRadius: 4, pointsPerCircle: 20, linewidth: 8,
            forOpt: function(opt, per, bias, frame, frameMax){
                var a = per * 10 % 1,
                b = 1 - Math.abs(0.5 - a) / 0.5;
                opt.maxRadius = 3 + 1 * b;
            }
        }
        var g1 = sud.g1 = LinesSphereCircles.create(opt1);
        g1.position.set(-10, -2, 0)
        scene.add(g1);
        // seeded random
        var opt2 = sud.opt2 = { 
            maxRadius: 8, 
            forPoint: 'seededRandom', 
            linewidth: 8}
        var g2 = sud.g2 = LinesSphereCircles.create(opt2);
        g2.position.set(-5,-10,-25)
        scene.add(g2);
        // seashell
        var opt3 = sud.opt3 = {
            circleCount: 20,
            maxRadius: 4,
            pointsPerCircle: 30,
            colors: [0x004444, 0x00ffff],
            linewidth: 8,
            forPoint: 'seaShell',
            forOpt: function(opt, per, bias, frame, frameMax){
                var a = per * 6 % 1,
                b = 1 - Math.abs(0.5 - a) / 0.5;
                opt.minRadius = 1 + 3 * b;
            }
        };
        var g3 = sud.g3 = LinesSphereCircles.create(opt3);
        scene.add(g3);
        // g4 is plain sphere but with r1 changes over time
        var opt4 = sud.opt4 = { 
            maxRadius: 4, pointsPerCircle: 20, linewidth: 8,
            forOpt: function(opt, per, bias, frame, frameMax){
                var a = per * 6 % 1,
                b = 1 - Math.abs(0.5 - a) / 0.5;
                opt.r1 = 1 * b;
            }
        }
        var g4 = sud.g4 = LinesSphereCircles.create(opt4);
        g4.position.set(-10, -2, -10)
        scene.add(g4);
    },
    update: (sm, scene, camera, per, bias) => {
        const sud = scene.userData;
        const frameMax = 10000;
        const frame = Math.floor(frameMax * per);
        LinesSphereCircles.setByFrame(sud.g1, frame, frameMax, sud.opt1);
        //LinesSphereCircles.setByFrame(sud.g2, frame, frameMax, sud.opt2);
        sud.g2.rotation.y = Math.PI * 4 * per;
        LinesSphereCircles.setByFrame(sud.g3, frame, frameMax, sud.opt3);
        LinesSphereCircles.setByFrame(sud.g4, frame, frameMax, sud.opt4);

    }
};

//-------- ----------
// threejs-examples-lines-sphere-circles
// https://github.com/dustinpfister/videoground-blog-posts/blob/master/videos/threejs-examples-lines-sphere-circles/videos/video2.js
//-------- ----------
vc.states['examples_lines_sphere_circles_video2'] = {
    scene: new THREE.Scene(),
    init : (sm, scene, camera) => {
        const sud = scene.userData;
        // LINES
        const opt = {
            maxRadius: 4,
            pointsPerCircle: 100,
            circleCount: 20,
            linewidth: 15,
            colors: new Array(20).fill('.').map((e, i, arr) => {
                const color = new THREE.Color(0, 0, 0);
                const a1 = i / arr.length;
                color.g = 1 - a1;
                color.b = a1;
                return color.getStyle();
            }),
            forPoint: function(v, s, opt){
                v.x = v.x + -0.25 + 0.5 * Math.random();
                v.z = v.z + -0.25 + 0.5 * Math.random();
                return v;
            }
        }
        const g1 = sud.g1 = LinesSphereCircles.create(opt);
        scene.add(g1);
        const update = sud.update = function(frame, frameMax){
            const a1 = frame / frameMax * 2 % 1;
            const a2 = 1 - Math.abs( 0.5 - a1 * 4 % 1 ) / 0.5;
            g1.children.forEach( (line, i, arr) => {
                // rotate
                const count = Math.floor(i + 1);
                line.rotation.z = Math.PI * 2 * count * a1;
                // scale
                const s = 1 - (i / arr.length * 0.5 * a2);
                line.scale.set(s, s, s);
                // material
                const m = line.material;
                m.transparent = true;
                m.opacity = 0.85 - 0.80 * ( i / arr.length);
            });
            LinesSphereCircles.setByFrame(g1, frame, frameMax, opt);
            g1.rotation.y = Math.PI * 2 * a1;
        };
    },
    update: (sm, scene, camera, per, bias) => {
        const frame = Math.floor(10000 * per);
        scene.userData.update(frame, 10000);
    }
};

//-------- ----------
// threejs-examples-object-grid-wrap
// https://github.com/dustinpfister/videoground-blog-posts/blob/master/videos/threejs-examples-object-grid-wrap/videos/video1.js
//-------- ----------
vc.states['examples_object_grid_wrap'] = {
    scene: new THREE.Scene(),
    init : (sm, scene, camera) => {
        const tw = 12,
        th = 12,
        space = 1.50;
        // source objects
        const mkBox = (h, r=0, g=1, b=0) =>{
            const box = new THREE.Group();
            const geometry = new THREE.BoxGeometry( 1, h, 0.50, 8, 8, 32);

            const len = geometry.getAttribute('position').count;
            const color_array = [];
            let i = 0;
            while(i < len){
                const a1 = i / len;
                color_array.push(r * a1, g * a1, b * a1);
                i += 1;
            }
            const color_attribute = new THREE.BufferAttribute(new Float32Array(color_array), 3);
            geometry.setAttribute('color', color_attribute);

            const mesh = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({ vertexColors: true }) );
            mesh.position.y = h / 2;
            mesh.rotation.y = Math.PI / 180 * 20 * -1;
            box.add(mesh)  
            return box;
        };
        const array_source_objects = [
            mkBox(0.5, 1, 0, 0),
            mkBox(1, 0, 1, 0),
            mkBox(1.5, 0, 0, 1),
            mkBox(2, 0, 1, 1),
            mkBox(2.5, 1, 0, 1)
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
            effects: ['opacity2'],
            space: space,
            tw: tw,
            th: th,
            //aOpacity: 1.25,
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
// https://github.com/dustinpfister/videoground-blog-posts/blob/master/videos/threejs-buffer-geometry-set-from-points/videos/video1-position.js
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

//-------- ----------
// threejs-vector3-wrap
// https://github.com/dustinpfister/videoground-blog-posts/blob/master/videos/threejs-vector3-wrap/videos/video2-s5-1-loop-wraplength.js
//-------- ----------
vc.states['vector3_wrap_video2_wraplength'] = {
    scene: new THREE.Scene(),
    init : (sm, scene, camera) => {
        // ---------- ---------- ----------
        // CONST
        // ---------- ---------- ----------
        const TOTAL_LENGTH = 200;
        const MAX_LENGTH = 10;
        const COUNT = 400;
        const SIN_LOOP_RANGE = [0, 64];
        const Y_ROTATION_COUNT = 2;
        const Y_ROTATION_OFFSET = 60;
        const X_DEG = 8;
        // ---------- ---------- ----------
        // OBJECTS
        // ---------- ---------- ----------
        const group = scene.userData.group = new THREE.Group();
        scene.add(group);
        let i = 0;
        while(i < COUNT){
            const a_index = i / COUNT;
            const color = new THREE.Color();
            color.r = 0.1 + 0.9 * a_index;
            color.g = 1 - a_index;
            color.b = Math.random();
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 0.5, 0.5),
                new THREE.MeshNormalMaterial({transparent: true, opacity: 0.5})
            );
            group.add(mesh);
            i += 1;
        }

        const updateGroup = scene.userData.updateGroup = function(a1, group){
            group.children.forEach( (mesh, i, arr) => {
                const a2 = i / arr.length;
                const a3 = a1 + 1 / (TOTAL_LENGTH * 2.5) * i;
                const sin_loops = SIN_LOOP_RANGE[0] + (SIN_LOOP_RANGE[1] - SIN_LOOP_RANGE[0]) * a1;
                const a4 = Math.sin(Math.PI * sin_loops * (a2 * 1 % 1));
                let unit_length = TOTAL_LENGTH * a3;
                unit_length = THREE.MathUtils.euclideanModulo(unit_length, MAX_LENGTH);
                const e = new THREE.Euler();
                const yfc = Y_ROTATION_OFFSET;
                const degY = ( yfc * -1 + yfc * 2 * a2) + (360 * Y_ROTATION_COUNT ) * a1;
                const xd = X_DEG;
                const degX = xd * -1 + xd * 2 * a4;
                e.y = THREE.MathUtils.degToRad( degY);
                e.x = THREE.MathUtils.degToRad(degX);
                mesh.position.set(1, 0, 0).normalize().applyEuler(e).multiplyScalar(0.5 + unit_length);
                mesh.lookAt(0,0,0);
                mesh.rotation.y = Math.PI * 2 * ( (a2 + a2) * 64 % 1);
            });
        };
    },
    update: (sm, scene, camera, per, bias) => {
        scene.userData.updateGroup( per, scene.userData.group );
    }
};




//-------- ----------
// threejs-vector3-apply-euler
// https://github.com/dustinpfister/videoground-blog-posts/blob/master/videos/threejs-vector3-apply-euler/videos/video1.js
//-------- ----------
vc.states['vector3_apply_euler'] = {
    scene: new THREE.Scene(),
    init : (sm, scene, camera) => {
        // HELPERS
        // Vector from angles method
        const vectorFromAngles = function (a, b, len) {
            a = a === undefined ? 0 : a;
            b = b === undefined ? 0 : b;
            len = len === undefined ? 1 : len;
            const startVec = new THREE.Vector3(1, 0, 0);
            const e = new THREE.Euler(
                    0,
                    THREE.MathUtils.degToRad(a),
                    THREE.MathUtils.degToRad(-90 + b));
            return startVec.applyEuler(e).normalize().multiplyScalar(len);
        };
        // create a cube
        const CUBE_GEO = new THREE.BoxGeometry(1, 1, 1);
        const CUBE_MATERIAL = new THREE.MeshNormalMaterial();
        const createCube = function(pos){
            const cube = new THREE.Mesh(
                CUBE_GEO,
                CUBE_MATERIAL);
            cube.position.copy( pos || new THREE.Vector3() );
            cube.lookAt(0, 0, 0);
            return cube;
        };
        // create a group
        const createGroup = (len) => {
            const group = new THREE.Group();
            let i = 0;
            while(i < len){
                group.add( createCube(null) );
                i += 1;
            }
            return group;
        };
        // set a group
        const setGroup = (group, aCount, unitLength, vd, vlt, alpha) => {
            aCount = aCount === undefined ? 1 : aCount;
            unitLength = unitLength === undefined ? 1 : unitLength;
            vd = vd === undefined ? new THREE.Vector3() : vd;       // vector delta for each object effected by i / len
            vlt = vlt === undefined ? new THREE.Vector3() : vlt;    // vector to lerp to for each mesh positon
            alpha = alpha === undefined ? 0 : alpha;
            let len = group.children.length;
            let i = 0;
            while(i < len){
                const p = i / len;
                const a = 360 * aCount * p;
                // using my vector from angles method
                const v = vectorFromAngles(a, 180 * p, unitLength);
                // adding another Vector
                v.add( vd.clone().multiplyScalar(p) );
                const cube = group.children[i];
                cube.position.copy(v.lerp(vlt, alpha));
                cube.lookAt(0, 0, 0);
                const s = 1 - 0.95 * p;
                cube.scale.set(s, s, s);
                i += 1;
            }
        };
        // MESH
        const group = createGroup(1600);
        scene.add(group);

        const sphere = new THREE.Mesh( 
            new THREE.SphereGeometry(30, 30, 30), 
            new THREE.MeshBasicMaterial({ wireframe: true, wireframeLinewidth: 4, transparent: true, opacity: 0.15}) )
        scene.add(sphere);
        // A MAIN SEQ OBJECT
        const seq = scene.userData.seq = seqHooks.create({
            fps: 30,
            beforeObjects: function(seq){
            },
            afterObjects: function(seq){
            },
            objects: [
                {
                    secs: 3,
                    update: function(seq, partPer, partBias){
                        // set group
                        setGroup(group, 0, 4);
                    }
                },
                {
                    secs: 5,
                    update: function(seq, partPer, partBias){
                        // set group
                        setGroup(group, 4 * partPer, 4);
                    }
                },
                {
                    secs: 2,
                    update: function(seq, partPer, partBias){
                        // set group
                        setGroup(group, 4, 4);
                    }
                },
                {
                    secs: 4,
                    update: function(seq, partPer, partBias){
                        setGroup(group, 4 - 8 * partPer, 4);
                    }
                },
                {
                    secs: 5,
                    update: function(seq, partPer, partBias){
                        vd = new THREE.Vector3(20 * partBias,0, 0);
                        setGroup(group, -4 + 8 * partPer, 4, vd);
                    }
                },
                {
                    secs: 5,
                    update: function(seq, partPer, partBias){
                        vd = new THREE.Vector3();
                        vlt = new THREE.Vector3(0,0,0)
                        setGroup(group, 4, 4, vd, vlt, partPer);
                    }
                },
                {
                    secs: 3,
                    update: function(seq, partPer, partBias){
                        vd = new THREE.Vector3();
                        vlt = new THREE.Vector3(0,0,0)
                        setGroup(group, 4, 4, vd, vlt, 1);
                    }
                },
                {
                    secs: 3,
                    update: function(seq, partPer, partBias){
                        vd = new THREE.Vector3();
                        vlt = new THREE.Vector3(0,0,0)
                        setGroup(group, 24 * partPer, 12, vd, vlt, 1 - partPer);
                    }
                }
            ]
        });
    },
    update: (sm, scene, camera, per, bias) => {
        const seq = scene.userData.seq;
        seqHooks.setFrame(seq, Math.floor(10000 * per), 10000);
    }
};


//-------- ----------
// threejs-vector3-multiply-scalar
// https://github.com/dustinpfister/videoground-blog-posts/blob/master/videos/threejs-vector3-multiply-scalar/videos/video1.js
//-------- ----------
vc.states['vector3_multiply_scalar_video1'] = {
    scene: new THREE.Scene(),
    init : (sm, scene, camera) => {
        // HELPERS
        // set position of mesh based on vector unit length along with a and b values
        // relative to a standard start position
        const setByLength = function(mesh, len, a, b, startDir){
            startDir = startDir || new THREE.Vector3(1, 0, 0);
            const pi2 = Math.PI * 2,
            eul = new THREE.Euler(
                0, 
                a % 1 * pi2,
                b % 1 * pi2);
            // using copy to start at startDir, then applying the Euler. After that normalize and multiplyScalar
            return mesh.position.copy( startDir ).applyEuler( eul ).normalize().multiplyScalar(len);
        };
        // get a bias value
        const getBias = function(alpha, count){
            let per = alpha * count % 1;
            return 1 - Math.abs(0.5 - per) / 0.5;
        };
        // update a group
        //const updateGroup = function(group, gAlpha, alphaAdjust, lenBiasCount, bBiasCount){
        const updateGroup = function(group, gAlpha, opt){
            gAlpha = gAlpha === undefined ? 0 : gAlpha; 
            opt = opt || {};
            opt.alphaAdjust = opt.alphaAdjust === undefined ? 1 : opt.alphaAdjust;
            opt.lenBiasCount = opt.lenBiasCount === undefined ? 5 : opt.lenBiasCount;
            opt.bBiasCount = opt.bBiasCount === undefined ? 5 : opt.bBiasCount;
            opt.lenRange = opt.lenRange || [3, 8];
            opt.bRange = opt.bRange || [-0.125, 0.125];
            let i = 0, count = group.children.length;
            while(i < count){
                let mesh = group.children[i];
                let iAlpha = i / count;
                let alpha = ( iAlpha + gAlpha ) / opt.alphaAdjust;
                let len = opt.lenRange[0] + (opt.lenRange[1] - opt.lenRange[0]) * getBias(alpha, opt.lenBiasCount);
                let a = alpha;
                let b = opt.bRange[0] + (opt.bRange[1] - opt.bRange[0]) * getBias(alpha, opt.bBiasCount);
                setByLength(mesh, len, a, b);
                // next child
                nextChild = group.children[i + 1];
                if(i === count - 1){
                    nextChild = group.children[i - 1];
                }
                mesh.lookAt(nextChild.position);
                i += 1;
            }
            return group;
        };
        const defaultGetColor = function(){
            let c = 0.5 + 0.5 * Math.random();
            return new THREE.Color(0, c, c)
        };
        // create a group
        const createGroup = function(count, s, opacity, getColor){
            count = count === undefined ? 10 : count;
            s = s === undefined ? 1 : s;
            opacity = opacity === undefined ? 1 : opacity;
            getColor = getColor || defaultGetColor;
            let i = 0;
            let group = new THREE.Group();
            while(i < count){
                let mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(s, s, s),
                    new THREE.MeshNormalMaterial({
                        //color: getColor(),
                        //map: texture_rnd1,
                        transparent: true,
                        opacity: opacity
                    }));
                group.add(mesh);
                i += 1;
            }
            updateGroup(group, 0);
            return group;
        };
        // OBJECTS
        let group1 = createGroup(100, 0.85, 1);
        scene.add(group1);
        let group2 = createGroup(100, 0.85, 0.5, function(){
            let c = 0.5 + 0.5 * Math.random();
            return new THREE.Color(0, c, 0)
        });
        group2.position.set(-10, 0, 0);
        scene.add(group2);
        let group3 = createGroup(100, 0.85, 0.5, function(){
            let c = 0.5 + 0.5 * Math.random();
            return new THREE.Color(c, 0, 0)
        });
        group3.position.set(0, 0, -10);
        scene.add(group3);
        // A MAIN SEQ OBJECT
        var seq = scene.userData.seq = seqHooks.create({
            fps: 30,
            beforeObjects: function(seq){
                let s = 1 + 0.5 * seq.per;
                updateGroup(group2, seq.per, {
                    lenBiasCount: 2 + 6 * seq.per
                });
                group2.scale.set(s, s, s);
                updateGroup(group3, seq.per, {
                    bBiasCount: 2 + 6 * seq.per
                });
                group3.scale.set(s, s, s);
            },
            afterObjects: function(seq){
            },
            objects: [
                {
                    secs: 3,
                    update: function(seq, partPer, partBias){
                        updateGroup(group1, seq.per, {
                            lenBiasCount: 5,
                            bBiasCount: 5,
                            lenRange: [1, 6],
                            bRange: [-0.125, 0]
                        });
                    }
                },
                {
                    secs: 7,
                    update: function(seq, partPer, partBias){
                        updateGroup(group1, seq.per, {
                            lenBiasCount: 5,
                            bBiasCount: 5,
                            lenRange: [1, 6],
                            bRange: [-0.125, 0]
                        });
                    }
                },
                {
                    secs: 10,
                    update: function(seq, partPer, partBias){
                        updateGroup(group1, seq.per, {
                            lenBiasCount: 5,
                            bBiasCount: 5,
                            lenRange: [1, 6],
                            bRange: [-0.125, 0.2 * seq.getBias(4) ]
                        });
                    }
                },
                {
                    secs: 10,
                    update: function(seq, partPer, partBias){
                        updateGroup(group1, seq.per, {
                            lenBiasCount: 5 + 5 * partPer,
                            bBiasCount: 5 - 3 * partPer,
                            lenRange: [1 + 2 * partPer, 6 + 2 * partPer],
                            bRange: [-0.125, 0.2 * seq.getBias(4) ]
                        });
                    }
                }
            ]
        });
    },
    update: (sm, scene, camera, per, bias) => {
        const seq = scene.userData.seq;
        seqHooks.setFrame(seq, Math.floor(10000 * per), 10000);
    }
};




/*
//-------- ----------
// threejs-
// https://
//-------- ----------
vc.states['examples_object_grid_wrap'] = {
    scene: new THREE.Scene(),
    init : (sm, scene, camera) => {
    },
    update: (sm, scene, camera, per, bias) => {
    }
};
*/
