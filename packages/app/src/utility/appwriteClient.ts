import { Account, Appwrite, Storage } from "@refinedev/appwrite";

const APPWRITE_URL = "https://admin.vckit.io/v1";
const APPWRITE_PROJECT = "63e9a3cad8d5d694e3d0";

const appwriteClient = new Appwrite();

appwriteClient.setEndpoint(APPWRITE_URL).setProject(APPWRITE_PROJECT);
const account = new Account(appwriteClient);
const storage = new Storage(appwriteClient);

export { appwriteClient, account, storage };
