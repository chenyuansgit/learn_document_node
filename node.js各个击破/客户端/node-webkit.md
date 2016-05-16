# NW.JS 程序打包
1.下载node-webkit源码

	https://github.com/nwjs/nw.js

2.将nwjs命令设置别名

	vi ~/.bash_profile
	**
	alias nw="/Users/chenyuan/Documents/code/sourceCode/nwjs-v0.14.3-osx-x64/	nwjs.app/Contents/MacOS/nwjs"
	**
	source ~/.bash_profile

2.在文件夹下新建test目录
  nwjs-v0.14.3-osx-x64
  	- nwjs
  	- credits.html
  	- test
3.编辑文件
	
	test/index.html   
	**
	<!DOCTYPE html>
	<html>
	<head>
  		<title>Context Menu</title>
	</head>
	<body style="width: 100%; height: 100%;">
		<p>Hello, NW.JS!</p>
		<script>
		</script>  
	</body>
	</html>
	**
	
	test/package.json
	**
	{
  		"name": "nw-demo",
  		"version": "0.0.1",
  		"main": "index.html"
	}
	**
4.运行程序

	nwjs.app/Contents/MacOS/nwjs  ./test

5.打包程序1

	进入test目录，选中index.html package.json  压缩为test.zip
	重命名test.zip 为test.nw

6.测试运行程序

	nwjs.app/Contents/MacOS/nwjs  ./test/test.nw

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

7.打包程序2:双击启动

	拷贝源码以供压缩
	cp -R ./nwjs.app/   app.app
	将上一步的压缩程序拷贝到目标文件中
	cp -R /test/test.nw     app.app/Contents/Resources/
	压缩文件
	zip -R  app.app/Contents/Resources/app.nw    *

8.运行程序
	输入命令 open app.app
	或双击app.app即可打开程序
	
＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
