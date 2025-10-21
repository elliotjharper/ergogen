// ST32 blackpill basic
// Params
//  orientation: default is down
//    if down, power led will face the pcb???
//    if up, power led will face away from pcb???

// all these consts are provided as the value from origin 
// (eg. outline X is from center to one edge so that it can be used +/- to reach either edge)
// unit is mm
const pinPitch = 2.54;
const pinsY = (pinPitch * 6) / 2;
const labelY = 5;
const pinsInARow = 20;
const firstPinX = -(((pinsInARow / 2) - 0.5) * pinPitch);
function pinX(indexInRow) {
    return firstPinX + (indexInRow * pinPitch);
}
const outlineX = pinX(pinsInARow);
const outlineY = 20.6 / 2;
const pinPadSize = 1.7526;
const pinHoleSize = 1.0922;

/**
 * Unusable pins: https://docs.qmk.fm/platformdev_blackpill_f4x1#pin-usage-limitations
 * A11, A12
 */

const topRowPinKeys = [
    't5V', 'tG', 't3V3', 'B10', 'B2', 'B1', 'B0', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'R', 'C15', 'C14', 'C13', 'VBAT'
];
const bottomRowPinKeys = [
    'B12', 'B13', 'B14', 'B15', 'A8', 'A9', 'A10', 'A11', 'A12', 'A15', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'b5V', 'bG', 'b3V3'
];
const unusablePinKeys = [
    'A11', 'A12', 'B2', 'R'
];

function screenedPinKey(pinKey) {
    return unusablePinKeys.includes(pinKey)
        ? `X${unusablePinKeys.indexOf(pinKey)}` 
        : pinKey;
}

function addParamPins(paramsObj, pinKeys) {
    for(let pinKey of pinKeys) {
        pinKey = screenedPinKey(pinKey);
        paramsObj[pinKey] = { type: 'net', value: pinKey };
    }
}

function buildParams() {
    const paramsObj = {
        designator: 'MCU',
        orientation: 'down',
        drawOutline: true,
        drawPinLabels: true
    };

    addParamPins(paramsObj, topRowPinKeys);
    addParamPins(paramsObj, bottomRowPinKeys);

    return paramsObj;
}

module.exports = {
    params: buildParams(),
    body: p => {
        let header = `
            (layer F.Cu) (tedit 5B307E4C)
            ${p.at /* parametric position */}
    
            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))
        `;
            
        if(p.drawOutline) {
            /* component outline */
            header += `
                (fp_line (start -${outlineX} ${outlineY}) (end ${outlineX} ${outlineY}) (layer F.SilkS) (width 0.15))
                (fp_line (start ${outlineX} ${outlineY}) (end ${outlineX} -${outlineY}) (layer F.SilkS) (width 0.15))
                (fp_line (start ${outlineX} -${outlineY}) (end -${outlineX} -${outlineY}) (layer F.SilkS) (width 0.15))
                (fp_line (start -${outlineX} -${outlineY}) (end -${outlineX} ${outlineY}) (layer F.SilkS) (width 0.15))
            `;
        }

        function pinOutput(pos, rowIndex, pinKey) {
            const sign = pos ? '' : '-';

            pinKey = screenedPinKey(pinKey);

            let output = `
                (pad ${pinKey} thru_hole circle (at ${pinX(rowIndex)} ${sign}${pinsY} 0) (size ${pinPadSize} ${pinPadSize}) (drill ${pinHoleSize}) (layers *.Cu *.Mask) ${p[pinKey] ?? 'U1'})
            `;

            if(p.drawPinLabels) {
                output += `
                    (fp_text user ${pinKey} (at ${pinX(rowIndex)} ${sign}${labelY} ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
                `
            }

            return output;
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