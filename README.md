
# Wave Function Collapse

[Wave Function Collapse](https://github.com/mxgmn/WaveFunctionCollapse) is a fundamental concept in quantum mechanics that describes the process by which a quantum system transitions from a state of superposition to a definite state upon measurement.  

The files included are for the website I designed to apply said function and generate an image.  
These are the core mechanics at play:  
- Find cells with the lowest entropy and randomly pick one
- Randomly select and place one of its types  
- 'Collapse' the cell's neighbors, thus lowering their entropy/different types they can turn into
- Repeat the cycle until all of the cells are collapsed and placed
  
Finally, once completed, an image is generated  
Each node has up to 15 tiles to pick from and each tile is drawn using P5.js


# Tasklist

- [x] Make directory dialog only show when 'Save Frames' is toggled, and untoggle 'Save Frames' if cancelled
- [ ] Add weighted random selection of pieces
- [ ] Replace arraylists of data with objects for better descriptors
