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
        // get the current index
        var currentIndex = getCurrentPartIndex(seq);
        // if currentIndex equals partIndex then just call update of current part
        // else update sm.partIndex and call init
        if(currentIndex === sm.partIndex && sm.frame != 0){
            var partObj = seq.part[sm.partIndex];
            partObj.update(sm, sm.scene, sm.camera, 0, 0);
        }else{
            // else set sm.partIndex
            sm.partIndex = currentIndex;
            var partObj = seq.part[sm.partIndex];
            partObj.init(sm);
            partObj.update(sm, sm.scene, sm.camera, 0, 0);
        }
    };
    return api;
}
    ());
