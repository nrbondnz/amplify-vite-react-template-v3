import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { schema as generatedSqlSchema } from './schema.sql';

// Update to include authorization rules
const sqlSchema = generatedSqlSchema.authorization(allow => [
    allow.authenticated(), // Allow authenticated users to access this schema
]);

// Define the local schema including authorization
const schema = a.schema({
    Todo: a.model({
        content: a.string(),
        isDone: a.boolean(),  // Added isDone field as a boolean
    }).authorization(allow => [
        allow.authenticated(), // Consistent authorization rule for Todo
    ]),
});

// Combine both schemas
const combinedSchema = a.combine([schema, sqlSchema]);

// Update client types
export type Schema = ClientSchema<typeof combinedSchema>;

export const data = defineData({
    schema: combinedSchema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool", // Update default authorization mode
    },
});

/*== STEP 2 ===============================================================
Client generation remains the same
==========================================================================*/