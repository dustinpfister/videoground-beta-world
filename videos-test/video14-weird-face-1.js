/*   video14 - testing out weird-face-1 dae file
 */
// the dae files to use for this video
VIDEO.daePaths = [
  '../dae/weird-face-1/mouths-1b.dae',
  '../dae/weird-face-1/weird-face-1b.dae'
];

VIDEO.scripts = [
  '../js/dae-helpers.js'
];

var lerpGeo = function(geo, geoA, geoB, alpha){
    alpha = alpha || 0;
    // pos, and new pos
    let pos = geo.getAttribute('position');
    let norm = geo.getAttribute('normal');
    // positions for a and b
    let posA = geoA.getAttribute('position');
    let posB = geoB.getAttribute('position');
    // normals for a and b
    let normA = geoA.getAttribute('normal');
    let normB = geoB.getAttribute('normal');

    var i = 0, len = pos.array.length;
    while(i < len){
        // update position
        var v = new THREE.Vector3(posA.array[i], posA.array[i + 1], posA.array[i + 2]);
        var v2 = new THREE.Vector3(posB.array[i], posB.array[i + 1], posB.array[i + 2]);
        v.lerp(v2, alpha);
        pos.array[i] = v.x;
        pos.array[i + 1] = v.y;
        pos.array[i + 2] = v.z;
        // update normals
       // var v = new THREE.Vector3(normA.array[i], normA.array[i + 1], normA.array[i + 2]);
       // var v2 = new THREE.Vector3(normB.array[i], normB.array[i + 1], normB.array[i + 2]);
       // v.lerp(v2, alpha);
       // norm.array[i] = v.x;
       // norm.array[i + 1] = v.y;
       // norm.array[i + 2] = v.z;        

        i += 3;
    }
    pos.needsUpdate = true;
    //geo.computeVertexNormals();
    //norm.needsUpdate = true;
};


// init method for the video
VIDEO.init = function(sm, scene, camera){

    // GRID HELPER AND BACKGROUND
    scene.background = new THREE.Color('black');
    //scene.add(new THREE.GridHelper(10, 10));

    // LIGHT
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 2, 3);
    scene.add(light);
    var ambient = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambient);

    // getting weird face one assets
    let ud = scene.userData;
    let m0 = ud.m0 = VIDEO.daeResults[0].scene.getObjectByName('mouth-0');
    let m1 = ud.m1 = VIDEO.daeResults[0].scene.getObjectByName('mouth-1');
    let nose = scene.userData.wf = VIDEO.daeResults[1].scene.getObjectByName('nose');
    // get mouth from nose group
    let mouth = ud.mouth = nose.getObjectByName('mouth');

mouth.material.side = THREE.DoubleSide;

console.log(mouth.material.side)

    // add just main 'nose' group to scene, m0 and m1 are used to update geo of mouth
    scene.add(nose);

console.log( mouth.geometry.getAttribute('position').array.length )
console.log( mouth.geometry.getAttribute('normal').array.length )

    console.log(mouth.geometry)

/*
    let geo = mouth.geometry;
    // pos, and new pos
    let pos = geo.getAttribute('position');
    let posA = m0.geometry.getAttribute('position');
    let posB = m1.geometry.getAttribute('position');
    var i = 0, len = pos.array.length;
    while(i < len){
        var v = new THREE.Vector3(posA.array[i], posA.array[i + 1], posA.array[i + 2]);
        var v2 = new THREE.Vector3(posB.array[i], posB.array[i + 1], posB.array[i + 2]);
        v.lerp(v2, 1);
        //pos.array[i] = posA.array[i];
        pos.array[i] = v.x;
        pos.array[i + 1] = v.y;
        pos.array[i + 2] = v.z;

        i += 3;
    }
    pos.needsUpdate = true;

console.log(geo)
*/

lerpGeo(mouth.geometry, m0.geometry, m1.geometry, 0.5)
    



    


/*
    let wf = scene.userData.wf = VIDEO.daeResults[0].scene.children[0];
    wf.position.set(0, 0.25, 0);
    // !!! if werid face one has textures then use this to make them emmisve maps with the standard material
    //DAEHelpers.reMapGroup(guyDAE);
    scene.add(wf);

    // get by name
    var mouth = wf.getObjectByName('mouth');
    // !!! doing the quick temp fix for messed up normals on the mouth
    //mouth.material.side = THREE.DoubleSide;
    console.log(mouth);
*/



};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    let ud = scene.userData;

    lerpGeo(ud.mouth.geometry, ud.m0.geometry, ud.m1.geometry, bias);

    camera.position.set(2 - 4 * bias, 0, 2);
    camera.lookAt(0, -0.25, 0);
};

