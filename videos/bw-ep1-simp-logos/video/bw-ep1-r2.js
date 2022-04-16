// r2 of beta world episode 1
// At this point I just want to have some mesh objects for mouth movement
// when the guy models talk
VIDEO.daePaths = [
    '../../../dae/house1-bedroom/h1-b1-full.dae',
    '../../../dae/guy2/guy2.dae'
];

VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/dae-helpers.js',
   '../../../js/sequences.js',
   '../js/lipcubes.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){

    /********** **********
    * USING HOME1 MODEL
    *********** *********/

    let home1 = scene.userData.home1 = VIDEO.daeResults[0].scene.children[0];
    DAEHelpers.reMapGroup(home1);
    home1.position.set(0, 0, 0);
    scene.add(home1);

    /********** **********
    * SETTING UP DISP CUBE FOR COMPUTER SCREEN
    *********** *********/

    // append display box for screen
    var screen = home1.getObjectByName('screen');

    // canvas obj for disp object
    var DRAW_METHODS = {};
    DRAW_METHODS.dispBox = {};
    DRAW_METHODS.dispBox.simpLogo = (ctx, canvas, sm, opt) => {
        // black background
        ctx.fillStyle = 'black';
        ctx.fillRect(-1, -1, canvas.width + 2, canvas.height + 2);
        // drawing the triangle that I wanted
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'rgba(255,128,0,0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(55, 32);
        ctx.lineTo(16, 16);
        ctx.lineTo(16, 48);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    };
    var canvasObj = CanvasMod.createCanvasObject(sm, DRAW_METHODS, { width: 64, height: 64});
    canvasObj.draw({
       drawClass: 'dispBox',
       drawMethod: 'simpLogo'
    });
    // disp materials
    var dispMaterial = [
        new THREE.MeshStandardMaterial({ // sides of disp box
            emissive: 0x202020,
            emissiveIntensity: 1
        }),
        new THREE.MeshStandardMaterial({ // display side of box
            emissive: 0xafafaf,
            emissiveIntensity: 1,
            emissiveMap: canvasObj.texture
        })
    ];
    // disp geo
    var dispGeo = new THREE.BoxGeometry(0.1, 1.30, 0.90);
    dispGeo.groups.forEach(function(gr){
        gr.materialIndex = 0;
    });
    dispGeo.groups[1].materialIndex = 1;
    // disp mesh
    var dispBox = new THREE.Mesh( dispGeo, dispMaterial );
    dispBox.position.set(0.87, 0.26, 1.00);
    screen.add(dispBox);

    /********** **********
    * SETTING UP MRGUY1 and MRGUY2 using GUY2 MODEL
    *********** *********/

    // using guy2 model for this one
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

    /********** **********
    * LIP CUBES FOR MRGUY1 and MRGUY2
    *********** *********/

    var lips1 = lipCubes.create();
    console.log('lips: ', lips1);

    /********** **********
    * SEQUNCES
    *********** *********/

    // SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            // sq0 - open showing guy1 and computer
            {
                per: 0.0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    //camera.position.set(0, 4.0, -6);
                    //camera.lookAt(-4, 2, -5);
                    
                    camera.position.set(4, 4.0, 5);
                    camera.lookAt(-4, 3, -4);
                    // mr guy2
                    mrg2.position.set(-2, 4, 4);
                }
            },
            // sq1 - move camera to see that guy2 is in background
            {
                per: 0.066,
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
                per: 0.093,
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
                per: 0.16,
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
                per: 0.226,
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
                per: 0.253,
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
                per: 0.32,
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
                per: 0.453,
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
                per: 0.52,
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
                per: 0.546,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(4.0, 4.0, -1.0);
                    camera.lookAt(-2.75, 3.5, -4);

                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                    var arm2 = mrg2.getObjectByName('arm2');
                    arm2.rotation.x = Math.PI * 2 - Math.PI * 0.40 * partPer;
                    
                }
            },
            // seq10 - mrguy2 says 'what is that?'
            {
                per: 0.613,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(4.0, 4.0, -1.0);
                    camera.lookAt(-2.75, 3.5, -4);

                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                    var arm2 = mrg2.getObjectByName('arm2');
                    arm2.rotation.x = Math.PI * 1.60;
                }
            },
            // seq11 - camera moves into position of computer screen
            {
                per: 0.68,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(4.0 - 6 * partPer, 4.0 - 1.25 * partPer, -1.0 - 3 * partPer);
                    camera.lookAt(-2.75 - 0.45 * partPer, 3.5 - 0.75 * partPer, -4 - 2 * partPer);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                    var arm2 = mrg2.getObjectByName('arm2');
                    arm2.rotation.x = Math.PI * 1.60 + 0.40 * partPer;

                }
            },
            // seq12 - mrguy1 says 'its is an overly simplified logo'
            {
                per: 0.706,
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
                per: 0.84,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(-2.0, 2.75 + 1.25 * partPer, -4.0 - 2 * partPer);
                    camera.lookAt(-3.2, 2.75 + 0.95 * partPer, -6 + 12 * partPer);
                    // mr guy2
                    mrg2.position.set(-2, 4, 0);
                }
            },
            // seq14 - mr guy2 says 'it does not look overly simplified to me'
            {
                per: 0.866,
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
    // defaults
    var head1 = scene.userData.head1;
    head1.rotation.set(0,0,0);
    // defauls for guy2
    var mrg2 = scene.userData.mrg2;
    var arm2 = mrg2.getObjectByName('arm2')
    arm2.rotation.x = Math.PI * 2; //Math.PI * 2 - Math.PI * 0.40;
    // call sequences
    Sequences.update(sm.seq, sm);
};

