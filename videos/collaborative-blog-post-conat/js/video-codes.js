

window.vc = {
   states : {}
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
// threejs-curve-geometry-from
// https://github.com/dustinpfister/videoground-blog-posts/blob/master/videos/threejs-curve-geometry-from/videos/video1.js
//-------- ----------
vc.states['curve_geometry_from_video1'] = {
    scene: new THREE.Scene(),
    init : (sm, scene, camera) => {
        const sud = scene.userData;

        // HELPERS
        // get position data array helper
        const getCurvePosData = (curve1, curve2, points_per_line) => {
            const pos_data = [];
            let pi = 0;
            while(pi < points_per_line){
                const a1 = pi / (points_per_line - 1);
                const v1 = curve1.getPoint(a1);
                const v2 = curve2.getPoint(a1);
                pos_data.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
                pi += 1;
           }
           return pos_data;
        };
        // get uv data array helper
        const getCurveUVData = (curve1, curve2, points_per_line) => {
            const uv_data = [];
            let pi = 0;
            while(pi < points_per_line){
                const a1 = pi / (points_per_line - 1);
                uv_data.push(a1, 0, a1, 1);
                pi += 1;
           }
           return uv_data;
        };
        // set index
        const setCurveGeoIndex = (geo, points_per_line) => {
            const data_index = [];
            let pi2 = 0;
            while(pi2 < points_per_line - 1){
                const a = pi2 * 2;
                const b = a + 1;
                const c = a + 2;
                const d = a + 3;
                data_index.push(b, c, d, c, b, a);
                pi2 += 1;
            }
            geo.setIndex(data_index);
        };
        // create curve geo
        const createCurveGeo = (curve1, curve2, points_per_line) => {
            const geo = new THREE.BufferGeometry();
            const uv_data = getCurveUVData(curve1, curve2, points_per_line);
            // position/index
            const pos_data = getCurvePosData(curve1, curve2, points_per_line);
            geo.setAttribute('position', new THREE.Float32BufferAttribute( pos_data, 3 ) );
            setCurveGeoIndex(geo, points_per_line);
            // uv
            geo.setAttribute('uv', new THREE.Float32BufferAttribute( uv_data, 2 ) );
            // normal
            geo.computeVertexNormals();
            return geo;
        };
        const updateCurveGeo = sud.updateCurveGeo = (geo, curve1, curve2, points_per_line) => {
            const pos_data = getCurvePosData(curve1, curve2, points_per_line);
            const pos = geo.getAttribute('position');
            pos.array = pos.array.map((n, i) => { return pos_data[i] });
            pos.needsUpdate = true;
            // normal
            geo.computeVertexNormals();
            return geo;
        };
        const QBC3 = sud.QBC3 = (c1_start, c1_control, c1_end) => {
            return new THREE.QuadraticBezierCurve3(c1_start, c1_control, c1_end);
        };
        // LIGHT
        const dl = new THREE.DirectionalLight(0xffffff, 1);
        dl.position.set(0, 1, -5);
        scene.add(dl);
        const al = new THREE.AmbientLight(0xffffff, 0.25);
        scene.add(al);
        // CURVES
        const c1_start = sud.c1_start = new THREE.Vector3(-5,0,5), 
        c1_control = sud.c1_control = new THREE.Vector3(0, 10, 0), 
        c1_end = sud.c1_end = new THREE.Vector3(5,0,5),
        c2_start = sud.c2_start = new THREE.Vector3(-5,0,-5), 
        c2_control = sud.c2_control = new THREE.Vector3(0, -5, 0), 
        c2_end = sud.c2_end = new THREE.Vector3(5,0,-5);
        const curve1 = new THREE.QuadraticBezierCurve3(c1_start, c1_control, c1_end);
        const curve2 = new THREE.QuadraticBezierCurve3(c2_start, c2_control, c2_end);
        // GEO POSITION / UV
        const geo = sud.geo = createCurveGeo(
            QBC3(c1_start, c1_control, c1_end),
            QBC3(c2_start, c2_control, c2_end),
            50
        );
        // TEXTURE
        // USING THREE DATA TEXTURE To CREATE A RAW DATA TEXTURE
        const width = 128, height = 128;
        const size = width * height;
        const data = new Uint8Array( 4 * size );
        for ( let i = 0; i < size; i ++ ) {
            const stride = i * 4;
            // x and y pos
            const xi = i % width;
            const yi = Math.floor(i / width);
            const v2 = new THREE.Vector2(xi, yi);
            // alphas
            const a_rnd1 = THREE.MathUtils.seededRandom();
            const a_rnd2 = THREE.MathUtils.seededRandom();
            const a_rnd3 = THREE.MathUtils.seededRandom();
            let a_dist = v2.distanceTo( new THREE.Vector2( width * 0.25, height * 0.75) ) / (width / 16);
            a_dist = a_dist % 1;
            const a_x = xi / width;
            const a_y = yi / height;
            const cv = 255 * (a_dist);
            // red, green, blue, alpha
            data[ stride ] = cv;
            data[ stride + 1 ] = 0;
            data[ stride + 2 ] = 255 - cv;
            data[ stride + 3 ] = 255;
        }
        const texture = new THREE.DataTexture( data, width, height );
        texture.needsUpdate = true;
        // MATERIAL AND MESH
        const material = new THREE.MeshPhongMaterial({ map: texture, wireframe: false, side: THREE.DoubleSide});
        const mesh = new THREE.Mesh(geo, material);
        scene.add(mesh);
        // internal get bias method
        const getBias = function(per){
            return 1 - Math.abs( 0.5 - per ) / 0.5;
        };
        // get sin bias helper
        const getSinBias = sud.getSinBias = function(per){
            const b = getBias(per);
            return Math.sin( Math.PI * 0.5 * b );
        };
    },
    update: (sm, scene, camera, per, bias) => {
        const sud = scene.userData;
        const a1 = sud.getSinBias(12 * per % 1);
        const a2 = sud.getSinBias(6 * per % 1);
        sud.c1_start.set(-5 - 15 * per, 0, 5);
        sud.c1_end.set(5, 0, 5);
        sud.c1_control.set(5 * per,-5 + 10 * a1, 0);
        sud.c2_start.set(-5 + 4 * per, 0, -5);
        sud.c2_end.set(5 - 4 * per, 0, -5);
        sud.c2_control.set(0, 2.5 - 6 * a2, 0);
        sud.updateCurveGeo(
            sud.geo,
            sud.QBC3(sud.c1_start, sud.c1_control, sud.c1_end),
            sud.QBC3(sud.c2_start, sud.c2_control, sud.c2_end),
            50
        );
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
