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

module.exports = {
    params: {
        designator: "S",
        reverse: false,
        keycaps: false,
        smdDiode: false,
        from: undefined,
        to: undefined,
    },
    body: (p) => {
        const standard = `
      (module MX (layer F.Cu) (tedit 5DD4F656)
      ${p.at /* parametric position */}

      ${"" /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

      ${"" /* corner marks */}
      (fp_line (start -7 -6) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -6 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -6 -7) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -7 6) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 6) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 6 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 6 7) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 7 -6) (layer Dwgs.User) (width 0.15))
    
      ${"" /* middle shaft */}
      (pad "" np_thru_hole circle (at 0 0) (size 5.25 5.25) (drill 5.25) (layers *.Cu *.Mask))
      `;
        const keycap = `
      ${"" /* keycap marks */}
      (fp_line (start -9.5 -9.5) (end 9.5 -9.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start 9.5 -9.5) (end 9.5 9.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start 9.5 9.5) (end -9.5 9.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start -9.5 9.5) (end -9.5 -9.5) (layer Dwgs.User) (width 0.15))
      `;
        function pins(def_neg, def_pos, def_side) {
            return `
        ${"" /* pins (pad 1 = further vertically away) */}
        (pad 1 thru_hole circle (at ${def_pos}2.60 -5.75) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) ${p.from})
        (pad 2 thru_hole circle (at ${def_neg}4.40 -4.70) (size 2.286 2.286) (drill 1.4986) (layers *.Cu *.Mask) ${p.to})
      `;
        }
        if (p.reverse) {
            return `
        ${standard}
        ${p.keycaps ? keycap : ""}
        ${pins("-", "", "B")}
        ${pins("", "-", "F")})
        `;
        } else {
            return `
        ${standard}
        ${p.keycaps ? keycap : ""}
        ${pins("-", "", "B")})
        `;
        }
    },
};
