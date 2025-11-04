// Gateron mx33 low profile keyswitch
// Nets
//    from: corresponds to pin 1
//    to: corresponds to pin 2
// Params
//    reverse: default is false
//      if true, will flip the footprint such that the pcb can be reversible
//    keycaps: default is false
//      if true, will add choc sized keycap box around the footprint
//

const keycap = `
    ${'' /* keycap marks */}
    (fp_line (start -9.5 -9.5) (end 9.5 -9.5) (layer Dwgs.User) (width 0.15))
    (fp_line (start 9.5 -9.5) (end 9.5 9.5) (layer Dwgs.User) (width 0.15))
    (fp_line (start 9.5 9.5) (end -9.5 9.5) (layer Dwgs.User) (width 0.15))
    (fp_line (start -9.5 9.5) (end -9.5 -9.5) (layer Dwgs.User) (width 0.15))
`;

function buildStandard(p) {
    return `
        (module GateronMX33 (layer F.Cu) (tedit 5DD4F656)
        ${p.at /* parametric position */}

        ${'' /* footprint reference */}
        (fp_text reference "${p.from.name}" (at 8 0 270) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

        ${'' /* corner marks */}
        (fp_line (start -7 -6) (end -7 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -7 7) (end -6 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -6 -7) (end -7 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start -7 7) (end -7 6) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 6) (end 7 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 -7) (end 6 -7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 6 7) (end 7 7) (layer Dwgs.User) (width 0.15))
        (fp_line (start 7 -7) (end 7 -6) (layer Dwgs.User) (width 0.15))

        ${'' /* middle shaft */}
        (pad "" np_thru_hole circle (at 0 0) (size 5.25 5.25) (drill 5.25) (layers *.Cu *.Mask))
    `;
}

function pins(p, highPinSign, sidePinSign) {
    const result = `
        ${'' /* pins (pin 1 = highPign means further vertically away) */}
        (pad 1 thru_hole circle (at ${highPinSign}2.60 -5.75) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) ${p.from})
        (pad 2 thru_hole circle (at ${sidePinSign}4.40 -4.70) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) ${p.to})
    `;

    return result;
}

function smdDiode(p, highPinSign, sidePinSign) {
    const smdYPos = 6;
    const textYPos = 8;
    const textTopYPos = textYPos - 0.4;
    const textBottomYPos = textYPos + 0.4;

    const result = `
        ${'' /* smd diode......TODO: FIGURE OUT WHAT SHOULD BE CONNECTED TO FROM AND WHAT SHOULD BE CONNECTED TO TO! */}
        (pad 1 smd rect (at ${highPinSign}1.65 ${smdYPos} ${p.r}) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) ${p.from})
        (pad 2 smd rect (at ${sidePinSign}1.65 ${smdYPos} ${p.r}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) ${p.to})
        (pad 1 smd rect (at ${highPinSign}1.65 ${smdYPos} ${p.r}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) ${p.from})
        (pad 2 smd rect (at ${sidePinSign}1.65 ${smdYPos} ${p.r}) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) ${p.to})

        ${'' /* diode symbols (front silkscreen) */}
        (fp_line (start 0.25 ${textYPos}) (end 0.75 ${textYPos}) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 ${textTopYPos}) (end -0.35 ${textYPos}) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 ${textBottomYPos}) (end 0.25 ${textTopYPos}) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 ${textYPos}) (end 0.25 ${textBottomYPos}) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 ${textYPos}) (end -0.35 ${textTopYPos}) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 ${textYPos}) (end -0.35 ${textBottomYPos}) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.75 ${textYPos}) (end -0.35 ${textYPos}) (layer F.SilkS) (width 0.1))

        ${'' /* diode symbols (back silkscreen) */}
        (fp_line (start 0.25 ${textYPos}) (end 0.75 ${textYPos}) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 ${textTopYPos}) (end -0.35 ${textYPos}) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 ${textBottomYPos}) (end 0.25 ${textTopYPos}) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 ${textYPos}) (end 0.25 ${textBottomYPos}) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 ${textYPos}) (end -0.35 ${textTopYPos}) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 ${textYPos}) (end -0.35 ${textBottomYPos}) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.75 ${textYPos}) (end -0.35 ${textYPos}) (layer B.SilkS) (width 0.1))            
    `;

    return result;
}

module.exports = {
    params: {
        designator: 'S',
        mirror: false,
        keycaps: false,
        smdDiode: false,
        smdDiodeFlip: false,
        from: undefined,
        to: undefined,
    },
    body: (p) => {
        const standard = buildStandard(p);

        const highPinSign = p.mirror ? '' : '-';
        const sidePinSign = p.mirror ? '-' : '';

        return `
            ${standard}
            ${p.keycaps ? keycap : ''}
            ${p.smdDiode ? smdDiode(p, highPinSign, sidePinSign) : ''}
            ${pins(p, highPinSign, sidePinSign)})
        `;
    },
};
