// idc box header 20
// Params

// unit is mm
const pinPitch = 2.54;
const boxHeight = 9.1;
const boxWidth = 33;
const outlineX = boxWidth / 2;
const outlineY = boxHeight / 2;
const pinsY = pinPitch / 2;
const pinsInARow = 10;
const firstPinX = -(((pinsInARow / 2) - 0.5) * pinPitch);
function pinX(indexInRow) {
    return firstPinX + (indexInRow * pinPitch);
}
const pinPadSize = 1.7526;
const pinHoleSize = 1.0922;

module.exports = {
    params: {
      designator: 'BH',
      orientation: 'down',
      H1: {type: 'net', value: 'H1'},
      H2: {type: 'net', value: 'H2'},
      H3: {type: 'net', value: 'H3'},
      H4: {type: 'net', value: 'H4'},
      H5: {type: 'net', value: 'H5'},
      H6: {type: 'net', value: 'H6'},
      H7: {type: 'net', value: 'H7'},
      H8: {type: 'net', value: 'H8'},
      H9: {type: 'net', value: 'H9'},
      H10: {type: 'net', value: 'H10'},
      H11: {type: 'net', value: 'H11'},
      H12: {type: 'net', value: 'H12'},
      H13: {type: 'net', value: 'H13'},
      H14: {type: 'net', value: 'H14'},
      H15: {type: 'net', value: 'H15'},
      H16: {type: 'net', value: 'H16'},
      H17: {type: 'net', value: 'H17'},
      H18: {type: 'net', value: 'H18'},
      H19: {type: 'net', value: 'H19'},
      H20: {type: 'net', value: 'H20'}
    },
    body: (p) => {
      const standard = `
        (module IdcBoxHeader (layer F.Cu) (tedit 5B307E4C)
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

      function pinOutput(sign, pinNumber, rowIndex, pinObj) {
        return `
          (pad ${pinNumber} thru_hole circle (at ${pinX(rowIndex)} ${sign}${pinsY} 0) (size ${pinPadSize} ${pinPadSize}) (drill ${pinHoleSize}) (layers *.Cu *.SilkS *.Mask) ${pinObj})
          (fp_text user ${pinObj.name} (at ${pinX(rowIndex)} ${sign}6 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        `;
      }

      function pins(def_neg, def_pos) {
        return `
          
          ${''/* and now the actual pins */}
          ${pinOutput(def_pos, 1, 0, p.H1)}
          ${pinOutput(def_pos, 2, 1, p.H2)}
          ${pinOutput(def_pos, 3, 2, p.H3)}
          ${pinOutput(def_pos, 4, 3, p.H4)}
          ${pinOutput(def_pos, 5, 4, p.H5)}
          ${pinOutput(def_pos, 6, 5, p.H6)}
          ${pinOutput(def_pos, 7, 6, p.H7)}
          ${pinOutput(def_pos, 8, 7, p.H8)}
          ${pinOutput(def_pos, 9, 8, p.H9)}
          ${pinOutput(def_pos, 10, 9, p.H10)}

          ${pinOutput(def_neg, 11, 0, p.H11)}
          ${pinOutput(def_neg, 12, 1, p.H12)}
          ${pinOutput(def_neg, 13, 2, p.H13)}
          ${pinOutput(def_neg, 14, 3, p.H14)}
          ${pinOutput(def_neg, 15, 4, p.H15)}
          ${pinOutput(def_neg, 16, 5, p.H16)}
          ${pinOutput(def_neg, 17, 6, p.H17)}
          ${pinOutput(def_neg, 18, 7, p.H18)}
          ${pinOutput(def_neg, 19, 8, p.H19)}
          ${pinOutput(def_neg, 20, 9, p.H20)}
        `
      }

      if(p.orientation == 'down') {
        return `
          ${standard}
          ${pins('-', '')})
          `
      } else {
        return `
          ${standard}
          ${pins('', '-')})
          `
      }
    }
  }