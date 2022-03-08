var WorldPos = (function () {

    var api = {};

    var DEFAULT_SEALEVEL = 3;

    api.fromSea = function(world, lat, lon, alt){
        var v = new THREE.Vector3();
        // use seaLevel value in userData object of world object, or default value for it
        var seaLevel = world.userData.seaLevel === undefined ? DEFAULT_SEALEVEL : world.userData.seaLevel;
        // alt above sea level, lat and lon
        alt = alt === undefined ? 0 : alt;
        lat = lat === undefined ? 0 : lat;
        lon = lon === undefined ? 0 : lon;
        // special case for lon >= 1
        if(lon >= 1 ){
            lon = lon * 0.99999999;
        }
        // lat and lon values in 0-1 form
        lat = THREE.MathUtils.euclideanModulo(lat, 1);
        lon = THREE.MathUtils.euclideanModulo(lon, 1);
        
        // set and return position of vector
        var phi = Math.PI * lon;
        var theta = Math.PI * 2 * lat;
        v.setFromSphericalCoords(seaLevel + alt, phi, theta );
        return v;
    };

    return api;
}
    ());
