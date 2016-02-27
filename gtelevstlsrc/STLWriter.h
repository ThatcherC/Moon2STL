#ifndef LATLNG_H
#define LATLNG_H

class STL;

class LatLng {
  private:
    struct triangle{
      Vector a;
      Vector b;
      Vector c;
      Vector normal;
    };
    char endTag[2] = {0,0};
    ofstream out;

    int width = 40;		//default width and length of model
    int height = 40;
    vector<float> hList;
  public:
    float lat,lng;
    LatLng (float,float);
    void print();
    Vector toCartesian(void);
};

#endif
