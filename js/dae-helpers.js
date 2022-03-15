var DAEHelpers = (function () {
    
    var api = {};

    // remape group helper
    api.reMapGroup = function(group){
        group.children.forEach(function(mesh){
            var map = mesh.material.map;
            mesh.material = new THREE.MeshStandardMaterial({
                emissive: 0xffffff,
                emissiveMap: map,
                emissiveIntensity: 1
            });
        });
    };

    return api;
}
    ());
