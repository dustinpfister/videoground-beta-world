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

    return api;
}
    ());