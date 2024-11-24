import { defineBackend } from '@aws-amplify/backend';
import { storage } from "./storage/resource";
//import { storage } from "./storage/resource";
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data,
  storage
});

backend.addOutput({
  storage: {
    bucket_name: "my-app-bucket007"
  }});
