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

const topRowPinKeys = [
    'P1', 'P2', 'P3', 'B10', 'B2', 'B1', 'B0', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'P16', 'C15', 'C14', 'C13', 'VBAT'
];
const bottomRowPinKeys = [
    'B12', 'B13', 'B14', 'B15', 'A8', 'A9', 'A10', 'A11', 'A12', 'A15', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'P38', 'P39', 'P40'
];

function addParamPins(paramsObj, pinKeys) {
    for(const pinKey of pinKeys) {
        paramsObj[pinKey] = { type: 'net', value: pinKey };
    }
}
function buildParams() {
    const paramsObj = {
        designator: 'MCU',
        orientation: 'down'
    };

    addParamPins(paramsObj, topRowPinKeys);
    addParamPins(paramsObj, bottomRowPinKeys);

    return paramsObj;
}

module.exports = {
    params: buildParams(),
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

        function pinOutput(pos, rowIndex, pinKey) {
            const sign = pos ? '' : '-';
            return `
                (pad ${pinKey} thru_hole circle (at ${pinX(rowIndex)} ${sign}${pinsY} 0) (size ${pinPadSize} ${pinPadSize}) (drill ${pinHoleSize}) (layers *.Cu *.SilkS *.Mask) ${p[pinKey]})
                (fp_text user ${pinKey} (at ${pinX(rowIndex)} ${sign}${labelY} ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
            `;
        }

        function pinRow(down, rowPinKeys) {
            return rowPinKeys
                .map((pinKey, rowIndex) => {
                    return pinOutput(down, rowIndex, pinKey);
                })
                .join('\n');            
        }

        function pins(down) {
            return `                
                ${pinRow(!down, topRowPinKeys)}
                ${pinRow(down, bottomRowPinKeys)}
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