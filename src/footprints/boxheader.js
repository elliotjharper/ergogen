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
      P20: {type: 'net', value: 'P20'}
    },
    body: p => {
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

      function labels(def_neg, def_pos) {
        return `
          ${''/* pin names */}
          (fp_text user RAW (at -13.97 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user GND (at -11.43 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user RST (at -8.89 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user VCC (at -6.35 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P21 (at -3.81 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P20 (at -1.27 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P19 (at 1.27 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P18 (at 3.81 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P15 (at 6.35 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P14 (at 8.89 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P16 (at 11.43 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P10 (at 13.97 ${def_pos}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          
          (fp_text user P01 (at -13.97 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P00 (at -11.43 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user GND (at -8.89 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user GND (at -6.35 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P02 (at -3.81 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P03 (at -1.27 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P04 (at 1.27 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P05 (at 3.81 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P06 (at 6.35 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P07 (at 8.89 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P08 (at 11.43 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
          (fp_text user P09 (at 13.97 ${def_neg}4.8 ${p.r + 90}) (layer F.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15))))
        `;
      }

      function pins(def_neg, def_pos) {
        return `
          
          ${''/* and now the actual pins */}
          (pad 1 thru_hole rect (at ${pinX(0)} ${def_pos}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P1})
          (pad 2 thru_hole circle (at ${pinX(1)} ${def_pos}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P2})
          (pad 3 thru_hole circle (at ${pinX(2)} ${def_pos}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P3})
          (pad 4 thru_hole circle (at ${pinX(3)} ${def_pos}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P4})
          (pad 5 thru_hole circle (at ${pinX(4)} ${def_pos}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P5})
          (pad 6 thru_hole circle (at ${pinX(5)} ${def_pos}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P6})
          (pad 7 thru_hole circle (at ${pinX(6)} ${def_pos}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P7})
          (pad 8 thru_hole circle (at ${pinX(7)} ${def_pos}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P8})
          (pad 9 thru_hole circle (at ${pinX(8)} ${def_pos}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P9})
          (pad 10 thru_hole circle (at ${pinX(9)} ${def_pos}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P10})
          
          (pad 11 thru_hole rect (at ${pinX(0)} ${def_neg}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P11})
          (pad 12 thru_hole circle (at ${pinX(1)} ${def_neg}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P12})
          (pad 13 thru_hole circle (at ${pinX(2)} ${def_neg}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P13})
          (pad 14 thru_hole circle (at ${pinX(3)} ${def_neg}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P14})
          (pad 15 thru_hole circle (at ${pinX(4)} ${def_neg}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P15})
          (pad 16 thru_hole circle (at ${pinX(5)} ${def_neg}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P16})
          (pad 17 thru_hole circle (at ${pinX(6)} ${def_neg}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P17})
          (pad 18 thru_hole circle (at ${pinX(7)} ${def_neg}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P18})
          (pad 19 thru_hole circle (at ${pinX(8)} ${def_neg}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P19})
          (pad 20 thru_hole circle (at ${pinX(9)} ${def_neg}${pinsY} 0) (size 1.7526 1.7526) (drill 1.0922) (layers *.Cu *.SilkS *.Mask) ${p.P20})
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