// simple 'bit' waveform for 1-bit music projects
CS.WAVE_FORM_FUNCTIONS.bit = (samp, a_wave) => {
    samp.amp = samp.amp === undefined ? 0.45 : samp.amp;
    samp.bit = samp.bit === undefined ? 0 : samp.bit;
    const n = samp.amp * (samp.bit === 0 ? -1 : 1);
    return n;
};
