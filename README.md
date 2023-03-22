

To start the api you need to config the .env file, you can use the .env.example as an exemple.

then you have to upload the Database, you can do this using the command below, to create a Mysql Container:
docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql

To start the api:
npm run dev

To start the front:
npm start


