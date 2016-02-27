//STL.cpp
//makes an stl file from a big array

//Determines the normal vector of a triangle from three vertices
Vector STL::normalOf(Vector p1, Vector p2, Vector p3){
	Vector u();
	Vector v();
	Vector r();
	u.x = p2.x-p1.x;
	u.y = p2.y-p1.y;
	u.z = p2.z-p1.z;
	v.x = p3.x-p1.x;
	v.y = p3.y-p1.y;
	v.z = p3.z-p1.z;
	r.x = u.y*v.z-u.z*v.y;
	r.y = u.z*v.x-u.x*v.z;
	r.z = u.x*v.y-u.y*v.x;
	return r;
}

//Creates a triangle and its normal vector from three vertices
triangle STL::createTriangle(Vector j, Vector k, Vector l){
	triangle t;
	t.a = j;
	t.b = k;
	t.c = l;
	t.normal = normalOf(j,k,l);
	return t;
}

//Writes a triangle into the STL file
void STL::addTriangle(triangle t){
	//normal vector1
	out.write((char *)&t.normal.x,sizeof(float));
	out.write((char *)&t.normal.y,sizeof(float));
	out.write((char *)&t.normal.z,sizeof(float));

	//vertices
	out.write((char *)&t.a.x,sizeof(float));
    out.write((char *)&t.a.y,sizeof(float));
    out.write((char *)&t.a.z,sizeof(float));

	out.write((char *)&t.b.x,sizeof(float));
    out.write((char *)&t.b.y,sizeof(float));
    out.write((char *)&t.b.z,sizeof(float));

	out.write((char *)&t.c.x,sizeof(float));
    out.write((char *)&t.c.y,sizeof(float));
    out.write((char *)&t.c.z,sizeof(float));
  	out.write(endTag,2);
}


float globalLat = 0;		//Latitude in radians, used for cosine adjustment

//Takes a height array height array of variable length and turns it into an STL file
void writeSTLfromArray(){
	out.open(savefile.c_str(),ios_base::binary);

	uint32_t triangleCount = (width-1)*(height-1)*2;	//number of facets in a void-free surface
	triangleCount += 4*(width-1);	//triangle counts for the walls of the model
	triangleCount += 4*(height-1);
	triangleCount += 2; 			//base triangles
	float planarScale = 40/width;
	float xScale = (float)cos(globalLat);

	if(out.good()){
		for(int i = 0; i < 80; i++){
			out.write("t",1);
		}
		//write a placeholder number
		out.write((char *)&triangleCount,4);
		for(int c = 1; c < width; c++){
			if((int)hList.at(c)>voidCutoff & (int)hList.at(c-1)>voidCutoff & (int)hList.at(c+width-1)>voidCutoff ){
				vertex a = createVertex(c*xScale, 0,hList.at(c));
				vertex b = createVertex((c-1)*xScale, 0,hList.at(c-1));
				vertex d = createVertex((c-1)*xScale, 1,hList.at(c+width-1));

				vertex w = createVertex(c*xScale,0,0);				//used in model walls
				vertex z = createVertex((c-1)*xScale,0,0);

				addTriangle(createTriangle(a,d,b));
				addTriangle(createTriangle(b,z,a));			//model walls
				addTriangle(createTriangle(w,a,z));
			}else{
				triangleCount-=3;
			}
		}
		for(int y = 1; y < height-1; y++){
			for(int x = 1; x < width; x++){
				if((int)hList.at(y*width+x)>voidCutoff & (int)hList.at((y-1)*width+x)>voidCutoff & (int)hList.at(y*width+x-1)>voidCutoff ){
					vertex a = createVertex(x*xScale,y,hList.at(y*width+x));
					vertex b = createVertex(x*xScale,y-1,hList.at((y-1)*width+x));
					vertex c = createVertex((x-1)*xScale,y,hList.at(y*width+x-1));
					addTriangle(createTriangle(a,c,b));
				}else{
					triangleCount--;
				}
			}
			for(int x = 1; x < width; x++){
				if((int)hList.at(y*width+x)>voidCutoff & (int)hList.at(y*width+x-1)>voidCutoff & (int)hList.at((y+1)*width+x-1)>voidCutoff ){
					vertex a = createVertex(x*xScale,y,hList.at(y*width+x));		//same
					vertex b = createVertex((x-1)*xScale,y,hList.at(y*width+x-1));
					vertex c = createVertex((x-1)*xScale,y+1,hList.at((y+1)*width+x-1));
					addTriangle(createTriangle(a,c,b));
				}else{
					triangleCount--;
				}
			}
		}
		for(int x = 1; x < width; x++){
			if((int)hList.at((height-1)*width+x)>voidCutoff & (int)hList.at((height-2)*width+x)>voidCutoff & (int)hList.at((height-1)*width+x-1)>voidCutoff){
				vertex a = createVertex(x*xScale,height-1,hList.at((height-1)*width+x));		//same
				vertex b = createVertex(x*xScale,height-2,hList.at((height-2)*width+x));
				vertex c = createVertex((x-1)*xScale,height-1,hList.at((height-1)*width+x-1));

				vertex w = createVertex(x*xScale,height-1,0);		//used in model walls
				vertex z = createVertex((x-1)*xScale,height-1,0);

				addTriangle(createTriangle(a,c,b));
				addTriangle(createTriangle(c,a,z));			//model walls
				addTriangle(createTriangle(w,z,a));
			}else{
				triangleCount-=3;
			}
		}

		vertex st;
		vertex sb;
		vertex bt;
		vertex bb;
		for(int y = 1; y < width; y++){						//adds walls in the y direction for
			if((int)hList.at(y*width)>voidCutoff & (int)hList.at((y-1)*width)>voidCutoff){
				st = createVertex(0,y,hList.at(y*width));			//for x=0 first
				sb = createVertex(0,y-1,hList.at((y-1)*width));
				bt = createVertex(0,y,0);
				bb = createVertex(0,y-1,0);

				addTriangle(createTriangle(bb,sb,st));
				addTriangle(createTriangle(st,bt,bb));
			}else{
				triangleCount-=2;
			}
			if((int)hList.at(y*width+width-1)>voidCutoff & (int)hList.at(y*width-1)>voidCutoff){
				st = createVertex((width-1)*xScale,y,hList.at(y*width+width-1));		//for x=width next
				sb = createVertex((width-1)*xScale,y-1,hList.at(y*width-1));
				bt = createVertex((width-1)*xScale,y,0);
				bb = createVertex((width-1)*xScale,y-1,0);

				addTriangle(createTriangle(sb,bb,st));
				addTriangle(createTriangle(bt,st,bb));
			}else{
				triangleCount-=2;
			}
		}

		vertex origin = createVertex(0,0,0);					//create bottom surface
		vertex bottomright = createVertex((width-1)*xScale,0,0);
		vertex topleft = createVertex(0,height-1,0);
		vertex topright = createVertex((width-1)*xScale,height-1,0);
		addTriangle(createTriangle(origin,topright,bottomright));
		addTriangle(createTriangle(origin,topleft,topright));
		//triangleCount-=2;

		out.seekp(80);
		out.write((char *)&triangleCount,4);
	}
	cout << triangleCount << "\n";
}
