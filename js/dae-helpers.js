var DAEHelpers = (function () {
    
    var api = {};

    // remape group helper
    api.reMapGroup = function(group){
        group.children.forEach(function(child){
            // if child has a material
            if(child.material){
                var map = child.material.map;
                if(map){
                    child.material = new THREE.MeshStandardMaterial({
                        emissive: 0xffffff,
                        emissiveMap: map,
                        emissiveIntensity: 1
                    });
                }
            }else{
                // might not be a material becuase it is a group
                // if so call api.reMapGroup for that
                if(child.type === 'Group'){
                    api.reMapGroup(child);
                }else{
                    console.log('no material for object.');
                    console.log('type: ' + child.type);
                }
            }
        });
    };

    return api;
}
    ());
