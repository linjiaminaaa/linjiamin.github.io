// 全局变量
var gl;				// WebGL上下文
var program; 		// shader program

var mvStack = [];  // 模视投影矩阵栈，用数组实现，初始为空
var matCamera = mat4();	 // 照相机变换，初始为恒等矩阵
var matReverse = mat4(); // 照相机变换的逆变换，初始为恒等矩阵
//var matProj;  // 投影矩阵


var matShadow;  	// 用于绘制阴影的投影变换矩阵
var lightPos = vec3(8, 8, 8); 	// 光源位置
var shadowPlaneY = -0.2;	// 投影平面为y = shadowPlaneY



var yRot = 0.0;        // 用于动画的旋转角
var deltaAngle = 60.0; // 每秒旋转角度

// 用于保存W、S、A、D四个方向键的按键状态的数组
var keyDown = [false, false, false, false];

var g = 9.8;				// 重力加速度
var initSpeed = 4; 			// 初始速度 
var jumping = false;	    // 是否处于跳跃过程中
var jumpY = 0;          	// 当前跳跃的高度
var jumpTime = 0;			// 从跳跃开始经历的时间

var textureLoad = 0;
var numTextures = 5;


var matzidan = mat4();
var x = 0;
var z = 0;
var y = 0;
var angle_x = 0;
var x_angle = 0;
var fire = false;


var RandomX = Math.floor(Math.random() * 2);
var RandomZ = Math.floor(Math.random() * 2);
var toutch = function () {
	this.cnt = false;
	this.pos = false;
}

var flag = true;
var random_place = [19, -19];
var Key_Box = function() {
	this.x = -5;
	this.z = -5;
	this.pos = false;
}

var key_box = new Key_Box();
var special_Box = function() {
	this.x = 19;
	this.z = 19;
	this.cnt = false;
}
var special_box = [];
function Initspecial_Box() {
	
	var tmp_box1 = new special_Box();
	tmp_box1.x = 19, tmp_box1.z = 19;
	special_box.push(tmp_box1);

	var tmp_box2 = new special_Box();
	tmp_box2.x = 19, tmp_box2.z = -19;
	special_box.push(tmp_box2);

	var tmp_box3 = new special_Box();
	tmp_box3.x = -19, tmp_box3.z = -19;
	special_box.push(tmp_box3);

	var tmp_box4 = new special_Box();
	tmp_box4.x = -19, tmp_box4.z = 19;
	special_box.push(tmp_box4);

}

//光源
var Light = function () {
	this.pos = vec4(1.0, 1.0, 1.0, 0.0);
	this.ambient = vec3(0.2, 0.2, 0.2);
	this.diffuse = vec3(1.0, 1.0, 1.0);
	this.specular = vec3(0.4, 0.4, 0.0);
	this.on = true;
}
var lights = [];

var lightSun = new Light();
var lightRed = new Light();
var lightYellow = new Light();
var Sun = new Light();

var Life = true;
var life_num = 2;
var Win = false;

function initLights() {
	lights.push(lightSun);

	lightRed.pos = vec4(0.0, 0.0, 0.0, 1.0);
	lightRed.ambient = vec3(0.2, 0.0, 0.0);
	lightRed.diffuse = vec3(1.0, 0.0, 0.0);
	lightRed.specular = vec3(1.0, 0.0, 0.0);
	lights.push(lightRed);

	lightYellow.pos = vec4(0.0, 0.0, 0.0, 1.0);
	lightYellow.ambient = vec3(0.0, 0.0, 0.0);
	lightYellow.diffuse = vec3(0.0, 1.0, 1.0);
	lightYellow.specular = vec3(1.0, 1.0, 0.0);
	lights.push(lightYellow);

	gl.useProgram(programObj);
	var ambientLight = [];
	ambientLight.push(lightSun.ambient);
	ambientLight.push(lightRed.ambient);
	ambientLight.push(lightYellow.ambient);
	//ambientLight.push(Sun.ambient);
	gl.uniform3fv(programObj.u_AmbientLight, flatten(ambientLight));
	var diffuseLight = [];
	diffuseLight.push(lightSun.diffuse);
	diffuseLight.push(lightRed.diffuse);
	diffuseLight.push(lightYellow.diffuse);
	//diffuseLight.push(Sun.diffuse);
	gl.uniform3fv(programObj.u_DiffuseLight, flatten(diffuseLight));
	var specularLight = [];
	specularLight.push(lightSun.specular);
	specularLight.push(lightRed.specular);
	specularLight.push(lightYellow.specular);
	//specularLight.push(Sun.specular);
	gl.uniform3fv(programObj.u_SpecularLight, flatten(specularLight));


	gl.uniform3fv(programObj.u_SpotDirection,
		flatten(vec3(0.0, 0.0, -1.0)));
	gl.uniform1f(programObj.u_SpotCutOff, 8);
	gl.uniform1f(programObj.u_SpotExponent, 3);

	gl.useProgram(program);
	gl.uniform3fv(program.u_SpotDirection,
		flatten(vec3(0.0, 0.0, -1.0)));
	gl.uniform1f(program.u_SpotCutOff, 8);
	gl.uniform1f(program.u_SpotExponent, 3);

	passLightsOn();
}



function passLightsOn() {
	var lightsOn = [];
	for (var i = 0; i < lights.length; i++) {
		if (lights[i].on)
			lightsOn[i] = 1;
		else
			lightsOn[i] = 0;
	}
	gl.useProgram(program);
	gl.uniform1iv(program.u_LightOn, lightsOn);

	gl.useProgram(programObj);
	gl.uniform1iv(programObj.u_LightOn, lightsOn);

}

var MaterialObj = function () {
	this.ambient = vec3(0.0, 0.0, 0.0);
	this.diffuse = vec3(0.8, 0.8, 0.8);
	this.specular = vec3(0.0, 0.0, 0.0);
	this.emission = vec3(0.0, 0.0, 0.0);
	this.shininess = 10;
	this.alpha = 1.0;
}

var mtlRedLight = new MaterialObj();
mtlRedLight.ambient = vec3(0.1, 0.1, 0.1);
mtlRedLight.diffuse = vec3(0.2, 0.2, 0.2);
mtlRedLight.specular = vec3(0.2, 0.2, 0.2);
mtlRedLight.emission = vec3(1.0, 0.0, 0.0);
mtlRedLight.shininess = 150;

var mtlRedLightOff = new MaterialObj();
mtlRedLightOff.ambient = vec3(0.1, 0.1, 0.1);
mtlRedLightOff.diffuse = vec3(0.8, 0.8, 0.8);
mtlRedLightOff.specular = vec3(0.2, 0.2, 0.2);
mtlRedLightOff.emission = vec3(0.0, 0.0, 0.0);
mtlRedLightOff.shininess = 150;
mtlRedLightOff.alpha = 1;

var mtlgold = new MaterialObj();
mtlgold.ambient = vec3(0.1, 0.1, 0.1);
mtlgold.diffuse = vec3(0.2, 0.2, 0.2);
mtlgold.specular = vec3(0.2, 0.2, 0.2);
mtlgold.emission = vec3(0.9, 0.9, 0.0);
mtlgold.shininess = 90;

var goldTexObj;
//玻璃
var mtlboli = new MaterialObj();
mtlboli.ambient = vec3(0.1, 0.1, 0.1);
mtlboli.diffuse = vec3(0.2, 0.2, 0.2);
mtlboli.specular = vec3(0.2, 0.2, 0.2);
mtlboli.emission = vec3(1, 1, 1);

var TextureObj = function (pathName, format, mipmapping) {
	this.path = pathName;
	this.format = format;
	this.mipmapping = mipmapping;
	this.texture = null;
	this.complete = false;
}

function loadTexture(path, format, mipmapping) {
	var texObj = new TextureObj(path, format, mipmapping);
	var image = new Image();
	if (!image) {
		console.log("创建image对象失败!");
		return false;
	}
	image.onload = function () {
		console.log("纹理图" + path + "加载完毕");
		initTexture(texObj, image);
		textureLoad++;
		if (textureLoad == numTextures)
			requestAnimFrame(render);
	};
	image.src = path;
	console.log("开始加载纹理图:" + path);
	return texObj;
}

function initTexture(texObj, image) {
	texObj.texture = gl.createTexture();
	if (!texObj.texture) {
		console.log("创建纹理对象失败!");
		return false;
	}
	gl.bindTexture(gl.TEXTURE_2D, texObj.texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, texObj.format,
		texObj.format, gl.UNSIGNED_BYTE, image);

	if (texObj.mipmapping) {
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D,
			gl.TEXTURE_MIN_FILTER,
			gl.LINEAR_MIPMAP_LINEAR);
	}
	else
		gl.texParameteri(gl.TEXTURE_2D,
			gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	texObj.complete = true;
}

// 定义Obj对象
// 构造函数
var Obj = function () {
	this.numVertices = 0; 		// 顶点个数
	this.vertices = new Array(0); // 用于保存顶点数据的数组
	this.normals = new Array(0);
	this.texcoords = new Array(0);
	this.vertexBuffer = null;	// 存放顶点数据的buffer对象
	this.normalBuffer = null;
	this.texBuffer = null;
	//	this.color = vec3(1.0, 1.0, 1.0); // 对象颜色，默认为白色
	this.material = new MaterialObj();
	this.texObj = null;
}

