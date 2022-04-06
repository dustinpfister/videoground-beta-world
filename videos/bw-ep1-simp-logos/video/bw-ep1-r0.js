
// the dae files to use for this video
VIDEO.daePaths = [
    '../../../dae/house1-bedroom/h1-b1-full.dae'
];

VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/dae-helpers.js',
   '../../../js/sequences.js'
];

// THIS SHOULD BE PART OF A NEW JAVASCRIPT FILE
// call it somehting like dae-helpers.js
var reMapGroup = function(group){
    group.children.forEach(function(mesh){
        var map = mesh.material.map;
        mesh.material = new THREE.MeshStandardMaterial({
            emissive: 0xffffff,
            emissiveMap: map,
            emissiveIntensity: 1
        });
    });
};

// init method for the video
VIDEO.init = function(sm, scene, camera){

    scene.add(new THREE.GridHelper(10, 10));
    // CAMERA
    camera.position.set(-3, 3, -5);
    camera.lookAt(0, 2, 0);

    // LIGHT
    //var light = new THREE.PointLight(0xffffff, 0.5);
    //light.position.set(0, 2, 0)
    //scene.add(light);

    // loading home1-bedroom
    let home1 = scene.userData.home1 = VIDEO.daeResults[0].scene.children[0];
    DAEHelpers.reMapGroup(home1);
    home1.position.set(0, 0,0);
    scene.add(home1);
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    camera.position.set(0, 4, 0);
    var radian = Math.PI / 180 * 220 + Math.PI * 2 * sm.per,
    x = 2 * Math.cos(radian),
    z = 2 * Math.sin(radian);
    camera.lookAt(x, 3, z);
};

