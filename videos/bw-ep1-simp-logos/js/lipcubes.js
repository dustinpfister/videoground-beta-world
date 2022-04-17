var lipCubes = (function(){

    var VEC_UPPER_HOME = new THREE.Vector3(0, 0, 0),  // home vectors for upper and lower lips
    VEC_LOWER_HOME = new THREE.Vector3(0, 0, -0.05);
    //VEC_UPPER_TRANS = new THREE.Vector3(1, 1, 0.50);           // translate vectors for upper and lower lips

    var api = {};

    var lipMaterial = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.75
    });

    // Create a set of lip cubes to use with a guy model that does not have them
    api.create = function(){
        var lips = new THREE.Group();
        // upper lip
        var upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.05, 0.05),
            lipMaterial
        );
        upper.position.copy( VEC_UPPER_HOME );
        lips.add(upper);
        // lower lip
        var lower = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.05, 0.05),
            lipMaterial
        );
        lower.position.copy( VEC_LOWER_HOME );
        lips.add(lower);
        return lips;
    };

    // Set the talk state of the given lips Group object
    // per: 0 - closed, 1 - open
    api.talk = function(lips, per){

    };

    return api;


}());