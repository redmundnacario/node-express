# Places API

Author : **Redmund Nacario**


# Summary
### Branch: part2-error-handling

* error handling middleware added in the main app.js
* error handled per route if the result is empty and then throw error to activate middleware.

### Branch: part3-error-model

* error model added. Class extends Error object

### Branch: part4-controller

* controller folder and files added
* place routes script shortens
* added post request in places routes and teste in postman
* installed uuid for generating unique id
* added error for unsupported routes

### Branch: part5-patch-and-delete

* added patch routes in places
* added delete routes in places 

### Branch: part6-user-auth

* add authentication or user routes

### Branch: part7-input-validators

* added input validators in patch and post api routes in places
  
### Branch: part8-setup-mongoose

* install mongoose, dotenv
* test connection with mongodb

### Branch: part9-mongoose-create-schema-and-model

* created schema and model for place
* creating and storing document to MongoDB
* findById() and find() - for querying
* places.toObject({getters: true}) -converting to JS object
* created formatted logging of request urls


### Branch: part10-patch-delete-and-users-schema

* connect mongoose to patch and delete
* create users schema