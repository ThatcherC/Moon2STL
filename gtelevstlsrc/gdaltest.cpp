// test code from: http://www.gdal.org/gdal_tutorial.html

#include "gdal_priv.h"
#include "cpl_conv.h" // for CPLMalloc()
#include <iostream>
#include <string>
#include <fstream>

//g++ -I/usr/include/gdal gdaltest.cpp -lgdal -o gdaltest -std=c++11

using namespace std;

string currentTile = "none";
ifstream file;

GDALDataset  *poDataset;
GDALRasterBand  *poBand;

//For choosing which 960x960 tile to choose from for Mars
string getTile(int xindex, int yindex){
  string file = "../tiles/ulcn2005_lpo_dd0_";
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
  printf("Querying pixel %d on line %d\n",iPixelToQuery,iLineToQuery);

  if( GDALRasterIO( poBand, GF_Read, iPixelToQuery, iLineToQuery, 1, 1, adfPixel, 1, 1, GDT_CFloat64, 0, 0) == CE_None ){
      CPLString osValue;
      return (float)adfPixel[0];
  }

  return 0;
}

float getElevation(float lat, float lng){
  float point[4];           //Order: NW, NE, SW, SE
  for(int y = 0; y<2; y++){
    for(int x = 0; x<2; x++){
      point[x+y*2] = getIndexElevation( floor(lng/.0625)+x, floor(lat/.0625)+y );
    }
  }

  //TODO: Interpolate

  return point[0];
}

int main(){
    GDALRegister_GTiff();
    cout <<getElevation(80,27);
    return 0;
}
