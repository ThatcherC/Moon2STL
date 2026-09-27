# Moon2STL
Produces STL files from GeoTIFF elevation maps

Requirements: `libgdal-dev`. Easy to install on Ubuntu with:
```
$ sudo apt install libgdal-dev
```

### Data

The digital elevation models included in this repo are from the USGS ULCN 2005 dataset:

```
Archinal, B.A., Rosiek, M.R., Kirk, R.L., and Redding, B.L., 2006, The Unified Lunar Control
Network 2005: U.S. Geological Survey Open-File Report 2006-1367
[http://pubs.usgs.gov/of/2006/1367/ ].
```

#### To-Do List

- [x] Put walls on the STLs
- [x] Actually place markers
- [x] Add description ~~top right~~ bottom
- [ ] Correct vertical scale when horizontal scale changes
- [ ] Remove striations from models - probably with interpolation
- [ ] Make a set of markers of interesting features
- [ ] Add URL and footer to setUpPage.js