// 初始化缓冲区对象(VBO)
Obj.prototype.initBuffers = function () {
	/*创建并初始化顶点坐标缓冲区对象(Buffer Object)*/
	// 创建缓冲区对象，存于成员变量vertexBuffer中
	this.vertexBuffer = gl.createBuffer();
	// 将vertexBuffer绑定为当前Array Buffer对象
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	// 为Buffer对象在GPU端申请空间，并提供数据
	gl.bufferData(gl.ARRAY_BUFFER,	// Buffer类型
		flatten(this.vertices),		// 数据来源
		gl.STATIC_DRAW	// 表明是一次提供数据，多遍绘制
	);
	// 顶点数据已传至GPU端，可释放内存
	this.vertices.length = 0;

	if (this.normals.length != 0) {
		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,
			flatten(this.normals),
			gl.STATIC_DRAW);
		this.normals.length = 0;
	}

	if (this.texcoords.length != 0) {
		this.texBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,
			flatten(this.texcoords),
			gl.STATIC_DRAW);
		this.texcoords.length = 0;
	}
}

// 绘制几何对象
// 参数为模视矩阵
Obj.prototype.draw = function (matMV, material, tmpTexObj) {


	// 设置为a_Position提供数据的方式
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	// 为顶点属性数组提供数据(数据存放在vertexBuffer对象中)
	gl.vertexAttribPointer(
		program.a_Position,	// 属性变量索引
		3,					// 每个顶点属性的分量个数
		gl.FLOAT,			// 数组数据类型
		false,				// 是否进行归一化处理
		0,   // 在数组中相邻属性成员起始位置间的间隔(以字节为单位)
		0    // 第一个属性值在buffer中的偏移量
	);
	// 为a_Position启用顶点数组
	gl.enableVertexAttribArray(program.a_Position);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(
		program.a_Normal,
		3,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(program.a_Normal);

	if (this.texBuffer != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
		gl.vertexAttribPointer(
			program.a_Texcoord,
			2,
			gl.FLOAT,
			false,
			0, 0
		);
		gl.enableVertexAttribArray(program.a_Texcoord);
	}

	var mtl;
	if (arguments.length > 1 && arguments[1] != null)
		mtl = material;
	else
		mtl = this.material;

	var ambientProducts = [];
	var diffuseProducts = [];
	var specularProducts = [];
	for (var i = 0; i < lights.length; i++) {
		ambientProducts.push(mult(lights[i].ambient,
			mtl.ambient));
		diffuseProducts.push(mult(lights[i].diffuse,
			mtl.diffuse));
		specularProducts.push(mult(lights[i].specular,
			mtl.specular));
	}

	gl.uniform3fv(program.u_AmbientProduct,
		flatten(ambientProducts));
	gl.uniform3fv(program.u_DiffuseProduct,
		flatten(diffuseProducts));
	gl.uniform3fv(program.u_SpecularProduct,
		flatten(specularProducts));
	gl.uniform3fv(program.u_Emission,
		flatten(mtl.emission))
	gl.uniform1f(program.u_Shininess, mtl.shininess);
	gl.uniform1f(program.u_Alpha, mtl.alpha);

	// 传颜色
	//gl.uniform3fv(program.u_Color, flatten(this.color));

	var texObj;
	if (arguments.length > 2 && arguments[2] != null)
		texObj = tmpTexObj;
	else
		texObj = this.texObj;

	if (texObj != null && texObj.complete)
		gl.bindTexture(gl.TEXTURE_2D, texObj.texture);
	// 开始绘制


	gl.uniformMatrix4fv(program.u_ModelView, false,
		flatten(matMV)); // 传MV矩阵
	gl.uniformMatrix3fv(program.u_NormalMat, false,
		flatten(normalMatrix(matMV)));
	gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);

}

// 在y=0平面绘制中心在原点的格状方形地面
// fExtent：决定地面区域大小(方形地面边长的一半)
// fStep：决定线之间的间隔
// 返回地面Obj对象
function buildGround(fExtent, fStep) {
	var obj = new Obj(); // 新建一个Obj对象

	var iterations = 2 * fExtent / fStep;
	var fTexcoordStep = 40 / iterations;
	for (var x = -fExtent, s = 0; x < fExtent; x += fStep, s += fTexcoordStep) {
		for (var z = fExtent, t = 0; z > -fExtent; z -= fStep, t += fTexcoordStep) {
			// 以(x, 0, z)为左下角的单元四边形的4个顶点
			var ptLowerLeft = vec3(x, 0, z);
			var ptLowerRight = vec3(x + fStep, 0, z);
			var ptUpperLeft = vec3(x, 0, z - fStep);
			var ptUpperRight = vec3(x + fStep, 0, z - fStep);

			// 分成2个三角形
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperRight);

			//顶点法向
			obj.normals.push(vec3(0, 1, 0));
			obj.normals.push(vec3(0, 1, 0));
			obj.normals.push(vec3(0, 1, 0));
			obj.normals.push(vec3(0, 1, 0));
			obj.normals.push(vec3(0, 1, 0));
			obj.normals.push(vec3(0, 1, 0));



			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t + fTexcoordStep));

			obj.numVertices += 6;
		}

	}
	//材质
	obj.material.ambient = vec3(0.1, 0.1, 0.1);
	obj.material.diffuse = vec3(0.8, 0.8, 0.8);
	obj.material.specular = vec3(0.3, 0.3, 0.3);
	obj.material.emission = vec3(0.0, 0.0, 0.0);
	obj.material.shininess = 10;
	return obj;
}

// 用于生成一个中心在原点的球的顶点数据(南北极在z轴方向)
// 返回球Obj对象，参数为球的半径及经线和纬线数
function buildSphere(radius, columns, rows) {
	var obj = new Obj(); // 新建一个Obj对象
	var vertices = []; // 存放不同顶点的数组

	for (var r = 0; r <= rows; r++) {
		var v = r / rows;  // v在[0,1]区间
		var theta1 = v * Math.PI; // theta1在[0,PI]区间

		var temp = vec3(0, 0, 1);
		var n = vec3(temp); // 实现Float32Array深拷贝
		var cosTheta1 = Math.cos(theta1);
		var sinTheta1 = Math.sin(theta1);
		n[0] = temp[0] * cosTheta1 + temp[2] * sinTheta1;
		n[2] = -temp[0] * sinTheta1 + temp[2] * cosTheta1;

		for (var c = 0; c <= columns; c++) {
			var u = c / columns; // u在[0,1]区间
			var theta2 = u * Math.PI * 2; // theta2在[0,2PI]区间
			var pos = vec3(n);
			temp = vec3(n);
			var cosTheta2 = Math.cos(theta2);
			var sinTheta2 = Math.sin(theta2);

			pos[0] = temp[0] * cosTheta2 - temp[1] * sinTheta2;
			pos[1] = temp[0] * sinTheta2 + temp[1] * cosTheta2;

			var posFull = mult(pos, radius);

			vertices.push(posFull);
		}
	}

	/*生成最终顶点数组数据(使用三角形进行绘制)*/
	var colLength = columns + 1;
	for (var r = 0; r < rows; r++) {
		var offset = r * colLength;

		for (var c = 0; c < columns; c++) {
			var ul = offset + c;						// 左上
			var ur = offset + c + 1;					// 右上
			var br = offset + (c + 1 + colLength);	// 右下
			var bl = offset + (c + 0 + colLength);	// 左下

			// 由两条经线和纬线围成的矩形
			// 分2个三角形来画
			obj.vertices.push(vertices[ul]);
			obj.vertices.push(vertices[bl]);
			obj.vertices.push(vertices[br]);
			obj.vertices.push(vertices[ul]);
			obj.vertices.push(vertices[br]);
			obj.vertices.push(vertices[ur]);
			//顶点法向
			obj.normals.push(vertices[ul]);
			obj.normals.push(vertices[bl]);
			obj.normals.push(vertices[br]);
			obj.normals.push(vertices[ul]);
			obj.normals.push(vertices[br]);
			obj.normals.push(vertices[ur]);

			// 纹理坐标
			obj.texcoords.push(vec2(c / columns, r / rows));
			obj.texcoords.push(vec2(c / columns, (r + 1) / rows));
			obj.texcoords.push(vec2((c + 1) / columns, (r + 1) / rows));
			obj.texcoords.push(vec2(c / columns, r / rows));
			obj.texcoords.push(vec2((c + 1) / columns, (r + 1) / rows));
			obj.texcoords.push(vec2((c + 1) / columns, r / rows));
		}

	}
	//材质
	obj.material.ambient = vec3(0.021500, 0.174500, 0.021500);
	obj.material.diffuse = vec3(0.075680, 0.614240, 0.075680);
	obj.material.specular = vec3(0.633000, 0.727811, 0.633000);
	obj.material.emission = vec3(0.0, 0.0, 0.0);
	obj.material.shininess = 76;

	vertices.length = 0; // 已用不到，释放 
	obj.numVertices = rows * columns * 6; // 顶点数

	return obj;
}

