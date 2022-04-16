var lipCubes = (function(){

    var api = {};

    // create a set of lip cubes to use with a guy model that does not have them
    api.create = function(){
        var lips = new THREE.Group();
        return lips;
    };

    return api;


}());