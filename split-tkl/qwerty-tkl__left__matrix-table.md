# Left Keeb Switch Matrix

| #  | C1    | C2  | C3 | C4  | C5 | C6    | C7 | 
| -  | -     | -   | -  | -   | -  | -     | -  |
| R1 | Esc   | F1  | F2 | F3  | F4 | F5    |    |
| R2 | `     | 1   | 2  | 3   | 4  | 5     | 6  |
| R3 | Tab   | q   | w  | e   | r  | t     | y  |
| R4 |       | a   | s  | d   | f  | g     | h  |
| R5 | Shift | \   | z  | x   | c  | v     | b  |
| R6 | Ctrl  | win |    | alt |    | space |    |

# Right Keeb Switch Matrix

| #  | C8 | C9    | C10 | C11 | C12 | C13 | C14  | C15   | C16  | C17  | C18  |
| -  | -  | -     | -   | -   | -   | -   | -    | -     | -    | -    | -    |
| R1 | F5 | F6    | F7  | F8  | F9  | F10 | F11  | F12   | prnt | scrl | paus |
| R2 | 6  | 7     | 8   | 9   | 0   | -   | +    | bksp  | ins  | hom  | pgu  |
| R3 | y  | u     | i   | o   | p   | {   | }    | ent   | del  | end  | pgd  |
| R4 | g  | h     | j   | k   | l   | ;   | @    | #     |      |      |      |
| R5 | b  | n     | m   | ,   | .   | /   |      | rshif |      | u    |      |
| R6 |    | space |     |     | alt | fn  | rclk | rctrl | l    | d    | r    |

# Blackpill -> Pi mapping

PiPin is me addressing the pins in a way that is translatable to the physical board
L1-19 or R1-19 where the usb is the top of the board and pins start with 1 at the top

| Keeb Half | Matrix Pin | Blackpill | Pi   |
| -         | -          | -         | -    |
| Left      | C1         | B12       | GP0  |
| Left      | C2         | B13       | GP1  |
| Left      | C3         | B14       | GP2  |
| Left      | C4         | B15       | GP3  |
| Left      | C5         | A8        | GP4  |
| Left      | C6         | A9        | GP5  |
| Left      | C7         | A10       | GP6  |
| Right     | C8         | A4        | GP7  |
| Right     | C9         | A5        | GP8  |
| Right     | C10        | A6        | GP9  |
| Right     | C11        | A7        | GP10 |
| Right     | C12        | C13       | GP11 |
| Right     | C13        | C14       | GP12 |
| Right     | C14        | C15       | GP13 |
| Right     | C15        | A0        | GP14 |
| Right     | C16        | A1        | GP15 |
| Right     | C17        | A2        | GP16 |
| Right     | C18        | A3        | GP17 |
| Row       | R1         | B4        | GP18 |
| Row       | R2         | B5        | GP19 |
| Row       | R3         | B6        | GP20 |
| Row       | R4         | B7        | GP21 |
| Row       | R5         | B8        | GP22 |
| Row       | R6         | B9        | GP26 |