// 构建中心在原点的圆环(由线段构建)
// 参数分别为圆环的主半径(决定环的大小)，
// 圆环截面圆的半径(决定环的粗细)，
// numMajor和numMinor决定模型精细程度
// 返回圆环Obj对象
function buildTorus(majorRadius, minorRadius, numMajor, numMinor) {
	var obj = new Obj(); // 新建一个Obj对象

	obj.numVertices = numMajor * numMinor * 6; // 顶点数

	var majorStep = 2.0 * Math.PI / numMajor;
	var minorStep = 2.0 * Math.PI / numMinor;

	var sScale = 4, tScale = 2;
	for (var i = 0; i < numMajor; ++i) {
		var a0 = i * majorStep;
		var a1 = a0 + majorStep;
		var x0 = Math.cos(a0);
		var y0 = Math.sin(a0);
		var x1 = Math.cos(a1);
		var y1 = Math.sin(a1);

		var center0 = mult(majorRadius, vec3(x0, y0, 0));
		var center1 = mult(majorRadius, vec3(x1, y1, 0));

		for (var j = 0; j < numMinor; ++j) {
			var b0 = j * minorStep;
			var b1 = b0 + minorStep;
			var c0 = Math.cos(b0);
			var r0 = minorRadius * c0 + majorRadius;
			var z0 = minorRadius * Math.sin(b0);
			var c1 = Math.cos(b1);
			var r1 = minorRadius * c1 + majorRadius;
			var z1 = minorRadius * Math.sin(b1);

			var left0 = vec3(x0 * r0, y0 * r0, z0);
			var right0 = vec3(x1 * r0, y1 * r0, z0);
			var left1 = vec3(x0 * r1, y0 * r1, z1);
			var right1 = vec3(x1 * r1, y1 * r1, z1);
			obj.vertices.push(left0);
			obj.vertices.push(right0);
			obj.vertices.push(left1);
			obj.vertices.push(left1);
			obj.vertices.push(right0);
			obj.vertices.push(right1);

			obj.normals.push(subtract(left0, center0));
			obj.normals.push(subtract(right0, center1));
			obj.normals.push(subtract(left1, center0));
			obj.normals.push(subtract(left1, center0));
			obj.normals.push(subtract(right0, center1));
			obj.normals.push(subtract(right1, center1));

			// 纹理坐标
			obj.texcoords.push(vec2(i / numMajor * sScale,
				j / numMinor * tScale));
			obj.texcoords.push(vec2((i + 1) / numMajor * sScale,
				j / numMinor * tScale));
			obj.texcoords.push(vec2(i / numMajor * sScale,
				(j + 1) / numMinor * tScale));
			obj.texcoords.push(vec2(i / numMajor * sScale,
				(j + 1) / numMinor * tScale));
			obj.texcoords.push(vec2((i + 1) / numMajor * sScale,
				j / numMinor * tScale));
			obj.texcoords.push(vec2((i + 1) / numMajor * sScale,
				(j + 1) / numMinor * tScale));


		}

	}
	//材质
	obj.material.ambient = vec3(0.110000, 0.060000, 0.090000);
	obj.material.diffuse = vec3(0.430000, 0.470000, 0.540000);
	obj.material.specular = vec3(0.330000, 0.330000, 0.520000);
	obj.material.emission = vec3(0.0, 0.0, 0.0);
	obj.material.shininess = 22.0;
	return obj;
}

function buildSquare(fExtent, fStep) {
	var obj = new Obj(); // 新建一个Obj对象
	var iterations = 2 * fExtent / fStep;	// 单层循环次数
	var fTexcoordStep = 1 / iterations;	// 纹理坐标递增步长
	// 上面
	for (var x = -fExtent, s = 0; x < fExtent; x += fStep, s += fTexcoordStep) {
		for (var z = fExtent, t = 0; z > -fExtent; z -= fStep, t += fTexcoordStep) {
			// 以(x, 0, z)为左下角的单元四边形的4个顶点
			var ptLowerLeft = vec3(x, 0.5, z);
			var ptLowerRight = vec3(x + fStep, 0.5, z);
			var ptUpperLeft = vec3(x, 0.5, z - fStep);
			var ptUpperRight = vec3(x + fStep, 0.5, z - fStep);

			// 顶点坐标，分成2个三角形
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperRight);

			// 顶点法向
			obj.normals.push(vec3(0, 1, 0));
			obj.normals.push(vec3(0, 1, 0));
			obj.normals.push(vec3(0, 1, 0));
			obj.normals.push(vec3(0, 1, 0));
			obj.normals.push(vec3(0, 1, 0));
			obj.normals.push(vec3(0, 1, 0));

			// 纹理坐标
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t + fTexcoordStep));

			obj.numVertices += 6;
		}
	}
	// 下面
	for (var x = fExtent, s = 0; x > -fExtent; x -= fStep, s += fTexcoordStep) {
		for (var z = fExtent, t = 0; z > -fExtent; z -= fStep, t += fTexcoordStep) {
			// 以(x, 0, z)为左下角的单元四边形的4个顶点
			var ptLowerLeft = vec3(x, -0.5, z);
			var ptLowerRight = vec3(x - fStep, -0.5, z);
			var ptUpperLeft = vec3(x, -0.5, z - fStep);
			var ptUpperRight = vec3(x - fStep, -0.5, z - fStep);

			// 顶点坐标，分成2个三角形
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperRight);

			// 顶点法向
			obj.normals.push(vec3(0, -1, 0));
			obj.normals.push(vec3(0, -1, 0));
			obj.normals.push(vec3(0, -1, 0));
			obj.normals.push(vec3(0, -1, 0));
			obj.normals.push(vec3(0, -1, 0));
			obj.normals.push(vec3(0, -1, 0));

			// 纹理坐标
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t + fTexcoordStep));

			obj.numVertices += 6;
		}
	}
	// 前面
	for (var x = -fExtent, s = 0; x < fExtent; x += fStep, s += fTexcoordStep) {
		for (var y = -fExtent, t = 0; y < fExtent; y += fStep, t += fTexcoordStep) {
			// 以(x, 0, z)为左下角的单元四边形的4个顶点
			var ptLowerLeft = vec3(x, y, 0.5);
			var ptLowerRight = vec3(x + fStep, y, 0.5);
			var ptUpperLeft = vec3(x, y + fStep, 0.5);
			var ptUpperRight = vec3(x + fStep, y + fStep, 0.5);

			// 顶点坐标，分成2个三角形
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperRight);

			// 顶点法向
			obj.normals.push(vec3(0, 0, 1));
			obj.normals.push(vec3(0, 0, 1));
			obj.normals.push(vec3(0, 0, 1));
			obj.normals.push(vec3(0, 0, 1));
			obj.normals.push(vec3(0, 0, 1));
			obj.normals.push(vec3(0, 0, 1));

			// 纹理坐标
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t + fTexcoordStep));

			obj.numVertices += 6;
		}
	}
	// 后面
	for (var x = fExtent, s = 0; x > -fExtent; x -= fStep, s += fTexcoordStep) {
		for (var y = -fExtent, t = 0; y < fExtent; y += fStep, t += fTexcoordStep) {
			// 以(x, 0, z)为左下角的单元四边形的4个顶点
			var ptLowerLeft = vec3(x, y, -0.5);
			var ptLowerRight = vec3(x - fStep, y, -0.5);
			var ptUpperLeft = vec3(x, y + fStep, -0.5);
			var ptUpperRight = vec3(x - fStep, y + fStep, -0.5);

			// 顶点坐标，分成2个三角形
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperRight);

			// 顶点法向
			obj.normals.push(vec3(0, 0, -1));
			obj.normals.push(vec3(0, 0, -1));
			obj.normals.push(vec3(0, 0, -1));
			obj.normals.push(vec3(0, 0, -1));
			obj.normals.push(vec3(0, 0, -1));
			obj.normals.push(vec3(0, 0, -1));

			// 纹理坐标
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t + fTexcoordStep));

			obj.numVertices += 6;
		}
	}
	// 左面
	for (var z = -fExtent, s = 0; z < fExtent; z += fStep, s += fTexcoordStep) {
		for (var y = -fExtent, t = 0; y < fExtent; y += fStep, t += fTexcoordStep) {
			// 以(x, 0, z)为左下角的单元四边形的4个顶点
			var ptLowerLeft = vec3(-0.5, y, z);
			var ptLowerRight = vec3(-0.5, y, z + fStep);
			var ptUpperLeft = vec3(-0.5, y + fStep, z);
			var ptUpperRight = vec3(-0.5, y + fStep, z + fStep);

			// 顶点坐标，分成2个三角形
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperRight);

			// 顶点法向
			obj.normals.push(vec3(-1, 0, 0));
			obj.normals.push(vec3(-1, 0, 0));
			obj.normals.push(vec3(-1, 0, 0));
			obj.normals.push(vec3(-1, 0, 0));
			obj.normals.push(vec3(-1, 0, 0));
			obj.normals.push(vec3(-1, 0, 0));

			// 纹理坐标
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t + fTexcoordStep));

			obj.numVertices += 6;
		}
	}
	// 右面
	for (var z = fExtent, s = 0; z > -fExtent; z -= fStep, s += fTexcoordStep) {
		for (var y = -fExtent, t = 0; y < fExtent; y += fStep, t += fTexcoordStep) {
			// 以(x, 0, z)为左下角的单元四边形的4个顶点
			var ptLowerLeft = vec3(0.5, y, z);
			var ptLowerRight = vec3(0.5, y, z - fStep);
			var ptUpperLeft = vec3(0.5, y + fStep, z);
			var ptUpperRight = vec3(0.5, y + fStep, z - fStep);

			// 顶点坐标，分成2个三角形
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperLeft);
			obj.vertices.push(ptLowerRight);
			obj.vertices.push(ptUpperRight);

			// 顶点法向
			obj.normals.push(vec3(1, 0, 0));
			obj.normals.push(vec3(1, 0, 0));
			obj.normals.push(vec3(1, 0, 0));
			obj.normals.push(vec3(1, 0, 0));
			obj.normals.push(vec3(1, 0, 0));
			obj.normals.push(vec3(1, 0, 0));

			// 纹理坐标
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s, t + fTexcoordStep));
			obj.texcoords.push(vec2(s + fTexcoordStep, t));
			obj.texcoords.push(vec2(s + fTexcoordStep, t + fTexcoordStep));

			obj.numVertices += 6;
		}
	}

	// 设置地面材质
	obj.material.ambient = vec3(0.3, 0.3, 0.3);	// 环境反射系数
	obj.material.diffuse = vec3(0.3, 0.3, 0.3);	// 漫反射系数
	obj.material.specular = vec3(0.0, 0.0, 0.0);// 镜面反射系数
	obj.material.emission = vec3(0.0, 0.0, 0.0);// 发射光
	obj.material.shininess = 80;				// 高光系数

	return obj;

}

