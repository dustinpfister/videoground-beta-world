var WorldPos = (function () {

    var api = {};

    // parse a given lat or lon value for a method like fromSea
    var parseLatLon = function(n){
        if(n < 0){
            return 0;
        }
        if(n >= 1){
            return 0.9999999999999999; 
        }
        return n;
    };

    var DEFAULT_SEALEVEL = 3;

    // return a Vector3 for the world with the given lat, lon and alt from 'sea level'
    api.fromSea = function(world, lat, lon, alt){
        var v = new THREE.Vector3();
        // use seaLevel value in userData object of world object, or default value for it
        var seaLevel = world.userData.seaLevel === undefined ? DEFAULT_SEALEVEL : world.userData.seaLevel;
        // parse lat an lon
        lat = parseLatLon(lat);
        lon = parseLatLon(lon);
        // set and return position of vector
        var phi = Math.PI * lon;
        var theta = Math.PI * 2 * lat;
        v.setFromSphericalCoords(seaLevel + alt, phi, theta );
        return v;
    };

    // adjust the given object for
    api.adjustObject = function(world, obj, lat, lon, heading, alt, method){
        method = method || 'fromSea';
        // get vector3 to use
        var v = api[method](world, lat, lon, alt);
        obj.position.copy(v);
        // look at world position
        obj.lookAt(world.position);
        // adjust so obj is standing up
        obj.rotateX(-1.57);
        // set heading of obj
        obj.rotateY(heading);
    };

    return api;
}
    ());
