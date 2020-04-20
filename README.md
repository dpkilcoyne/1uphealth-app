# 1upHealth $everything Application

## Setup
1. Create an application from the [1upHealth Dev Console](https://1up.health/devconsole/). Use `http://localhost:8000` for the app's redirect URL and save the client secret as it will only be shown once.


2. Clone the repo:
```
cd ~/
git clone https://github.com/dpkilcoyne/1uphealth-app.git
```


3. Setup your MongoDB service. This demo was deployed with MongoDB Atlas. To deploy with Atlas:
  1. Go to the [Get Started with Atlas](https://docs.atlas.mongodb.com/getting-started/) web page and follow the **Create an Atlas Account** through **Create a Database User for Your Cluster** using the Free Tier choices and a user with admin or R+W privileges.
  2. Select **Connect** from the **Clusters** view and choose the **Connect Your Application** connection method.
  3. Copy the connection string and replace `test` with `oneup` (the database name) and `<PASSWORD>` with your username password. This will serve as your `MONGODB_URL`.


4. Create a `.env` file in the root directory of the project and add your:
```
ONEUP_WEBAPP_CLIENTID="clientid"
ONEUP_WEBAPP_CLIENTSECRET="clientsecret"
MONGODB_URL="mongodb_url"
PORT="proxyserverport"
```


5. The demo deploy uses [concurrently](https://www.npmjs.com/package/concurrently) to run a React app with a Node.js server proxy.  The server proxy url is stored under `package.json`: `proxy` and the React port is specified at `package.json`:`scripts.start` if you need to modify them.


6. Install & run the app
```
npm install
npm run dev
```


## Test Health Systems
You can test the demo web app with one of these [FHIR health system accounts](https://1up.health/dev/doc/fhir-test-credentials). The current deployment has only been tested with the Epic credentials. Use:
* username: fhirjason
* password: epicepic1

when you are directed to the 1upHealth portal after entering your username from the application.

## Future Improvements
* Resources tables are currently created on the fly. Their object models are specified on 1upHealth so this information could be used to create normalized tables.
* Need to handle passwords and user sessions
* Add nested tables and JSON trees
* Queries and filtering
* Support for other EHR portals
