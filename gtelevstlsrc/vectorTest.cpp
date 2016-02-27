#include <iostream>
#include "Vector.h"

int main(){
  int a = 2;
  Vector v(1,2.0,3);
  Vector v2(3,2,1);
  Vector v3 = v.multiply(3);
  v3.print();
}
