var DAEHelpers = (function () {
    
    var api = {};

    // remape group helper
    api.reMapGroup = function(group){
        group.children.forEach(function(mesh){

            // if child has a material
            if(mesh.material){

                var map = mesh.material.map;
                if(map){
                    mesh.material = new THREE.MeshStandardMaterial({
                        emissive: 0xffffff,
                        emissiveMap: map,
                        emissiveIntensity: 1
                    });
                }
            }else{
               
               console.log('no material for object.');
               console.log('type: ' + mesh.type)
            }
        });
    };

    return api;
}
    ());
