function plateTestOutline_extrude_3_5_outline_fn(){
    return new CSG.Path2D([[0,-34],[0,0]]).appendPoint([30,0]).appendPoint([30,-34]).appendPoint([0,-34]).close().innerToCAG()
.subtract(
    new CSG.Path2D([[8,-24],[8,-10]]).appendPoint([13,-10]).appendPoint([13,-10.25]).appendPoint([17,-10.25]).appendPoint([17,-10]).appendPoint([22,-10]).appendPoint([22,-24]).appendPoint([17,-24]).appendPoint([17,-23.75]).appendPoint([13,-23.75]).appendPoint([13,-24]).appendPoint([8,-24]).close().innerToCAG()
).extrude({ offset: [0, 0, 3.5] });
}




                function plateTest_case_fn() {
                    

                // creating part 0 of case plateTest
                let plateTest__part_0 = plateTestOutline_extrude_3_5_outline_fn();

                // make sure that rotations are relative
                let plateTest__part_0_bounds = plateTest__part_0.getBounds();
                let plateTest__part_0_x = plateTest__part_0_bounds[0].x + (plateTest__part_0_bounds[1].x - plateTest__part_0_bounds[0].x) / 2
                let plateTest__part_0_y = plateTest__part_0_bounds[0].y + (plateTest__part_0_bounds[1].y - plateTest__part_0_bounds[0].y) / 2
                plateTest__part_0 = translate([-plateTest__part_0_x, -plateTest__part_0_y, 0], plateTest__part_0);
                plateTest__part_0 = rotate([0,0,0], plateTest__part_0);
                plateTest__part_0 = translate([plateTest__part_0_x, plateTest__part_0_y, 0], plateTest__part_0);

                plateTest__part_0 = translate([0,0,0], plateTest__part_0);
                let result = plateTest__part_0;
                
            
                    return result;
                }
            
            
        
            function main() {
                return plateTest_case_fn();
            }

        