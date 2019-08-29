# oauth2-example-app
An example NodeJS application showcasing how to use OfficeRnD identity server to allow organization owners to grant access to their data to 3rd party applications

How to run the app:
* Clone this repo locally
* Run `npm install`
* Open config.ts file
* Replace clientId and clientSecret with the ones that were provided to you. NOTE: Make sure that the application you are using has the following redirect uri registered: `http://localhost:3000/connect/return`
* Build using the following command `tsc -p .`. NOTE: You should have typescript npm module installed globally to use that command.
* run `node server`
* open a browser and navigate to http://localhost:3000