// 获取shader中变量位置
function getLocation() {
	/*获取shader中attribute变量的位置(索引)*/
	program.a_Position = gl.getAttribLocation(program, "a_Position");
	if (program.a_Position < 0) { // getAttribLocation获取失败则返回-1
		console.log("获取attribute变量a_Position失败！");
	}

	program.a_Normal = gl.getAttribLocation(program, "a_Normal");
	if (program.a_Normal < 0) {
		console.log("a_Normal!");
	}

	program.a_Texcoord = gl.getAttribLocation(program, "a_Texcoord");
	if (program.a_Texcoord < 0) {
		console.log("a_Texcoord!");
	}

	/*获取shader中uniform变量的位置(索引)*/
	program.u_ModelView = gl.getUniformLocation(program, "u_ModelView");
	if (!program.u_ModelView) {
		console.log("u_ModelView!");
	}
	program.u_Projection = gl.getUniformLocation(program, "u_Projection");
	if (!program.u_Projection) {
		console.log("u_Projection!");
	}
	program.u_NormalMat = gl.getUniformLocation(program, "u_NormalMat");
	if (!program.u_NormalMat) {
		console.log("u_NormalMat!");
	}
	program.u_LightPosition = gl.getUniformLocation(program, "u_LightPosition");
	if (!program.u_LightPosition) {
		console.log("u_LightPosition!");
	}
	program.u_Shininess = gl.getUniformLocation(program, "u_Shininess");
	if (!program.u_Shininess) {
		console.log("u_Shininess!");
	}
	program.u_AmbientProduct = gl.getUniformLocation(program, "u_AmbientProduct");
	if (!program.u_AmbientProduct) {
		console.log("u_AmbientProduct!");
	}
	program.u_DiffuseProduct = gl.getUniformLocation(program, "u_DiffuseProduct");
	if (!program.u_DiffuseProduct) {
		console, log("u_DiffuseProduct!");
	}
	program.u_SpecularProduct = gl.getUniformLocation(program, "u_SpecularProduct");
	if (!program.u_SpecularProduct) {
		console.log("u_SpecularProduct!");
	}
	program.u_Emission = gl.getUniformLocation(program, "u_Emission");
	if (!program.u_Emission) {
		console.log("u_Emission!");
	}
	program.u_SpotDirection = gl.getUniformLocation(program, "u_SpotDirection");
	if (!program.u_SpotDirection) {
		console.log("u_SpotDirection!");
	}
	program.u_SpotCutOff = gl.getUniformLocation(program, "u_SpotCutOff");
	if (!program.u_SpotCutOff) {
		console.log("u_SpotCutOff!")
	}
	program.u_SpotExponent = gl.getUniformLocation(program, "u_SpotExponent");
	if (!program.u_SpotExponent) {
		console.log("u_SpotExponent!")
	}
	program.u_LightOn = gl.getUniformLocation(program, "u_LightOn");
	if (!program.u_LightOn) {
		console.log("u_LightOn!");
	}
	program.u_Sampler = gl.getUniformLocation(program, "u_Sampler");
	if (!program.u_Sampler) {
		console.log("u_Sampler!");
	}
	program.u_Alpha = gl.getUniformLocation(program, "u_Alpha");
	if (!program.u_Alpha) {
		console.log("u_Alpha!");
	}
	program.u_bOnlyTexture = gl.getUniformLocation(program, "u_bOnlyTexture");
	if (!program.u_bOnlyTexture) {
		console.log("u_bOnlyTexture!");
	}
	program.u_bShadow = gl.getUniformLocation(program, "u_bShadow");
	if (!program.u_bShadow) {
		console.log("u_bShadow！");
	}
	/* program.u_MVPMatrix = gl.getUniformLocation(program, "u_MVPMatrix");
	if(!program.u_MVPMatrix){ // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_MVPMatrix失败！"); 
	}	
	program.u_Color = gl.getUniformLocation(program, "u_Color");
	if(!program.u_Color){ // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_Color失败！"); 
	} */


	/*获取programObj中attribute变量的位置(索引)*/
	attribIndex.a_Position = gl.getAttribLocation(programObj, "a_Position");
	if (attribIndex.a_Position < 0) { // getAttribLocation获取失败则返回-1
		console.log("获取attribute变量a_Position失败！");
	}
	attribIndex.a_Normal = gl.getAttribLocation(programObj, "a_Normal");
	if (attribIndex.a_Normal < 0) { // getAttribLocation获取失败则返回-1
		console.log("获取attribute变量a_Normal失败！");
	}
	attribIndex.a_Texcoord = gl.getAttribLocation(programObj, "a_Texcoord");
	if (attribIndex.a_Texcoord < 0) { // getAttribLocation获取失败则返回-1
		console.log("获取attribute变量a_Texcoord失败！");
	}

	/*获取programObj中uniform变量的位置(索引)*/
	mtlIndex.u_Ka = gl.getUniformLocation(programObj, "u_Ka");
	if (!mtlIndex.u_Ka) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_Ka失败！");
	}
	mtlIndex.u_Kd = gl.getUniformLocation(programObj, "u_Kd");
	if (!mtlIndex.u_Kd) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_Kd失败！");
	}
	mtlIndex.u_Ks = gl.getUniformLocation(programObj, "u_Ks");
	if (!mtlIndex.u_Ks) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_Ks失败！");
	}
	mtlIndex.u_Ke = gl.getUniformLocation(programObj, "u_Ke");
	if (!mtlIndex.u_Ke) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_Ke失败！");
	}
	mtlIndex.u_Ns = gl.getUniformLocation(programObj, "u_Ns");
	if (!mtlIndex.u_Ns) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_Ns失败！");
	}
	mtlIndex.u_d = gl.getUniformLocation(programObj, "u_d");
	if (!mtlIndex.u_d) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_d失败！");
	}

	programObj.u_ModelView = gl.getUniformLocation(programObj, "u_ModelView");
	if (!programObj.u_ModelView) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_ModelView失败！");
	}
	programObj.u_Projection = gl.getUniformLocation(programObj, "u_Projection");
	if (!programObj.u_Projection) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_Projection失败！");
	}
	programObj.u_NormalMat = gl.getUniformLocation(programObj, "u_NormalMat");
	if (!program.u_NormalMat) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_NormalMat失败！");
	}
	programObj.u_LightPosition = gl.getUniformLocation(programObj, "u_LightPosition");
	if (!programObj.u_LightPosition) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_LightPosition失败！");
	}
	programObj.u_AmbientLight = gl.getUniformLocation(programObj, "u_AmbientLight");
	if (!programObj.u_AmbientLight) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_AmbientLight失败！");
	}
	programObj.u_DiffuseLight = gl.getUniformLocation(programObj, "u_DiffuseLight");
	if (!programObj.u_DiffuseLight) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_DiffuseLight失败！");
	}
	programObj.u_SpecularLight = gl.getUniformLocation(programObj, "u_SpecularLight");
	if (!programObj.u_SpecularLight) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_SpecularLight失败！");
	}
	programObj.u_SpotDirection = gl.getUniformLocation(programObj, "u_SpotDirection");
	if (!programObj.u_SpotDirection) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_SpotDirection失败！");
	}
	programObj.u_SpotCutOff = gl.getUniformLocation(programObj, "u_SpotCutOff");
	if (!programObj.u_SpotCutOff) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_SpotCutOff失败！");
	}
	programObj.u_SpotExponent = gl.getUniformLocation(programObj, "u_SpotExponent");
	if (!programObj.u_SpotExponent) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_SpotExponent失败！");
	}
	programObj.u_LightOn = gl.getUniformLocation(programObj, "u_LightOn");
	if (!programObj.u_LightOn) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_LightOn失败！");
	}
	programObj.u_Sampler = gl.getUniformLocation(programObj, "u_Sampler");
	if (!programObj.u_Sampler) { // getUniformLocation获取失败则返回null
		console.log("获取uniform变量u_Sampler失败！");
	}
}




