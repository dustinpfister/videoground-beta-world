var DAEHelpers = (function () {
    // API
    var api = {};
    // DAEHelpers.reMapGroup(group, opt)
    // remap the map property for all mesh object to the emissiveMap property
    api.reMapGroup = function(group, opt){
        // options
        opt = opt || {};
        // default to using THREE.DoubleSide for the side prop of materials
        opt.side = opt.side || THREE.DoubleSide;
        // for all children of the group
        group.children.forEach(function(child){
            // if child has a material
            if(child.material){
                var map = child.material.map;
                if(map){
                    child.material = new THREE.MeshStandardMaterial({
                        emissive: 0xffffff,
                        emissiveMap: map,
                        emissiveIntensity: 1,
                        side: THREE.DoubleSide
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
    // return public API
    return api;
}
    ());
