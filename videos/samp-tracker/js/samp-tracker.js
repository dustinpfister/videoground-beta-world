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
        if(count > 1){
            const arr = roll.slice(i, i+ count);
            return indices ? arr.map((l, li)=>{ return i + li}) : arr;
        }
        return indices ? i : roll[i];
    };
    // get current params or array with empty string if there is nothing to get
    STRACK.get_current_params = (roll, BBS=4, alpha=0) => {
        const a = STRACK.get_current_line_by_alpha(roll, BBS, alpha, false, 1);
        if(a[0] === ''){
            let i = STRACK.get_current_line_by_alpha(roll, BBS, alpha, true, 1);
            while(i--){
                const b = roll[i];
                if(b[0] != ''){
                    return b;
                }
            }
        }else{
            return a
        }
        return [''];
    };
    window.STRACK = STRACK;
}());