var ground = buildGround(20.0, 0.1); // 生成地面对象

var numSpheres = 50;  // 场景中球的数目
// 用于保存球位置的数组，对每个球位置保存其x、z坐标
var posSphere = [];
var sphere = buildSphere(0.2, 30, 30); // 生成球对象

var torus = buildTorus(0.35, 0.15, 40, 20); // 生成圆环对象

var square = buildSquare(0.5, 0.1);

var lightTexObj;
var skyTexObj;
var nightTexObj;
var boliTexObj;
var zhuziObj;
var mingziObj;

// 初始化场景中的几何对象
function initObjs() {
	getballObj();
	initZidan();
	getmap();
	getceiling();
	/* 	for(var i=-17;i<=22;i++){
			roadmap.push(vec2(0,i));
		}
		 */
	// 初始化地面顶点数据缓冲区对象(VBO)
	ground.initBuffers();
	ground.texObj = loadTexture("Res\\ground.jpg", gl.RGB, true);
	var sizeGround = 20;
	// 随机放置球的位置
	for (var iSphere = 0; iSphere < numSpheres; iSphere++) {
		// 在 -sizeGround 和 sizeGround 间随机选择一位置
		var x = Math.random() * sizeGround * 2 - sizeGround;
		var z = Math.random() * sizeGround * 2 - sizeGround;
		posSphere.push(vec2(x, z));
	}

	// 初始化球顶点数据缓冲区对象(VBO)
	sphere.initBuffers();
	sphere.texObj = loadTexture("Res\\sphere.jpg", gl.RGB, true);
	// 初始化圆环顶点数据缓冲区对象(VBO)
	torus.initBuffers();
	torus.texObj = loadTexture("Res\\torus.jpg", gl.RGB, true);

	lightTexObj = loadTexture("Res\\sun.bmp", gl.RGB, true);
	skyTexObj = loadTexture("Res\\sky.jpg", gl.RGB, true);
	nightTexObj = loadTexture("Res\\stars.bmp", gl.RGB, true);
	boliTexObj = loadTexture("Res\\ball2.png", gl.RGB, true);
	zhuziObj = loadTexture("Res\\zhuzi4.jpg", gl.RGB, true);
	square.initBuffers();
	square.texObj = loadTexture("Res\\wall2.jpg", gl.RGB, true);
	goldTexObj=loadTexture("Res\\gold.bmp",gl.RGB,true);
	mingziObj=loadTexture("Res\\mingzi.bmp",gl.RGB,true);

}

var obj = loadOBJ("Res\\Saber.obj");
var obj1 = loadOBJ("Res\\Blaster.obj");
var box = loadOBJ("Res\\box.obj");
var cup = loadOBJ("Res\\file.obj");

var programObj;
var attribIndex = new AttribIndex();
var mtlIndex = new MTLIndex();

var map = [];
var ceiling = [];//天花板

function getmap() {
	for (var i = -20; i < 20; i++) {
		map.push(vec3(i, 0, -20));//北
		map.push(vec3(i, 0, 20));//南
		map.push(vec3(-20, 0, i));//西
		map.push(vec3(20, 0, i));//东
	}
	for (var i = -20; i <= -3; i++) {
		map.push(vec3(0, 0, i));
		map.push(vec3(0, 0, -i));
		map.push(vec3(i, 0, 0));
		map.push(vec3(-i, 0, 0));
	}
	for (var i = -13; i < -3; i++) {
		map.push(vec3(i, 0, -4));
		map.push(vec3(-i, 0, -4));
		map.push(vec3(i, 0, 4));
		map.push(vec3(-i, 0, 4));
	}
	for (var i = -14; i < -4; i++) {
		map.push(vec3(10, 0, i))
		map.push(vec3(-10, 0, i))
		map.push(vec3(10, 0, -i))
		map.push(vec3(-10, 0, -i))
	}

	for (var i = -13; i < 0; i++) {
		map.push(vec3(i, 0, -17))
		map.push(vec3(i, 0, 17))
		map.push(vec3(-i, 0, -17))
		map.push(vec3(-i, 0, 17))
	}

	for (var i = -16; i < -12; i++) {
		map.push(vec3(13, 0, i));
		map.push(vec3(-13, 0, i));
		map.push(vec3(13, 0, -i));
		map.push(vec3(-13, 0, -i));
	}
	for (var i = -6; i < -4; i++) {
		map.push(vec3(4, 0, i));
		map.push(vec3(-4, 0, i));
		map.push(vec3(4, 0, -i));
		map.push(vec3(-4, 0, -i));
	}
	for (var i = -6; i < -3; i++) {
		map.push(vec3(16, 0, i));
		map.push(vec3(-16, 0, i));
		map.push(vec3(16, 0, -i));
		map.push(vec3(-16, 0, -i));
	}
	for (var i = -7; i < -3; i++) {
		map.push(vec3(i, 0, -7));
		map.push(vec3(i, 0, 7));
		map.push(vec3(-i, 0, -7));
		map.push(vec3(-i, 0, 7));
	}
	for (var i = -14; i < -7; i++) {
		map.push(vec3(7, 0, i));
		map.push(vec3(-7, 0, i));
		map.push(vec3(7, 0, -i));
		map.push(vec3(-7, 0, -i));
	}
	for (var i = -7; i < -3; i++) {
		map.push(vec3(i, 0, 14));
		map.push(vec3(i, 0, -14));
		map.push(vec3(-i, 0, 14));
		map.push(vec3(-i, 0, -14));
	}
	for (var i = -4; i < 0; i++) {
		map.push(vec3(i, 0, -10));
		map.push(vec3(i, 0, 10));
		map.push(vec3(-i, 0, -10));
		map.push(vec3(-i, 0, 10));
	}
	for (var i = -18; i < -13; i++) {
		map.push(vec3(i, 0, -7));
		map.push(vec3(i, 0, 7));
		map.push(vec3(-i, 0, -7));
		map.push(vec3(-i, 0, 7));
	}
	for (var i = -19; i < -9; i++) {
		map.push(vec3(16, 0, i));
		map.push(vec3(-16, 0, i));
		map.push(vec3(16, 0, -i));
		map.push(vec3(-16, 0, -i));
	}
	for (var i = -15; i < -10; i++) {
		map.push(vec3(i, 0, 10));
		map.push(vec3(i, 0, -10));
		map.push(vec3(-i, 0, 10));
		map.push(vec3(-i, 0, -10));
	}

}

function getceiling() {
	for (var i = -5; i <= 5; i++) {
		for (var j = -10; j <= 0; j++) {
			ceiling.push(vec3(i, 1, j));
		}
	}
	for (var i = -4; i <= 4; i++) {
		for (var j = -9; j <= -1; j++) {
			ceiling.push(vec3(i, 3, j));
		}
	}

}

var canvas;
var hud;
var ctx;

var AngleX = 0;//鼠标位移
var AngleY = 0;//鼠标位移

var angle_y = 0.0;//鼠标俯仰角度


function draw2D(ctx) {
	ctx.clearRect(0, 0, 460, 100);
	ctx.beginPath();
	ctx.moveTo(220, 10);
	ctx.lineTo(470, 10);
	ctx.lineTo(470, 100);
	ctx.lineTo(220, 100);
	//ctx.lineTo
	ctx.closePath();

	ctx.strokeStyle = 'rgba(255,255,255,1)';
	ctx.stroke();
	ctx.font = '25px"Times New Roman"';
	if (numfire == 30)
		ctx.fillStyle = 'rgba(255,0,0,1)';
	else
		ctx.fillStyle = 'rgba(255,255,255,1)';
	//ctx.fillText('2016030406257',30,50);
	ctx.fillText('子弹:' + numzidan + '/30' + ' ' + '生命' + life_num + '/2', 240, 60);
	ctx.fillStyle = 'rgba(255,0,0,1)';//准心
	ctx.fillText('+', 602, 306);//准心

	ctx.font = '20px"Times New Roman"';
	ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	ctx.fillText('玩家可通过WASD控制', 0, 60);
	ctx.fillText('人物移动：' + 'W : 前进；', 0, 80);
	ctx.fillText('A : 左移；', 100, 100);
	ctx.fillText('S : 后退；', 100, 120);
	ctx.fillText('D : 右移；', 100, 140);

	ctx.fillText('右键可射击!', 0, 180);
	ctx.fillText("勇敢的勇士啊，", 0, 200);
	ctx.fillText("去寻找宝藏吧！", 0, 220);
	ctx.fillText("——One Piece", 80, 240);

}

