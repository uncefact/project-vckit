# vc-kit-db-init

## Getting started

1. Install appwrite
2. set up a project with web platform
3. set up a api key for the function to use
4. add the id's and key to the config.json and appwrite.json

### Notes:

For the function to run against a local instance you'll need to use your IP address not a localhost for the url.

## 🚀 Deployment Using CLI

Make sure you have [Appwrite CLI](https://appwrite.io/docs/command-line#installation) installed, and you have successfully logged into your Appwrite server. To make sure Appwrite CLI is ready, you can use the command `appwrite client --debug` and it should respond with green text `✓ Success`.

Make sure you are in the same folder as your `appwrite.json` file and run `appwrite deploy function` to deploy your function. You will be prompted to select which functions you want to deploy.

The create deployment can also be used if there is and issues using `appwrite deploy function`:

```
appwrite functions createDeployment --functionId=<id> --entrypoint ./src/index.js --code './functions/vc-kit-db-init/' --activate true
```

## Running the function

Can use the following command to run the function:

`appwrite functions createExecution --functionId=<functionId>`
