cd bundle

IF NOT EXIST programs/server/node_modules (
	cd programs/server
	npm install
	cd ..	
)

IF EXIST C:\"Program Files"\MongoDB\Server\3.4\bin (
	start CMD /k C:\"Program Files"\MongoDB\Server\3.2\bin\mongod --storageEngine=mmapv1 --port 27000 --dbpath %CD:~0,3%\QLVB\MongoDB\db
   
) ELSE (
	start CMD /k C:\"Program Files (x86)"\MongoDB\Server\3.2\bin\mongod --storageEngine=mmapv1 --port 27000 --dbpath %CD:~0,3%\QLVB\MongoDB\db
)


cd\

IF NOT EXIST /FileUploaded (
	mkdir FileUploaded	
)

IF NOT EXIST /FileUploaded/vbdi (
	cd FileUploaded
	mkdir vbdi
	cd ..
)
IF NOT EXIST /FileUploaded/vbden (
	cd FileUploaded
	mkdir vbden
	cd ..
)

cd QLVB\bundle

set MONGO_URL=mongodb://localhost:27000/QLVB
set BIND_IP=0.0.0.0
set ROOT_URL=http://localhost
set PORT=80

node main.js