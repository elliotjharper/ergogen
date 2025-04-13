// ST32 blackpill basic
// Params
//  orientation: default is down
//    if down, power led will face the pcb???
//    if up, power led will face away from pcb???

// all these consts are provided as the value from origin 
// (eg. outline X is from center to one edge so that it can be used +/- to reach either edge)
// unit is mm
const pinPitch = 2.54;
const pinsY = (pinPitch * 7) / 2;
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
    'Z5', 'Z6', 'Z7', 'Z8', 'Z9', 'Z10', 'GP28', 'Z11', 'GP27', 'GP26', 'Z12', 'GP22', 'Z13', 'GP21', 'GP20', 'GP19', 'GP18', 'Z14', 'GP17', 'GP16'
];
const bottomRowPinKeys = [
    'GP0', 'GP1', 'Z1', 'GP2', 'GP3', 'GP4', 'GP5', 'Z2', 'GP6', 'GP7', 'GP8', 'GP9', 'Z3', 'GP10', 'GP11', 'GP12', 'GP13', 'Z4', 'GP14', 'GP15'
];
const unusablePinKeys = [
    'A11', 'A12', 'B2', 'R'
];

const pinOverrides = {
    'GP0':  'B12',
    'GP1':  'B13',
    'GP2':  'B14',
    'GP3':  'B15',
    'GP4':  'A8',
    'GP5':  'A9',
    'GP6':  'A10',
    'GP20': 'A4',
    'GP21': 'A5',
    'GP22': 'A6',
    'GP26': 'A7',
    'GP15': 'C13',
    'GP14': 'C14',
    'GP13': 'C15',
    'GP16': 'A0',
    'GP17': 'A1',
    'GP18': 'A2',
    'GP19': 'A3',
    'GP7':  'B4',
    'GP8':  'B5',
    'GP9':  'B6',
    'GP10': 'B7',
    'GP11': 'B8',
    'GP12': 'B9'
}

function screenedPinKey(pinKey) {
    return unusablePinKeys.includes(pinKey)
        ? `X${unusablePinKeys.indexOf(pinKey)}` 
        : pinKey;
}

function addParamPins(paramsObj, pinKeys) {
    for(let pinKey of pinKeys) {
        pinKey = screenedPinKey(pinKey);
        paramsObj[pinKey] = { type: 'net', value: pinOverrides[pinKey] ?? pinKey };
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

            pinKey = screenedPinKey(pinKey);

            return `
                (pad ${pinKey} thru_hole circle (at ${pinX(rowIndex)} ${sign}${pinsY} 0) (size ${pinPadSize} ${pinPadSize}) (drill ${pinHoleSize}) (layers *.Cu *.Mask) ${p[pinKey] ?? 'U1'})
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
            (module Pico ${header}
            ${pins(p.orientation == 'down')}
            )
        `;
        return result;
    }
}