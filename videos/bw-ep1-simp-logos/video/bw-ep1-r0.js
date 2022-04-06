
// the dae files to use for this video
VIDEO.daePaths = [
    '../../../dae/house1-bedroom/h1-b1-full.dae',
    '../../../dae/guy2/guy2.dae'
];

VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/dae-helpers.js',
   '../../../js/sequences.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){
    // loading home1-bedroom
    let home1 = scene.userData.home1 = VIDEO.daeResults[0].scene.children[0];
    DAEHelpers.reMapGroup(home1);
    home1.position.set(0, 0, 0);
    scene.add(home1);

    // loading mrguy1 as a guy2 model
    let mrg1 = scene.userData.mrg1 = VIDEO.daeResults[1].scene.children[2];
    DAEHelpers.reMapGroup(mrg1);
    mrg1.position.set(-2.75, 2.25, -3.0);

    mrg1.rotation.set(Math.PI * 1.5, 0, Math.PI * 1.0);
    scene.add(mrg1);

    // adjusting fixed pose for mrguy1
    var pelvis = mrg1.getObjectByName('pelvis');
    // rotate pelvis and caff
    pelvis.rotation.set(-1.57, 0, 0);

    var caff1 = pelvis.children[0].children[0];
    caff1.rotation.set(1.57, 0, 0);
    var caff2 = pelvis.children[1].children[0];
    caff2.rotation.set(1.57, 0, 0);

    console.log(mrg1);
    console.log(pelvis);

// SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            // open showing guy1 and computer
            {
                per: 0.0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(4, 4.0, 5);
                    camera.lookAt(-4, 3, -4);
                }
            },
            // move camera to see that guy2 is in background
            {
                per: 0.1,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    var x = 4 - 7 * partPer,
                    z = 5.0 - 11 * partPer;
                    camera.position.set(x, 4.0, z);
                    camera.lookAt(-4 + 2 * partPer, 3, -4 + 4 * partPer);
                }
            },
            // guy2 moves closer to guy1, camera moves up a little
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-3.0, 4.0 + 2 * partBias, -6.0);
                    camera.lookAt(-2, 3, 0);
                }
            }
        ]
    });

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    // camera
    //camera.position.set(0.5, 2.0, 2.5 - 8 * bias);
    //camera.lookAt(-4, 2, -4 + 4 * bias);

    // good start position maybe  
    //camera.position.set(4.0, 4.0, 5.0);
    //camera.lookAt(-4, 3, -4 + 4 * bias);
    Sequences.update(sm.seq, sm);
};

