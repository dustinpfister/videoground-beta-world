var lipCubes = (function(){

    var VEC_UPPER_HOME = new THREE.Vector3(0, 0, 0),  // home vectors for upper and lower lips
    VEC_LOWER_HOME = new THREE.Vector3(0, 0, -0.05),
    VEC_UPPER_TRANS = new THREE.Vector3(0, 0, 0.04),           // translate vectors for upper and lower lips
    VEC_LOWER_TRANS = new THREE.Vector3(0, 0, -0.04);
    
    var api = {};

    var lipMaterial = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.75
    });

    // Create a set of lip cubes to use with a guy model that does not have them
    api.create = function(opt){
        opt = opt || {};
        opt.per = opt.per === undefined ? 0 : opt.per;
        var lips = new THREE.Group();
        // upper lip
        var upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.05, 0.05),
            lipMaterial
        );
        //upper.position.copy( VEC_UPPER_HOME ).add(VEC_UPPER_TRANS);
        lips.add(upper);
        // lower lip
        var lower = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.05, 0.05),
            lipMaterial
        );
        //lower.position.copy( VEC_LOWER_HOME ).add(VEC_LOWER_TRANS);
        lips.add(lower);
        // call talk for first time
        api.talk(lips, opt.per);
        return lips;
    };

    // Set the talk state of the given lips Group object
    // per: 0 - closed, 1 - open
    api.talk = function(lips, talkPer, talkCount){
        talkPer = talkPer === undefined ? 0 : talkPer;
        talkCount = talkCount === undefined ? 1 : talkCount;
        var upper = lips.children[0],
        lower = lips.children[1];
        var per = talkPer * talkCount % 1;
        var bias = 1 - Math.abs(0.5 - per) / 0.5;
        upper.position.copy( VEC_UPPER_HOME ).add( VEC_UPPER_TRANS.clone().multiplyScalar(bias) );
        lower.position.copy( VEC_LOWER_HOME ).add( VEC_LOWER_TRANS.clone().multiplyScalar(bias) );
    };

    return api;


}());