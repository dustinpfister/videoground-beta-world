/* 'bit_merge' waveform for 1-bit music projects
       This works by giving an array of bit values such as [0,1,0] where each bit value is the current sample index of a track
       If I have three tracks, if any given track has a bit value of 1 the final track value will be 1, else 0
       0,0,0 => 0
       1,0,0 => 1
       0,0,0 => 0
       0,0,0 => 0
       1,0,1 => 1
       0,0,1 => 1
       0,0,1 => 1
       1,0,1 => 1
       0,0,1 => 1
*/
CS.WAVE_FORM_FUNCTIONS.bit_merge = (samp, a_wave) => {
    samp.amp = samp.amp === undefined ? 0.45 : samp.amp;
    samp.bit_tracks = samp.bit_tracks === undefined ? [] : samp.bit_tracks;
    let i = samp.bit_tracks.length;
    while(i--){
        if(samp.bit_tracks[i] === 1){
            return samp.amp * 1; // final bit value '1'
        }
    }
    return samp.amp * -1; // final bit value '0'
};