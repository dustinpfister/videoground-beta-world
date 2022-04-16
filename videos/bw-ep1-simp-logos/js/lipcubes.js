var lipCubes = (function(){

    var api = {};

    var lipMaterial = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.75
    });

    // create a set of lip cubes to use with a guy model that does not have them
    api.create = function(){
        var lips = new THREE.Group();
        // upper lip
        var upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.05, 0.05),
            lipMaterial
        );
        lips.add(upper);
        // lower lip
        var lower = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.05, 0.05),
            lipMaterial
        );
        lower.position.set(0, 0, -0.05);
        lips.add(lower);
        return lips;
    };

    return api;


}());