// 页面加载完成后会调用此函数，函数名可任意(不一定为main)
window.onload = function main() {
	// 获取页面中id为webgl的canvas元素
	canvas = document.getElementById("webgl");
	if (!canvas) { // 获取失败？
		alert("获取canvas元素失败！");
		return;
	}

	hud = document.getElementById("hud");
	ctx = hud.getContext('2d');


	// 利用辅助程序文件中的功能获取WebGL上下文
	// 成功则后面可通过gl来调用WebGL的函数
	gl = WebGLUtils.setupWebGL(canvas, { alpha: false });
	if (!gl) { // 失败则弹出信息
		alert("获取WebGL上下文失败！");
		return;
	}

	/*设置WebGL相关属性*/
	gl.clearColor(0.0, 0.0, 0.5, 1.0); // 设置背景色为蓝色
	gl.enable(gl.DEPTH_TEST);	// 开启深度检测
	gl.enable(gl.CULL_FACE);	// 开启面剔除
	// 设置视口，占满整个canvas
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	/*加载shader程序并为shader中attribute变量提供数据*/
	// 加载id分别为"vertex-shader"和"fragment-shader"的shader程序，
	// 并进行编译和链接，返回shader程序对象program
	program = initShaders(gl, "vertex-shader",
		"fragment-shader");

	programObj = initShaders(gl, "vertex-shader",
		"fragment-shaderNew");

	gl.useProgram(program);	// 启用该shader程序对象 

	// 获取shader中变量位置
	getLocation();

	// 设置投影矩阵：透视投影，根据视口宽高比指定视域体
	var matProj = perspective(35.0, 		// 垂直方向视角
		canvas.width / canvas.height, 	// 视域体宽高比
		0.01, 							// 相机到近裁剪面距离
		100.0);							// 相机到远裁剪面距离
	gl.uniformMatrix4fv(program.u_Projection, false, flatten(matProj));
	gl.uniform1i(program.u_Sampler, 0);

	gl.useProgram(programObj);
	gl.uniformMatrix4fv(programObj.u_Projection, false, flatten(matProj));

	document.onclick = function () {		// 鼠标点击事件
		canvas.requestPointerLock();	// 请求指针锁定
	}
	canvas.onmousemove = function () {
		if (document.pointerLockElement) {// 指针锁定元素
			AngleX = event.movementX;
			AngleY = event.movementY;

			angle_y += AngleY;
			angle_x += AngleX;
			if (angle_y < -30)
				angle_y = -30;
			if (angle_y > 30)
				angle_y = 30;
			angle_x %= 360;

		}
	}

	canvas.onmousedown = function () {
		if (event.button == 0 && numfire < 30) {
			zidanShuzu[numfire].fire = true;

			gunAngle = 20;
		}
	}
	canvas.onmouseup = function () {
		if (event.button == 0 && numfire < 30) {

			numfire++;
			numzidan--;
			gunAngle = 15;
		}
	}

	// 初始化场景中的几何对象
	initObjs();
	initLights();
	Initspecial_Box();
	draw2D(ctx);
	// 进行绘制
	// render();
};

var Camrea = 0;

// 按键响应
window.onkeydown = function () {
	switch (event.keyCode) {
		case 38:	// Up
			matReverse = mult(matReverse, translate(0.0, 0.0, -0.1));
			matCamera = mult(translate(0.0, 0.0, 0.1), matCamera);
			break;
		case 40:	// Down
			matReverse = mult(matReverse, translate(0.0, 0.0, -0.1));
			matCamera = mult(translate(0.0, 0.0, -0.1), matCamera);
			break;
		case 37:	// Left
			matReverse = mult(matReverse, rotateY(1));
			matCamera = mult(rotateY(-1), matCamera);
			break;
		case 39:	// Right
			matReverse = mult(matReverse, rotateY(-1));
			matCamera = mult(rotateY(1), matCamera);
			break;
		case 87:	// W
			keyDown[0] = true;
			break;
		case 83:	// S
			keyDown[1] = true;
			break;
		case 65:	// A
			keyDown[2] = true;
			break;
		case 68:	// D
			keyDown[3] = true;
			break;
		case 32: 	// space
			if (!jumping) {
				jumping = true;
				jumpTime = 0;
			}
			break;
		case 49:
			lights[0].on = !lights[0].on;
			passLightsOn();
			break;
		case 50:
			lights[1].on = !lights[1].on;
			passLightsOn();
			break;
		case 51:
			lights[2].on = !lights[2].on;
			passLightsOn();
			break;
		case 82:
			initZidan();
			break;
		case 81:
			up = true;
			break;
	}
	// 禁止默认处理(例如上下方向键对滚动条的控制)
	event.preventDefault();
	//console.log("%f, %f, %f", matReverse[3], matReverse[7], matReverse[11]);
}

var up = false;

// 按键弹起响应
window.onkeyup = function () {
	switch (event.keyCode) {
		case 87:	// W
			keyDown[0] = false;
			break;
		case 83:	// S
			keyDown[1] = false;
			break;
		case 65:	// A
			keyDown[2] = false;
			break;
		case 68:	// D
			keyDown[3] = false;
			break;
		/* case 81:
			numfire++;
			break; */
		case 81:
			up = false;
			break;
	}
}

// 记录上一次调用函数的时刻
var last = Date.now();

// 根据时间更新旋转角度
function animation() {
	// 计算距离上次调用经过多长的时间
	var now = Date.now();
	var elapsed = (now - last) / 1000.0; // 秒
	last = now;

	// 更新动画状态
	yRot += deltaAngle * elapsed;

	// 防止溢出
	yRot %= 360;

	// 跳跃处理
	jumpTime += elapsed;
	if (jumping) {
		jumpY = initSpeed * jumpTime - 0.5 * g * jumpTime * jumpTime;
		if (jumpY <= 0) {
			jumpY = 0;
			jumping = false;
		}
	}
}

// 更新照相机变换
function updateCamera() {

	matCamera = mult(rotateY(AngleX), matCamera);
	matReverse = mult(matReverse, rotateY(-AngleX));

	matzidan_x = mult(matzidan_x, rotateY(-AngleX));
	if (zidanShuzu[numfire].fire)
		zidanShuzu[numfire].matzidan_x = matzidan_x;
	zidanShuzu[numfire].jumpY = jumpY + matReverse[7];

	AngleX = 0;

	var perCamera = matCamera;
	var perReverse = matReverse;

	// 照相机前进
	if (keyDown[0]) {
		matReverse = mult(matReverse, translate(0.0, 0.0, -0.1));
		matCamera = mult(translate(0.0, 0.0, 0.1), matCamera);
	}

	// 照相机后退
	if (keyDown[1]) {
		matReverse = mult(matReverse, translate(0.0, 0.0, 0.1));
		matCamera = mult(translate(0.0, 0.0, -0.1), matCamera);
	}

	// 照相机左转
	if (keyDown[2]) {
		matReverse = mult(matReverse, translate(-0.1, 0.0, 0.0));
		matCamera = mult(translate(0.1, 0.0, 0.0), matCamera);
	}

	// 照相机右转
	if (keyDown[3]) {
		matReverse = mult(matReverse, translate(0.1, 0.0, 0.0));
		matCamera = mult(translate(-0.1, 0.0, 0.0), matCamera);
	}
	if (zidanShuzu[numfire].fire) {
		zidanShuzu[numfire].x = matReverse[3];
		zidanShuzu[numfire].z = matReverse[11];
		/* if(Math.abs(angle_x)>=90)
			zidanShuzu[numfire].y=angle_y;
		else */
		zidanShuzu[numfire].y = -angle_y;
		zidanShuzu[numfire].x_angle = -angle_x;

	}

	for (var i = 0; i < map.length; i++) {
		var d = Math.sqrt((map[i][0] - matReverse[3]) * (map[i][0] - matReverse[3]) +
			(map[i][2] - matReverse[11]) * (map[i][2] - matReverse[11]));

		if (d <= 0.707 && matReverse[7] <= map[i][1] /* (d1<=1&&d2<=1)||(d3<=1.5) */) {
			matCamera = perCamera;
			matReverse = perReverse;//console.log(d); 
		}
	}


	var d = Math.sqrt((0 - matReverse[3]) * (0 - matReverse[3]) +
		(-1 - matReverse[11]) * (-1 - matReverse[11]));
	//登塔
	if (d <= 1.2 && up&&matReverse[7]<=2&&matReverse[11]>-0.5&&matReverse[3]>-0.2&&matReverse[3]<0.2 ) {
		matReverse = mult(matReverse, translate(0.0, 0.05, 0.0));
		matCamera = mult(translate(0.0, -0.05, 0.0), matCamera);
	}
	//下塔
	if (d >= 1.2 && matReverse[7] >= 0) {
		matReverse = mult(matReverse, translate(0.0, -0.1, 0.0));
		matCamera = mult(translate(0.0, 0.1, 0.0), matCamera);
	}
	if ((matReverse[7] >= 2) && (matReverse[3] > 0.5 || matReverse[3] < -0.5 || matReverse[11] < -1.5)) {

		matCamera = perCamera;
		matReverse = perReverse;
	}

	for (var i = 0; i < ball.length; i++) {
		for (var j = 0; j < map.length; j++) {
			var d = Math.sqrt((ball[i].mat[3] - map[j][0]) * (ball[i].mat[3] - map[j][0]) +
				(ball[i].mat[11] - map[j][2]) * (ball[i].mat[11] - map[j][2]))
			if (d <= 0.9)
				ball[i].peng = true;
		}
	}

	for (var i = 0; i < ball.length; i++) {
		var d = Math.sqrt((ball[i].mat[3] - matReverse[3]) * (ball[i].mat[3] - matReverse[3]) +
			(ball[i].mat[11] - matReverse[11]) * (ball[i].mat[11] - matReverse[11]));
		if (d <= 0.4) {
			ball[i].peng = true;
			Life = false;
			break;
		}
	}
	if (!Life || life_num == 0) {
		alert("YOU DIE!");
		window.location.reload();
		return ;
	}
}

