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

| Keeb Half | Matrix Pin | Blackpill | PiPin | Pi     | 
| -         | -          | -         | -     | -      | 
| Left      | C1         | B12       | L1    | GP0    | 
| Left      | C2         | B13       | L2    | GP1    | 
| Left      | C3         | B14       | L4    | GP2    | 
| Left      | C4         | B15       | L5    | GP3    | 
| Left      | C5         | A8        | L6    | GP4    | 
| Left      | C6         | A9        | L7    | GP5    | 
| Left      | C7         | A10       | L9    | GP6    | 
| Right     | C8         | A4        | R15   | GP20   | 
| Right     | C9         | A5        | R14   | GP21   | 
| Right     | C10        | A6        | R12   | GP22   | 
| Right     | C11        | A7        | R10   | GP26   | 
| Right     | C12        | C13       | L20   | GP15   | 
| Right     | C13        | C14       | L19   | GP14   | 
| Right     | C14        | C15       | L17   | GP13   | 
| Right     | C15        | A0        | R20   | GP16   | 
| Right     | C16        | A1        | R19   | GP17   | 
| Right     | C17        | A2        | R17   | GP18   | 
| Right     | C18        | A3        | R16   | GP19   | 
| Row       | R1         | B4        | L10   | GP7    | 
| Row       | R2         | B5        | L11   | GP8    | 
| Row       | R3         | B6        | L12   | GP9    | 
| Row       | R4         | B7        | L14   | GP10   | 
| Row       | R5         | B8        | L15   | GP11   | 
| Row       | R6         | B9        | L16   | GP12   | 


