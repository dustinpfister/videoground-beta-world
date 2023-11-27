/*    samp-tracker.js from videoground-beta-world/videos/samp-tracker
 *        * Just working out the first form of this kind of module
 *
 */
(function(){
    const NOTES = 'c-,c#,d-,d#,e-,f-,f#,g-,g#,a-,a#,b-'.split(',');
    const STRACK = {};
    // parse string data to roll array, or just return if object
    STRACK.parse_data = (data, BBS=4) => {
        if(typeof data === 'object'){
            return data;
        }
        const roll = data.split(/\n|\r\n/).map((e)=>{
            return e.trim().split(' ');
        }).filter((line)=>{
            return line[0][0] != '#';
        });
        const push_count = BBS - roll.length % BBS;
        let i = 0;
        while(i < push_count && push_count != BBS){
           roll.push([''])
           i += 1;
        }
        return roll;
    };
    // loop all lines of roll
    STRACK.loop_lines = (data, for_line ) => {
        const roll = STRACK.parse_data(data);
        let i = 0;
        const len = roll.length;
        while(i < len){
           const e = roll[i];
           const r = for_line(e[0], e[1], e[2], e[3] || '', e);
           if(r){
              break;
           }
           i += 1;
        }
    };
    STRACK.get_total_secs = (data, BBS=4) => {
        const roll = STRACK.parse_data(data);
        return roll.length / BBS;
    };
    STRACK.note_index_to_freq = (note_index) => {
        if(note_index === ''){
            return 0;
        }
        if(typeof note_index === 'string'){
            const ni = NOTES.findIndex( (str) => { 
                return str === note_index.substr(0,2);
            });
            return ST.notefreq_by_indices( parseInt(note_index.substr(2,1))  , ni);
        }
        return 0;
    };
    // get a current line array, index, or array of such things
    STRACK.get_current_line_by_alpha = (data, BBS=4, alpha=0, indices=false, count=1) => {
        const roll = STRACK.parse_data(data);
        const i = Math.floor( roll.length * alpha);
        let arr = [];
        if(count > 1){
            arr = roll.slice(i, i + count);
            if(!indices){
                arr.map((line)=>{
                    const a = line.slice(0, line.length);
                    a.unshift(i + count);
                    return a;
                });
            }
            return indices ? arr.map((l, li)=>{ return i + li}) : arr;
        }
        arr = roll[i].slice(0, roll[i].length);
        if(!indices){
           arr.unshift(i);
        }
        return indices ? i : arr;
    };
    //-------- ----------
    // STRACK.get_current_params method and helper functions
    //-------- ----------
    const loop_back = (roll, i_line, i_col) => {
        let i = i_line;
        while(i_line--){
            const b = roll[i_line];
            if(b[i_col - 1] != ''){
                if(typeof b[i_col] === 'string'){
                    const m = b[i_col].match(/-/g);
                    if(m){
                        if(m.length === b[i_col.length]){
                            continue;
                        }
                    }
                }
                if(typeof b[i_col] === 'undefined'){
                    continue;
                }
                return b[i_col - 1];
            }
        }
        return '';
    };
    // get current params or array with empty string if there is nothing to get
    STRACK.get_current_params = (roll, BBS=4, alpha=0) => {
        const a = STRACK.get_current_line_by_alpha(roll, BBS, alpha, false, 1);
        let i = STRACK.get_current_line_by_alpha(roll, BBS, alpha, true, 1);
        // [0, '']  <=== loop back to get all params
        // [0, 'c-3', '0', '1.00', '0:10'] <=== sets all, no need for loop back
        const params = [ a[0] ];
        let i_col = 1;
        while(i_col < 5){
            // if we have an empty string, or undefined, loop back
            if(a[i_col] === '' || a[i_col] === undefined){
                params[i_col] = loop_back(roll, i, i_col);
                i_col += 1;
                continue;
            }
            if(typeof a[i_col] === 'string'){
                const m = a[i_col].match(/-/g);
                if(m){
                    // if string is contains only '-', loop back
                    if(m.length === a[i_col.length]){
                        params[i_col] = loop_back(roll, i, i_col);
                        i_col += 1;
                        continue;
                    }
                }
            }
            params[i_col] = a[i_col];
            i_col += 1;
        }
        return params;
    };
    window.STRACK = STRACK;
}());