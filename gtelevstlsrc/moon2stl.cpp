// test code from: http://www.gdal.org/gdal_tutorial.html

#include "gdal_priv.h"
#include "cpl_conv.h" // for CPLMalloc()
#include <iostream>
#include <string>
#include <fstream>
#include "LatLng.h"
#include "Vector.h"
#include "STLWriter.h"
#include <vector>

//g++ -I/usr/include/gdal moon2stl.cpp -lgdal -o moon2stl -std=c++11 LatLng.cpp Vector.cpp STLWriter.cpp

using namespace std;

string currentTile = "none";
ifstream file;

GDALDataset  *poDataset;
GDALRasterBand  *poBand;

//For choosing which 960x960 tile to choose from for Mars
string getTile(int xindex, int yindex){
  string file = "tiles/ulcn2005_lpo_dd0_";
  file.append(to_string(yindex/960+1));
  file.append("_");
  file.append(to_string(xindex/960+1));
  file.append(".tif");
  return file;
}

float getIndexElevation(int xindex, int yindex){
  if(currentTile!=getTile(xindex,yindex)){
    //open new file
    currentTile = getTile(xindex,yindex);
    poDataset = (GDALDataset *) GDALOpen( currentTile.c_str(), GA_ReadOnly );
    poBand = poDataset->GetRasterBand( 1 );
  }

  double adfPixel[2];

  int iPixelToQuery = xindex-xindex/960*960;
  int iLineToQuery  = yindex-yindex/960*960;

  if( GDALRasterIO( poBand, GF_Read, iPixelToQuery, iLineToQuery, 1, 1, adfPixel, 1, 1, GDT_CFloat64, 0, 0) == CE_None ){
      CPLString osValue;
      return (float)adfPixel[0];
  }

  return 0;
}

float getElevation(float lat, float lng){
  lat = 90-lat;
  lng = lng+180;
  float point[4];           //Order: NW, NE, SW, SE
  for(int y = 0; y<2; y++){
    for(int x = 0; x<2; x++){
      point[x+y*2] = getIndexElevation( floor(lng/.0625)+x, floor(lat/.0625)+y );
    }
  }

  //TODO: Interpolate

  return point[0];
}


//Arguments:
//swlat,swlng,selat,selng,nwlat,nwlng,width,height,scale
int main(int argc, char **argv){
  LatLng sw(atof(argv[1]),atof(argv[2]));
  LatLng se(atof(argv[3]),atof(argv[4]));
  LatLng nw(atof(argv[5]),atof(argv[6]));
  int width = atoi(argv[7]);
  int height = atoi(argv[8]);
  float scale = atof(argv[9])/1895;

  clog << "Width: " << width << ", Height: "<<height<<"\n";

  GDALRegister_GTiff();   //load GeoTiff driver

  //TODO: Check division by height and width (elevationgetter.js)
  Vector incx = se.toCartesian().subtract(sw.toCartesian()).multiply(1.0/width);
  Vector incy = nw.toCartesian().subtract(sw.toCartesian()).multiply(1.0/height);
  //var incy = g.vectorMul(g.vectorSubtract(g.sphericalToCartesian(nw),g.sphericalToCartesian(sw)),1/options.height);
  Vector start = sw.toCartesian();

  vector<float> hList;
  hList.resize(width*height,0);

  float minElevation = 100000;

  for(int x = 0; x<width; x++){
    for(int y = 0; y<height; y++){
      LatLng position = incx.multiply(x).add(incy.multiply(y)).add(start).toSpherical();
      hList.at(y*width+x) = getElevation(position.lat,position.lng)*scale;
      if(hList.at(y*width+x)<minElevation){
        minElevation = hList.at(y*width+x);
      }
    }
  }

  for(int c = 0; c<width*height; c++){
    hList.at(c) = hList.at(c) - minElevation +2;
  }

  writeSTLfromArray(hList,width,height,0);

  return 0;
}