var zidanObj = function () {
	this.matzidan = mat4();
	this.x = 0;//在世界坐标下的位置
	this.z = 0;//在世界坐标下的位置
	this.y = 0;//俯仰角度
	//this.angle_x=0;//
	this.x_angle = 0;//旋转角度
	this.fire = false;//是否发射
	this.matzidan_x = mat4();
	this.locat = vec3(0.0, 0.0, 0.0);
	this.jumpY = 0;
}

var ballObj = function () {
	//this.x=0;
	//this.z=0;
	this.xv = 0.0;
	this.zv = 0.0;
	this.peng = false;
	this.mat = mat4();
	this.rot = 1;
}

var numzidan = 30;//子弹总数
var numfire = 0;//发射的子弹数

var gunAngle = 15;

var matzidan_x = mat4();

var zidanShuzu = [];

var ball = [];
//var zidan=new zidanObj();

function initZidan() {
	zidanShuzu.length = 0;
	for (var i = 0; i < 50; i++) {
		var zidan = new zidanObj();
		zidanShuzu.push(zidan);
	}
	numfire = 0;
	numzidan = 30;
}

function getballObj() {
	var ball1 = new ballObj();
	ball1.mat[3] = -6;//位置-x
	ball1.mat[11] = -15;//位置-z
	ball1.zv = 0.03;
	ball.push(ball1);
	
	var ball2=new ballObj();
	ball2.mat[3] = 5.5;//位置-x
	ball2.mat[11] = -10;//位置-z
	ball2.zv = 0.02;
	ball.push(ball2);
	
	var ball3=new ballObj();
	ball3.mat[3] = -14;//位置-x
	ball3.mat[11] = 8.5;//位置-z
	ball3.xv = 0.05;
	ball.push(ball3);
	
	var ball4=new ballObj();	
	ball4.mat[3] = 13;//位置-x
	ball4.mat[11] = 11;//位置-z
	ball4.xv = 0.07;
	ball.push(ball4);
	
	

}

// 绘制函数
function render() {
	if (!obj.isAllReady(gl) || !obj1.isAllReady(gl) || !box.isAllReady(gl) || !cup.isAllReady(gl)) {
		requestAnimFrame(render);
		return;
	}

	animation(); // 更新动画参数

	updateCamera(); // 更新相机变换
	if (!Life || life_num == 0) return;
	var flagX = random_place[RandomX] > 0 ? matReverse[3] + 1.0 > random_place[RandomX]
		: matReverse[3] - 1.0 < random_place[RandomX];
	var flagZ = random_place[RandomZ] > 0 ? matReverse[11] + 1.0 > random_place[RandomZ]
		: matReverse[11] - 1.0 < random_place[RandomZ];

	if (!toutch.cnt && flagX && flagZ && key_box.pos) {
		toutch.pos = true;
		toutch.cnt = true;
	}

	// 清颜色缓存和深度缓存
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// 模视投影矩阵初始化为投影矩阵*照相机变换矩阵

	var matMV = mult(rotateX(angle_y), mult(translate(0, -jumpY, 0), matCamera));
	var lightPositions = [];
	var matRotatingSphere = mult(matMV, mult(translate(0.0, 2.5, 0.0),
		mult(rotateY(-yRot * 2.0), translate(1.0, 0.0, 0.0))));

	var matRotatingSun = mult(rotateZ(yRot), translate(22.0, 0.0, 0.0));

	lightPositions.push(mult(matMV, lightSun.pos));
	lightPositions.push(mult(matRotatingSphere, lightRed.pos));
	lightPositions.push(lightYellow.pos);

	// 计算用于绘制阴影的投影矩阵
	matShadow = mat4();
	matShadow[13] = 1.0 / (shadowPlaneY - lightPos[1]);
	matShadow[15] = 0;

	gl.useProgram(program);
	gl.uniform4fv(program.u_LightPosition,
		flatten(lightPositions));
	gl.useProgram(programObj);
	gl.uniform4fv(programObj.u_LightPosition,
		flatten(lightPositions));

	gl.useProgram(programObj);

	var mat = mult(translate(0.15, -0.17, -0.4), rotateY(205));
	mat = mult(mat, rotateX(-gunAngle));
	mat = mult(mat, scale(0.01, 0.01, 0.01));
	gl.uniformMatrix4fv(programObj.u_ModelView, false,
		flatten(mat));
	gl.uniformMatrix3fv(programObj.u_NormalMat, false,
		flatten(normalMatrix(mat)));
	obj1.draw(gl, attribIndex, mtlIndex, programObj.u_Sampler);
	
	for (var i = 0; i < special_box.length; i++) {
		if (special_box[i].x == random_place[RandomX] &&
			special_box[i].z == random_place[RandomZ]) {
				 continue;
		}
		var box_X  = special_box[i].x > 0 ? matReverse[3] + 1.0 >= special_box[i].x
										 : matReverse[3] - 1.0 <= special_box[i].x;
		var box_Z = special_box[i].z > 0 ? matReverse[11] + 1.0 >= special_box[i].z
										  : matReverse[11] - 1.0 <= special_box[i].z;
		if (!special_box[i].cnt && box_X && box_Z) {
			life_num--;
			special_box[i].cnt = true;
			matCamera = mult(matCamera, matReverse);
			matReverse = mat4();
			matzidan_x = mat4();
			animation();
			updateCamera();
			requestAnimFrame(render); // 请求重绘
		} else if (!special_box[i].cnt) {
			mvStack.push(matMV);
			matMV = mult(matMV, translate(special_box[i].x, -0.2, special_box[i].z));
			matMV = mult(matMV, scale(0.1, 0.1, 0.1));
			gl.uniformMatrix4fv(programObj.u_ModelView, false, flatten(matMV));
			gl.uniformMatrix3fv(programObj.u_NormalMat, false, flatten(normalMatrix(matMV)));
			box.draw(gl, attribIndex, mtlIndex, programObj.u_Sampler);
			matMV = mvStack.pop();
		}
	}

	mvStack.push(matMV);

	matMV = mult(matMV, translate(random_place[RandomX], -0.2, random_place[RandomZ]));

	if (!toutch.pos) {
		matMV = mult(matMV, scale(0.1, 0.1, 0.1));
		gl.uniformMatrix4fv(programObj.u_ModelView, false,
			flatten(matMV));
		gl.uniformMatrix3fv(programObj.u_NormalMat, false,
			flatten(normalMatrix(matMV)));
		box.draw(gl, attribIndex, mtlIndex, programObj.u_Sampler);
	} else if (key_box.pos && toutch.pos){		
		matMV = mult(matMV, scale(0.001, 0.001, 0.001));
		matMV = mult(matMV, rotateY(yRot * 1.5));
		gl.uniformMatrix4fv(programObj.u_ModelView, false,
			flatten(matMV));
		gl.uniformMatrix3fv(programObj.u_NormalMat, false,
			flatten(normalMatrix(matMV)));
		cup.draw(gl, attribIndex, mtlIndex, program.u_Sampler);
	}
	matMV = mvStack.pop();

	var key_x = matReverse[3] <= key_box.x + 1.0 && matReverse[3] >= key_box.x - 1.0;
	var key_z = matReverse[11] <= key_box.z + 1.0 && matReverse[11] >= key_box.z - 1.0;

	mvStack.push(matMV);
	if (!key_box.pos && key_x && key_z) {
		key_box.pos = true;
		gl.useProgram(program);
		matMV = mult(matMV, translate(key_box.x, -0.2, key_box.z));
		mvStack.push(matMV);
		drawKey(matMV);
	} else if (!key_box.pos) {
		matMV = mult(matMV, translate(key_box.x, -0.2, key_box.z));
		matMV = mult(matMV, scale(0.1, 0.1, 0.1));
		gl.uniformMatrix4fv(programObj.u_ModelView, false,
			flatten(matMV));
		gl.uniformMatrix3fv(programObj.u_NormalMat, false,
			flatten(normalMatrix(matMV)));
		box.draw(gl, attribIndex, mtlIndex, programObj.u_Sampler);
	}
	matMV = mvStack.pop();

	gl.useProgram(programObj);
	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.7, 0.0, 1.0));
	matMV = mult(matMV, scale(0.1, 0.1, 0.1));
	gl.uniformMatrix4fv(programObj.u_ModelView, false,
		flatten(matMV));
	gl.uniformMatrix3fv(programObj.u_NormalMat, false,
		flatten(normalMatrix(matMV)));
	obj.draw(gl, attribIndex, mtlIndex, programObj.u_Sampler);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(-0.7, 0.0, 1.0));
	matMV = mult(matMV, scale(0.1, 0.1, 0.1));
	gl.uniformMatrix4fv(programObj.u_ModelView, false,
		flatten(matMV));
	gl.uniformMatrix3fv(programObj.u_NormalMat, false,
		flatten(normalMatrix(matMV)));
	obj.draw(gl, attribIndex, mtlIndex, programObj.u_Sampler);
	matMV = mvStack.pop();

	gl.useProgram(program);


	for (var i = 0; i < numfire; i++) {
		if (zidanShuzu[i].fire) {
			zidanShuzu[i].matzidan = mult(zidanShuzu[i].matzidan, translate(0.0, 0.0, -0.2));

			mvStack.push(matMV);

			matMV = mult(matMV, translate(zidanShuzu[i].x, zidanShuzu[i].jumpY, zidanShuzu[i].z));
			matMV = mult(matMV, zidanShuzu[i].matzidan_x);
			matMV = mult(matMV, rotateX(zidanShuzu[i].y));
			matMV = mult(matMV, zidanShuzu[i].matzidan);
			matMV = mult(matMV, scale(0.2, 0.2, 0.2));

			var s = Math.abs(zidanShuzu[i].matzidan[11]);
			var x = s * Math.cos(zidanShuzu[i].y) * Math.tan(zidanShuzu[i].x_angle);
			var y = s * Math.sin(zidanShuzu[i].y);
			var z = -s * Math.cos(zidanShuzu[i].x_angle)
			zidanShuzu[i].locat = vec3(x, y, z);

			sphere.draw(matMV);
			matMV = mvStack.pop();
		}
	}
	//绘制天空
	gl.disable(gl.CULL_FACE);//关闭背部剔除
	mvStack.push(matMV);
	matMV = mult(matMV, scale(150.0, 150.0, 150.0)); // 平移到相应位置
	matMV = mult(matMV, rotateX(90)); // 调整南北极
	gl.uniform1i(program.u_bOnlyTexture, 1);//u_bOnlyTexture为1，关闭光照
	//if(Sun.on)
	sphere.draw(matMV, null, skyTexObj);
	//else			
	//	sphere.draw(matMV,null,nightTexObj/* skyTexObj */);
	matMV = mvStack.pop();

	gl.enable(gl.CULL_FACE);//重开背部提出
	gl.uniform1i(program.u_bOnlyTexture, 0);//u_bOnlyTexture为0，开启光照
	/*绘制地面*/
	mvStack.push(matMV);
	// 将地面移到y=-0.4平面上
	matMV = mult(matMV, translate(0.0, -0.4, 0.0));
	ground.draw(matMV);
	matMV = mvStack.pop();

	for (var i = 0; i < map.length; i++) {
		mvStack.push(matMV);
		matMV = mult(matMV, translate(map[i][0], map[i][1], map[i][2]));
		square.draw(matMV);
		matMV = mvStack.pop();
	}

	mvStack.push(matMV);
	matMV = mult(matMV, translate(0, 0, -1));
	drwaWatch(matMV);
	matMV = mvStack.pop();
	
	mvStack.push(matMV);
	matMV = mult(matMV, translate(0, 0, -2.5));
	matMV = mult(matMV, scale(1.0, 1.0, 0.001));
	square.draw(matMV,mtlRedLightOff,mingziObj);
	matMV = mvStack.pop();



	for (var i = 0; i < ball.length; i++) {
		if (ball[i].peng/* ||ball[i].mat[11]>=1||ball[i].mat[11]<=-1 */) {
			ball[i].xv = -ball[i].xv;
			ball[i].zv = -ball[i].zv;
			ball[i].peng = false;
			ball[i].rot = -ball[i].rot;
		}

		ball[i].mat = mult(ball[i].mat, translate(ball[i].xv, 0.0, ball[i].zv));
		mvStack.push(matMV); // 使得下面对球的变换不影响后面绘制的圆环
		// 调整南北极后先旋转再平移
		matMV = mult(matMV, ball[i].mat);
		matMV = mult(matMV, scale(2.0, 2.0, 2.0));
		matMV = mult(matMV, rotateY(90)); // 调整南北极
		if(ball[i].zv==0.0)
			matMV = mult(matMV, rotateY(90)); 
		matMV = mult(matMV, rotateZ(yRot * ball[i].rot));
		
		sphere.draw(matMV, mtlboli, boliTexObj);
		matMV = mvStack.pop();
	}
	draw2D(ctx);

	requestAnimFrame(render); // 请求重绘
}

