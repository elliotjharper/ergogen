UNITS
- use units to define vars for layout (like key size and then a padded key size for pcb layout)

POINTS
- a point is the x,y co-ord of the center of a key (plus r for rotation)

ZONE
- a group of points is a zone. but this is defined in the following structure 
    `/points/zones/{section}/columns`
    `/points/zones/{section}/rows`

MATRIX
- a matrix is a table of columns and rows




DIMENSIONS
    https://hirosarts.com/blog/keycap-dimensions-guide-for-beginners/

Keycap profile of interest

cherry dimensions
    key center to center 19.05mm

cherry keycap
    1u          =   18
    1.25u       =   22.5
    1.5u        =   27
    1.75u       =   31.5
    2u          =   36
    6.25u       =   112.5

my keyboard measurements
    tab         =   1.5u
    cap         =   1.75u
    lShift      =   1.25u
    lCtrl       =   1.5u
    
    win         =   1.25u
    lAlt        =   1.25u
    space       =   6.25u
    rAlt        =   1.25u



LINKS
- https://flatfootfox.com/ergogen-part1-units-points/
- https://ergogen.ceoloide.com/
- https://www.youtube.com/watch?v=7UXsD7nSfDY


GOTCHA #1!
- ergogen is all about ortholiner where the vertical columns of keys are straight lines but adjacent columns maybe be vertically staggered matching your finger lengths
    -    ||
        ||||
        ||||
        |  |
- this is a problem as I am going conventional where the horizontal rows are straight lines but they stagger horizontally.
    - to make this work in ergo gen world I am just going to flip my cols and rows and do everything at 90 degrees and then declare `matrix.anchor.rotate: -90` to make it render where i expect

CONFUSING POINT #1!
- the way that ergogen procedurally renders layouts is essentially `for(col of cols) { for (row of rows) { } }` where the columns start at the left and progress to the right and rows start at the bottom of a column and progress upwards


  

Working on QMK firmware now.
-------
- using this guide: https://docs.qmk.fm/newbs_getting_started

- installed QMK cli using QMK MSYS (solution for windows)

- did `qmk setup` to do first time setup
    - accepted the default env path of `%userprofile%/qmk_firmware`.
    - this is where the qmk github is cloned to, and where all output is stored

- did `qmk list-keyboards` to list the known keyboards
    - ended up going onto the github trawling through the list of keebs and picked a nice simple one to test my qmk setup works
- did `qmk compile -kb keychron/q0 -km default` to compile qmk for this keeb from the repo:
    - https://github.com/qmk/qmk_firmware/tree/master/keyboards/keychron/q0/base

- did `qmk config user.keymap=elliotjharper` to set my default keymap name
    - this forgoes the need to specify it in future commands

- did `qmk config user.keyboard=split_tkl` to set the default keyboard

- did `qmk new-keyboard -kb split_tkl` to establish a new kb
    - chose `tkl_iso[60]` as the template
    - chose `no` for using dev board?
    - chose `RP2040[21]` for the board

- did `qmk new-keymap`
    - this leverages the `user.keyboard` and `user.keymap` to create the new keymap named `elliotjharper` for kb `split_tkl`
    - this created the new keymap for this keyboard at the path `%userprofile%/qmk_firmware/keyboards/split_tkl/keymaps/elliotjharper`

- did `qmk compile` to try compiling firmware from my new keymap for my new kb
    - also uses the env vars to avoid having to specify it all
    - it didn't build succesfully... :\
    - will come back to this, will try the one key pi pico demo first

- ran through the one key pi pico
    - https://learn.adafruit.com/using-qmk-on-rp2040-microcontrollers/rp2040-one-key-keyboard
    - just tried compiling the one key keyboard
        - `qmk compile -kb handwired/onekey/rp2040 -km default`
        - this output to `%userprofile%/qmk-firmware/.build/handwired_onekey_rp2040_default.uf2`
        - i then plugged the pi pico in whilst holding the boot button to put it in uf2 flash mode
        - i then copied the .uf2 file onto the pi pico which was mounted as a usb drive and it flashed and worked

- coming back to working on the `split_tkl` keyboard
    - in `~/keyboards/split_tkl/keyboard.json` the matrix was addressing pins like `D1` instead of `GP1`
    - tried dumbing the `keymap.c` file down to just one key, did `Layout(KC_ESC)`, got new error, discovered that the keyobard.json file also contains a `layout` section that identifies parts of the matrix, realised that the macro invoked in the `keymap.c` must match the name of the layout in the `keyboard.json` file.
    - reduced the `keymap.c` to use a macro called `LAYOUT(KC_A)` and updated `keyboard.json` to be called layout and only have one entry for [0,0] and compiled and successfully flashed it!

- TO COMPILE NEW VERSION OF FIRMWARE
    - copy from this repo `/split-tkl/qmk/keyboards/split_tkl/` into the `%userprofile%/qmk-firmware/keyboards/split_tkl/`
    - open `qmk msys`
    - run `qmk compile -kb split_tkl -km elliotjharper`

- coming back to write how it went
    - learnt that qmk has levels of inheritance, there is a base keyboard labelled quantum, for each part of the compilation your file takes precedence but inherits from the quantum base. Mainly this was interesting to learn why my keyboard file could be so barebones as any file i do not supply will come from quantum.
    - the keyboard.json file is like the declaration of keys and labels the layout macro, then the keymap.c can set the keycodes
    - GOTCHA: I was trying to write the keyboard.json and the keymap.c in a way where the file would be the most readable. This actually lead me to write the keyboard.json in a column at a time, however that created an array like [c1r1, c1r2, c2r1, c2r2] but the keymap.c is always written in rows at a time like [c1r1, c2r1, c1r2, c2r2] and this meant that the keycodes I was setting were getting mapped wrong (compare those two arrays)
    - I resolved that gotcha and then was all good ^

- PI PICO ALSO HAS PINS THAT YOU CANNOT USE
    - GP0-GP22 fine
    - GP23, GP24, GP25 have conflicts with other parts
    - GP26, GP27, GP28 all good.
    - no more.....

- need to sort the cases out now!
    - blackpill outline:    w53mm   h20.5mm
    - idc header outline:   w33mm   h9mm
    - solder / diode back depth requirement 3mm
    - have gone with a further 2mm behind that for some rigidity
    - board outer spacing offset 1mm
    - board outer wall thickness offset 1.5mm
    - hole r = 2.2 works for the m2 screws to self tap


- controller sizes
    - row spacings are inclusive (6 pins = one row in pin 1, other row in pin 6)
    - pi pico = 8
    - blackpill = 7
