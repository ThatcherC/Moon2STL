// test code from: http://www.gdal.org/gdal_tutorial.html

#include "gdal_priv.h"
#include "cpl_conv.h" // for CPLMalloc()
#include <iostream>

using namespace std;

int main()
{
    GDALDataset  *poDataset;
    GDALAllRegister();
    poDataset = (GDALDataset *) GDALOpen( "ulcn2005_lpo_dd0_2_1.tif", GA_ReadOnly );
    if( poDataset == NULL )
    {
        cout<<"Error";
    }else{
      cout<<"No error\n";
    }

    printf( "Size is %dx%dx%d\n",
        poDataset->GetRasterXSize(), poDataset->GetRasterYSize(),
        poDataset->GetRasterCount() );

    double adfGeoTransform[6];
    if( poDataset->GetGeoTransform( adfGeoTransform ) == CE_None )
    {
        printf( "Origin = (%.6f,%.6f)\n",
                adfGeoTransform[0], adfGeoTransform[3] );
        printf( "Pixel Size = (%.6f,%.6f)\n",
                adfGeoTransform[1], adfGeoTransform[5] );
    }


    GDALRasterBand  *poBand;
    int             nBlockXSize, nBlockYSize;
    int             bGotMin, bGotMax;
    double          adfMinMax[2];
    poBand = poDataset->GetRasterBand( 1 );
    poBand->GetBlockSize( &nBlockXSize, &nBlockYSize );
    printf( "Block=%dx%d Type=%s, ColorInterp=%s\n",
            nBlockXSize, nBlockYSize,
            GDALGetDataTypeName(poBand->GetRasterDataType()),
            GDALGetColorInterpretationName(
                poBand->GetColorInterpretation()) );
    adfMinMax[0] = poBand->GetMinimum( &bGotMin );
    adfMinMax[1] = poBand->GetMaximum( &bGotMax );
    if( ! (bGotMin && bGotMax) )
        GDALComputeRasterMinMax((GDALRasterBandH)poBand, TRUE, adfMinMax);
    printf( "Min=%.3fd, Max=%.3f\n", adfMinMax[0], adfMinMax[1] );

    for(int x=0; x<200;x+=1){
      double adfPixel[2];
      if( GDALRasterIO( poBand, GF_Read, 0, x, 1, 1, adfPixel, 1, 1, GDT_CFloat64, 0, 0) == CE_None ){
        CPLString osValue;
        printf( "%.15g\n", adfPixel[0] );
      }
    }

    return 0;
}
