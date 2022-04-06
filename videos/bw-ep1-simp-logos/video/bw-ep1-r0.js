
// the dae files to use for this video
VIDEO.daePaths = [
    '../../../dae/house1/house1.dae',
    '../../../dae/desk/deskset.dae'
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
    camera.lookAt(2, 2, 2);

    // LIGHT
    var light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(0, 2, 0)
    scene.add(light);

    // loading home1
    let home1 = scene.userData.home1 = VIDEO.daeResults[0].scene.children[2];
    home1.position.set(-4, 4,0)
    scene.add(home1);

    let desk = scene.userData.desk = VIDEO.daeResults[1].scene.children[0];
    desk.position.set(2.5,2,3);

    reMapGroup(desk);

    scene.add(desk);


};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    camera.position.set(0, 6, 0);
    var radian = Math.PI / 180 * 30 + Math.PI * 2 * sm.per,
    x = 2 * Math.cos(radian),
    z = 2 * Math.sin(radian);
    camera.lookAt(x, 3.7, z);
};

