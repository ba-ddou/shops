# Shops


## Functional spec
Shops is an app that lists shops nearby

  - As a User, I can sign up using my email & password
  - As a User, I can sign in using my email & password
  - As a User, I can display the list of shops sorted by distance
  - As a User, I can like a shop, so it can be added to my preferred shops
      - liked shops shouldn’t be displayed on the main page
  - As a User, I can dislike a shop, so it won’t be displayed within “Nearby Shops” list during the next 2 hours
  - As a User, I can display the list of preferred shops
  - As a User, I can remove a shop from my preferred shops list


## Technologies used
  - Backend : Node.js
  - Frontend : React.js
  - Database : MongoDB


## Getting started
  Download Application's source repository , or clone it using Git: 
```
git clone https://github.com/ba-ddou/shops.git
```
### Dependencies
  The application is split between a client app and an api, each one manages its own dependencies.
  
```
>npm install
>cd client
>npm install
```

### Run the app
  before running the app, you need to create an empty directory in the shops root directory for the MongoDb instance.

```
>mkdir data
```
  Make sure that the MongoDb is installed on your machine and that the /bin directory is added to path, for **mongod** to be accessible from any directory

#### the api server
  Make sure node is installed on your machine then run the following command in shops root directory

```
>npm start
```

#### the client server
  To be able to test the application on mobile (which this kind of app is best suited for) in a local network, the client server must support HTTPS

  Run the following command in client directory

```
>cd client
>($env:HTTPS="true") -and (npm start)
```
  Note that the terminal used in developement is Windows powershell