module.exports = {
    params: {
        designator: 'MXHole',
        side: 'F'
    },
    body: p => `
        (module lib:MXHole_headers (layer F.Cu) (tedit 5E1ADAC2)
        ${p.at /* parametric position */} 

        ${'' /* footprint reference */}        
        ${'' /*(fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))*/}
        ${'' /*(fp_text value MXHole (at 0 -7.3) (layer F.Fab) (effects (font (size 1 1) (thickness 0.15))))*/}

        ${'' /* pins */}
        (pad 1 thru_hole rect (at 1.6 9.8 ${p.r+270}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask))
        )
        `
}