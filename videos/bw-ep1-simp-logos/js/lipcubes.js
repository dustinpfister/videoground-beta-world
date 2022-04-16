var lipCubes = (function(){

    var api = {};

    // create a set of lip cubes to use with a guy model that does not have them
    api.create = function(){
        var lips = new THREE.Group();
        var upper = new THREE.Mesh(
            new THREE.BoxGeometry(0.10, 0.10, 0.10),
            new THREE.MeshNormalMaterial()
        );
        lips.add(upper);
        return lips;
    };

    return api;


}());