var squeremat = mat4();
var s_V = 0.01;

//瞭望塔
function drwaWatch(matMV) {
	//柱子
	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.5, 0, 0.5));
	//matMV = mult(matMV, rotateX(90));
	matMV = mult(matMV, scale(0.1, 6.0, 0.1));
	square.draw(matMV);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(-0.5, 0, 0.5));
	matMV = mult(matMV, scale(0.1, 6.0, 0.1));
	square.draw(matMV);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(-0.5, 0, -0.5));
	matMV = mult(matMV, scale(0.1, 6.0, 0.1));
	square.draw(matMV);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.5, 0, -0.5));
	matMV = mult(matMV, scale(0.1, 6.0, 0.1));
	square.draw(matMV);
	matMV = mvStack.pop();
	//栏杆
	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.0, 0.25, -0.5));
	matMV = mult(matMV, scale(1, 0.1, 0.1));
	square.draw(matMV);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.0, 0.75, -0.5));
	matMV = mult(matMV, scale(1, 0.1, 0.1));
	square.draw(matMV);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.0, 0.25, 0.5));
	matMV = mult(matMV, scale(1, 0.1, 0.1));
	square.draw(matMV);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.0, 0.75, 0.5));
	matMV = mult(matMV, scale(1, 0.1, 0.1));
	square.draw(matMV);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.5, 0.75, 0));
	matMV = mult(matMV, scale(0.1, 0.1, 1));
	square.draw(matMV);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.5, 0.25, 0));
	matMV = mult(matMV, scale(0.1, 0.1, 1));
	square.draw(matMV);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(-0.5, 0.75, 0));
	matMV = mult(matMV, scale(0.1, 0.1, 1));
	square.draw(matMV);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(-0.5, 0.25, 0));
	matMV = mult(matMV, scale(0.1, 0.1, 1));
	square.draw(matMV);
	matMV = mvStack.pop();

	for (var i = 0; i < 4; i++) {
		mvStack.push(matMV);
		matMV = mult(matMV, rotateY(90 * i));
		matMV = mult(matMV, translate(-0.5, 0.5, 0));
		matMV = mult(matMV, rotateX(30));
		matMV = mult(matMV, scale(0.1, 0.1, 1));
		square.draw(matMV);
		matMV = mvStack.pop();
	}

	//小屋
	mvStack.push(matMV);
	matMV = mult(matMV, translate(0, 1.5, 0));
	matMV = mult(matMV, scale(1, 0.1, 1));
	square.draw(matMV, null, zhuziObj);
	matMV = mvStack.pop();

	for (var i = 4; i > 1; i--) {
		mvStack.push(matMV);
		matMV = mult(matMV, rotateY(90 * i));
		matMV = mult(matMV, translate(-0.5, 1.7, 0));
		matMV = mult(matMV, scale(0.05, 0.2, 1));
		square.draw(matMV);
		matMV = mvStack.pop();
	}

	mvStack.push(matMV);
	matMV = mult(matMV, translate(0, 3, 0));
	matMV = mult(matMV, scale(1.5, 0.1, 1.4));
	square.draw(matMV, null, zhuziObj);
	matMV = mvStack.pop();

	//梯子
	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.2, 0, 0.6));
	matMV = mult(matMV, scale(0.05, 3.0, 0.05));
	square.draw(matMV);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(-0.2, 0, 0.6));
	matMV = mult(matMV, scale(0.05, 3.0, 0.05));
	square.draw(matMV);
	matMV = mvStack.pop();

	for (var i = 0; i < 1.4; i += 0.2) {
		mvStack.push(matMV);
		matMV = mult(matMV, translate(0.0, i, 0.6));
		matMV = mult(matMV, scale(0.4, 0.05, 0.05));
		square.draw(matMV);
		matMV = mvStack.pop();
	}
}

function drawKey(matMV) {
	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.0, 0.1, 0.0));
	matMV = mult(matMV, scale(0.2, 0.2, 0.2));
	torus.draw(matMV, mtlgold, goldTexObj);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.0, -0.1, 0.0));
	matMV = mult(matMV, scale(0.05, 0.3, 0.03));
	square.draw(matMV, mtlgold, goldTexObj);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.05, -0.15, 0.0));
	matMV = mult(matMV, scale(0.05, 0.03, 0.03));
	square.draw(matMV, mtlgold, goldTexObj);
	matMV = mvStack.pop();

	mvStack.push(matMV);
	matMV = mult(matMV, translate(0.05, -0.2, 0.0));
	matMV = mult(matMV, scale(0.05, 0.03, 0.03));
	square.draw(matMV, mtlgold, goldTexObj);
	matMV = mvStack.pop();
}

