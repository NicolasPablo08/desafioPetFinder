import "dotenv/config";
import { algoliasearch } from "algoliasearch";

const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_API_KEY;

export const client = algoliasearch(appId, apiKey);
