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


  
          