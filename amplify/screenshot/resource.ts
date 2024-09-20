import { defineFunction } from "@aws-amplify/backend";
    
export const screenshot = defineFunction({
  name: "screenshot",
  entry: "./handler.ts"
});