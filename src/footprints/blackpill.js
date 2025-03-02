// ST32 blackpill basic
// Params
//  orientation: default is down
//    if down, power led will face the pcb???
//    if up, power led will face away from pcb???

// all these consts are provided as the value from origin 
// (eg. outline X is from center to one edge so that it can be used +/- to reach either edge)
// unit is mm
const pinsY = 8;
const labelY = 5;
const pinPitch = 2.54;
const pinsInARow = 20;
const firstPinX = -(((pinsInARow / 2) - 0.5) * pinPitch);
function pinX(indexInRow) {
    return firstPinX + (indexInRow * pinPitch);
}
const outlineX = pinX(pinsInARow);
const outlineY = pinsY + pinPitch;
const pinPadSize = 1.7526;
const pinHoleSize = 1.0922;

module.exports = {
    params: {
        designator: 'MCU',
        orientation: 'down',
        P1: {type: 'net', value: 'P1'},
        P2: {type: 'net', value: 'P2'},
        P3: {type: 'net', value: 'P3'},
        P4: {type: 'net', value: 'P4'},
        P5: {type: 'net', value: 'P5'},
        P6: {type: 'net', value: 'P6'},
        P7: {type: 'net', value: 'P7'},
        P8: {type: 'net', value: 'P8'},
        P9: {type: 'net', value: 'P9'},
        P10: {type: 'net', value: 'P10'},
        P11: {type: 'net', value: 'P11'},
        P12: {type: 'net', value: 'P12'},
        P13: {type: 'net', value: 'P13'},
        P14: {type: 'net', value: 'P14'},
        P15: {type: 'net', value: 'P15'},
        P16: {type: 'net', value: 'P16'},
        P17: {type: 'net', value: 'P17'},
        P18: {type: 'net', value: 'P18'},
        P19: {type: 'net', value: 'P19'},
        P20: {type: 'net', value: 'P20'},
        P21: {type: 'net', value: 'P21'},
        P22: {type: 'net', value: 'P22'},
        P23: {type: 'net', value: 'P23'},
        P24: {type: 'net', value: 'P24'},
        P25: {type: 'net', value: 'P25'},
        P26: {type: 'net', value: 'P26'},
        P27: {type: 'net', value: 'P27'},
        P28: {type: 'net', value: 'P28'},
        P29: {type: 'net', value: 'P29'},
        P30: {type: 'net', value: 'P30'},
        P31: {type: 'net', value: 'P31'},
        P32: {type: 'net', value: 'P32'},
        P33: {type: 'net', value: 'P33'},
        P34: {type: 'net', value: 'P34'},
        P35: {type: 'net', value: 'P35'},
        P36: {type: 'net', value: 'P36'},
        P37: {type: 'net', value: 'P37'},
        P38: {type: 'net', value: 'P38'},
        P39: {type: 'net', value: 'P39'},
        P40: {type: 'net', value: 'P40'}
    },
    body: p => {
        const header = `
            (layer F.Cu) (tedit 5B307E4C)
            ${p.at /* parametric position */}
    
            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        
            ${''/* component outline */}
            (fp_line (start -${outlineX} ${outlineY}) (end ${outlineX} ${outlineY}) (layer F.SilkS) (width 0.15))
            (fp_line (start ${outlineX} ${outlineY}) (end ${outlineX} -${outlineY}) (layer F.SilkS) (width 0.15))
            (fp_line (start ${outlineX} -${outlineY}) (end -${outlineX} -${outlineY}) (layer F.SilkS) (width 0.15))
            (fp_line (start -${outlineX} -${outlineY}) (end -${outlineX} ${outlineY}) (layer F.SilkS) (width 0.15))
        `;
    
        function pinOutput(pos, pinNumber, rowIndex, pinObj) {
            const sign = pos ? '' : '-';
            return `
                (pad ${pinNumber} thru_hole circle (at ${pinX(rowIndex)} ${sign}${pinsY} 0) (size ${pinPadSize} ${pinPadSize}) (drill ${pinHoleSize}) (layers *.Cu *.SilkS *.Mask) ${pinObj})
                (fp_text user P${pinNumber} (at ${pinX(rowIndex)} ${sign}${labelY} ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
            `;
        }

        function pins(down) {
            return `                
                ${''/* and now the actual pins */}
                ${pinOutput(down, 1, 0, p.P1)}
                ${pinOutput(down, 2, 1, p.P2)}
                ${pinOutput(down, 3, 2, p.P3)}
                ${pinOutput(down, 4, 3, p.P4)}
                ${pinOutput(down, 5, 4, p.P5)}
                ${pinOutput(down, 6, 5, p.P6)}
                ${pinOutput(down, 7, 6, p.P7)}
                ${pinOutput(down, 8, 7, p.P8)}
                ${pinOutput(down, 9, 8, p.P9)}
                ${pinOutput(down, 10, 9, p.P10)}
                ${pinOutput(down, 11, 10, p.P11)}
                ${pinOutput(down, 12, 11, p.P12)}
                ${pinOutput(down, 13, 12, p.P13)}
                ${pinOutput(down, 14, 13, p.P14)}
                ${pinOutput(down, 15, 14, p.P15)}
                ${pinOutput(down, 16, 15, p.P16)}
                ${pinOutput(down, 17, 16, p.P17)}
                ${pinOutput(down, 18, 17, p.P18)}
                ${pinOutput(down, 19, 18, p.P19)}
                ${pinOutput(down, 20, 19, p.P20)}

                ${pinOutput(!down, 21, 0, p.P21)}
                ${pinOutput(!down, 22, 1, p.P22)}
                ${pinOutput(!down, 23, 2, p.P23)}
                ${pinOutput(!down, 24, 3, p.P24)}
                ${pinOutput(!down, 25, 4, p.P25)}
                ${pinOutput(!down, 26, 5, p.P26)}
                ${pinOutput(!down, 27, 6, p.P27)}
                ${pinOutput(!down, 28, 7, p.P28)}
                ${pinOutput(!down, 29, 8, p.P29)}
                ${pinOutput(!down, 30, 9, p.P30)}
                ${pinOutput(!down, 31, 10, p.P31)}
                ${pinOutput(!down, 32, 11, p.P32)}
                ${pinOutput(!down, 33, 12, p.P33)}
                ${pinOutput(!down, 34, 13, p.P34)}
                ${pinOutput(!down, 35, 14, p.P35)}
                ${pinOutput(!down, 36, 15, p.P36)}
                ${pinOutput(!down, 37, 16, p.P37)}
                ${pinOutput(!down, 38, 17, p.P38)}
                ${pinOutput(!down, 39, 18, p.P39)}
                ${pinOutput(!down, 40, 19, p.P40)}
            `;
        }      
      
        const result = `
            (module Blackpill ${header}
            ${pins(p.orientation == 'down')}
            )
        `;
        return result;
    }
}