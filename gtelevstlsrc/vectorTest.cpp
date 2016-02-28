#include <iostream>
#include "Vector.h"
#include "LatLng.h"
#include "STLWriter.h"
#include <vector>

int main(){
  int a = 2;
  Vector v(-1,0,1);
  Vector v2(3,2,1);
  Vector v3 = v.multiply(3);
  v3.print();
  LatLng l = v.toSpherical();
  l.print();
  std::vector<float> d;
  d.push_back(.5);
  d.push_back(.5);
  d.push_back(.6);
  d.push_back(.7);

  writeSTLfromArray(d, 2, 2);
}
