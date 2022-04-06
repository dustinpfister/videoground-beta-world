
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
    scene.add(mrg1);
    // mr guy2 (clone of mrguy1 for now)
    let mrg2 = scene.userData.mrg2 = mrg1.clone();
    scene.add(mrg2);

    // fixed pos for mrguy1
    mrg1.position.set(-2.75, 2.25, -3.0);
    mrg1.rotation.set(Math.PI * 1.5, 0, Math.PI * 1.0);
    // adjusting fixed pose for mrguy1
    var pelvis = mrg1.getObjectByName('pelvis');
    var head1 = scene.userData.head1 = mrg1.getObjectByName('head');
    // rotate pelvis and caff
    pelvis.rotation.set(-1.57, 0, 0);
    var caff1 = pelvis.children[0].children[0];
    caff1.rotation.set(1.57, 0, 0);
    var caff2 = pelvis.children[1].children[0];
    caff2.rotation.set(1.57, 0, 0);

    // fixed pos for mrguy2
    mrg2.rotation.set(Math.PI * 1.5, 0, Math.PI * 1.0);

// SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            // sq0 - open showing guy1 and computer
            {
                per: 0.0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(4, 4.0, 5);
                    camera.lookAt(-4, 3, -4);
                    // mr guy2
                    mrg2.position.set(-2, 4, 4);
                }
            },
            // sq1 - move camera to see that guy2 is in background
            {
                per: 0.1,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    var x = 4 - 8 * partPer,
                    z = 5.0 - 11 * partPer;
                    camera.position.set(x, 4.0, z);
                    camera.lookAt(-4 + 2 * partPer, 3, -4 + 4 * partPer);
                    // mr guy2
                    mrg2.position.set(-2, 4, 4);
                }
            },
            // sq2 - guy2 moves closer to guy1, camera moves up a little
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-4.0, 4.0 + 3 * partPer, -6.0);
                    camera.lookAt(-2, 3 + 1 * partPer, 0);
                    // mr guy2
                    mrg2.position.set(-2, 4, 4 - 4 * partPer);
                }
            },
            // sq3 - guy2 says 'what are you doing?'
            {
                per: 0.20,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-4.0, 7.0, -6.0);
                    camera.lookAt(-2, 4.0, 0);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // sq4 - camera moves to back of head of mrguy1
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-4.0 + 1.25 * partPer, 7.0 - 3 * partPer, -6.0 + 5 * partPer);
                    camera.lookAt(-2 - 0.75 * partPer, 4.0 - 0.5 * partPer, 0 - 4 * partPer);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // sq5 - head of mrguy1 rotates first 180
            {
                per: 0.30,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-2.75, 4.0, -1.0);
                    camera.lookAt(-2.75, 3.5, -4);
                    head1.rotation.set(0,0,3.14 * partPer);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // sq6 - mrguy1 says 'I am making a video...'
            {
                per: 0.35,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-2.75, 4.0, -1.0);
                    camera.lookAt(-2.75, 3.5, -4);
                    head1.rotation.set(0, 0, 3.14);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // sq7 - mrguy1 rotates another 180 to compleate a full 360 rotation of head
            {
                per: 0.40,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-2.75, 4.0, -1.0);
                    camera.lookAt(-2.75, 3.5, -4);
                    head1.rotation.set(0, 0, 3.14 + 3.14 * partPer);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // seq8 - move camera to show both mrguy1, mrguy2 and have computer screen in view
            {
                per: 0.45,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-2.75 + 6.75 * partPer, 4.0, -1.0);
                    camera.lookAt(-2.75, 3.5, -4);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // seq9 - mrguy2 moves arm to point at sceen
            {
                per: 0.50,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(4.0, 4.0, -1.0);
                    camera.lookAt(-2.75, 3.5, -4);

                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // seq10 - mrguy2 says 'what is that?'
            {
                per: 0.55,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(4.0, 4.0, -1.0);
                    camera.lookAt(-2.75, 3.5, -4);

                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // seq11 - camera moves into position of computer screen
            {
                per: 0.60,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(4.0 - 6 * partPer, 4.0 - 1.25 * partPer, -1.0 - 3 * partPer);
                    camera.lookAt(-2.75 - 0.45 * partPer, 3.5 - 0.75 * partPer, -4 - 2 * partPer);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // seq12 - mrguy1 says 'its is an overly simplified logo'
            {
                per: 0.65,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-2.0, 2.75, -4.0);
                    camera.lookAt(-3.2, 2.75, -6);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // seq13 - camera moves around to look at guy1 and guy2
            {
                per: 0.70,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-2.0, 2.75 + 1.25 * partPer, -4.0 - 2 * partPer);
                    camera.lookAt(-3.2, 2.75 + 0.95 * partPer, -6 + 12 * partPer);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // seq13 - camera moves around to look at guy1 and guy2
            {
                per: 0.75,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-2.0, 4, -6.0);
                    camera.lookAt(-3.2, 3.7, 6);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            }
        ]
    });

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){

    var head1 = scene.userData.head1;
    head1.rotation.set(0,0,0);

    Sequences.update(sm.seq, sm);
};

