var Sequences = (function () {
    
    var api = {};

    var create = {};



    api.create = function(opt){
        opt = opt || {};
        var seq = {
           partIndex: 0,
           sm: opt.sm || {},
           part: opt.part || []
        };
        return seq;
    };
 
    // get current part index helper
    var getCurrentPartIndex = function(seq){
        var i = 0,
        len = seq.part.length;
        while(i < len){
            var partObj = seq.part[i];
            if(seq.sm.per < partObj.per){
                return i - 1;
            }
            // else take a look at the next partObj
            i += 1;
        }
        // there should always be one part, so this should not present a problem
        return len - 1;
    };

    api.update = function(seq, sm){

        console.log( getCurrentPartIndex(seq) );
        

    };


    return api;
}
    ());
