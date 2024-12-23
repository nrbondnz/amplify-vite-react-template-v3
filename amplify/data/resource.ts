import { type ClientSchema, defineData } from "@aws-amplify/backend";
import { schema as generatedSqlSchema } from './schema.sql';  //' +
//' Ensure schema-simple contains the appropriate schema export

// Update to include any existing authorization rules from schema-simple
const sqlSchema = generatedSqlSchema.authorization(allow => [
    allow.authenticated(), // Keeping consistent with schema file's
    // authorization rules
]);

// Local schema extended with integration of the provided models
/*
const localSchema = a.schema({
    "actionStates": a.model({
        id: a.integer().required(),
        LOADED: a.string().required(),
        appPage: a.string(),
        appCommand: a.string(),
        entityId: a.integer(),
        entityName: a.string(),
        parentId: a.integer(),
        parentName: a.string()
    }).identifier(["id"]),

    "entityRelationships": a.model({
        id: a.integer().required(),
        exerciseId: a.integer(),
        muscleId: a.integer(),
        machineId: a.integer(),
        entityName: a.string(),
        extraDetails: a.string()
    }).identifier(["id"]),

    "exercises": a.model({
        id: a.integer().required(),
        entityName: a.string().required(),
        idMachine: a.integer(),
        displayNum: a.integer(),
        description: a.string().required(),
        idUser: a.integer(),
        fame: a.integer()
    }).identifier(["id"]),

    "locations": a.model({
        id: a.integer().required(),
        entityName: a.string()
    }).identifier(["id"]),

    "machines": a.model({
        id: a.integer().required(),
        entityName: a.string().required(),
        displayNum: a.integer().required(),
        idLocation: a.integer().required()
    }).identifier(["id"]),

    "muscles": a.model({
        id: a.integer().required(),
        entityName: a.string().required(),
        description: a.string().required(),
        displayNum: a.integer().required(),
        muscleFunction: a.string(),
        idParent: a.integer(),
        parentName: a.string()
    }).identifier(["id"]),

    "sessionWorkoutExercises": a.model({
        id: a.integer().required(),
        idSessionWorkout: a.integer().required(),
        idExercise: a.integer(),
        entityName: a.string()
    }).identifier(["id"]),

    "sessionWorkouts": a.model({
        id: a.integer().required(),
        idUser: a.integer().required(),
        idWorkout: a.integer().required(),
        complete: a.integer(),
        entityName: a.string()
    }).identifier(["id"]),

    "settings": a.model({
        id: a.integer().required(),
        value: a.string(),
        entityId: a.integer(),
        entityType: a.string(),
        entityName: a.string()
    }).identifier(["id"]),

    "userDetails": a.model({
        id: a.integer().required(),
        name: a.string().required(),
        email: a.string().required(),
        phoneNumber: a.string(),
        idLocation: a.integer().required(),
        roles: a.json().required()
    }).identifier(["id"]),

    "workoutExercises": a.model({
        id: a.integer().required(),
        entityName: a.string().required(),
        idUser: a.integer().required(),
        idWorkout: a.integer().required(),
        idMachine: a.integer().required(),
        idExercise: a.integer().required(),
        max: a.string().required()
    }).identifier(["id"]),

    "workouts": a.model({
        id: a.integer().required(),
        idUser: a.integer().required(),
        entityName: a.string().required()
    }).identifier(["id"]),


}).authorization(allow => [allow.authenticated()]);
*/

// Define the combined schema with authorization
//const combinedSchema = a.combine([localSchema]);

// Update client types
export type Schema = ClientSchema<typeof sqlSchema>;

export const data = defineData({
    schema: sqlSchema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool",
    },
});