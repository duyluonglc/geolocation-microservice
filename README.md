# Geolocation microservice 
## Installation

0. create mongodb database  and collection with name `geometries`
1. create `2dsphere`e index with field `location`, you can run this command on mongo `db.collection.createIndex( { "location" : "2dsphere" } )`
2. clone this repo
3. cd to this project then run `npm install`
4. config mongodb url at `config/database`
  - url: `mongodb://username:password@localhost:27017/my_database`
  - dbName: `my_database` 
5. config host/port at line 6 of `api/swagger/swagger.yaml`
6. run `npm start` then open swagger url localhost:8888/docs