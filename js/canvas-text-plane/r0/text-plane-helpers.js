(function(api){

    api.createTextData = (opt) => {
        opt = opt || {};
        const textData = {};
        textData.TEXT_PXSIZE = opt.TEXT_PXSIZE || 40;
        textData.TEXT_BLANK_START_LINES = opt.TEXT_BLANK_START_LINES === undefined ? 7 : opt.TEXT_BLANK_START_LINES ;
        textData.TEXT_CHAR_PER_LINE = 9;
        textData.TEXT_STARTY = 10;
        textData.TEXT_BGCOLOR = opt.TEXT_BGCOLOR || 'rgba(0,0,0,0.4)';
        textData.TEXT_FONTCOLORS = opt.TEXT_FONTCOLORS || ['lime', 'white'];
        textData.TEXT = opt.TEXT || [
            'This is the hello of the world.',
            'More Demo Text'
        ];
        textData.TEXT_LINES = textData.TEXT.map( (str) => {
            const lines = TextPlane.createTextLines(str + ' ', textData.TEXT_CHAR_PER_LINE);
            let i = 0;
            while(i < textData.TEXT_BLANK_START_LINES){
                lines.unshift('');
                i += 1;
            }
            return lines;
        });
        return textData;
    };

    api.setLineStyle = (plane_text, pxSize, font ) => {
        const state = plane_text.userData.canObj.state;
        state.lines.forEach( (line) => {
            line.fs = pxSize + 'px';
            line.f = font || 'arial';
        });
    };
    // update text helper
    api.updateText = (plane_text, alpha, TLIndex, textData ) => {
        // move the text lines ( lines, testLines, alpha, startY, deltaY )
        const lines = plane_text.userData.canObj.state.lines;
        TextPlane.moveTextLines(lines, textData.TEXT_LINES[TLIndex], alpha, textData.TEXT_STARTY, textData.TEXT_PXSIZE);
        // update the canave
        canvasMod.update(plane_text.userData.canObj);
    };


}(this['textPlaneHelper'] = {}));