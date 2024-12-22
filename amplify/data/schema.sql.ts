/* eslint-disable */
/* THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY. */
import { a } from "@aws-amplify/data-schema";
import { configure } from "@aws-amplify/data-schema/internals";
import { secret } from "@aws-amplify/backend";

export const schema = configure({
    database: {
        identifier: "ID0a3F1CxY6MivZQnZHByfbA",
        engine: "mysql",
        connectionUri: secret("SQL_CONNECTION_STRING"),
    }
}).schema({
    "locations": a.model({
        id: a.integer().required(),
        entityName: a.string()
    }).identifier([
        "id"
    ]),
    "machines": a.model({
        id: a.integer().required(),
        entityName: a.string().required(),
        displayNum: a.integer().required(),
        idLocation: a.integer().required(),
        description: a.string()
    }).identifier([
        "id"
    ]),
    "userDetails": a.model({
        id: a.integer().required(),
        name: a.string().required(),
        email: a.string().required(),
        phoneNumber: a.string(),
        idLocation: a.integer().required(),
        roles: a.json().required()
    }).identifier([
        "id"
    ]),
    "workouts": a.model({
        id: a.integer().required(),
        idUser: a.string().required(),
        entityName: a.string().required()
    }).identifier([
        "id"
    ]),
    "sessionWorkouts": a.model({
        id: a.integer().required(),
        idUser: a.string().required(),
        idWorkout: a.integer().required(),
        complete: a.integer(),
        entityName: a.string()
    }).identifier([
        "id"
    ]),
    "workoutExercises": a.model({
        id: a.integer().required(),
        entityName: a.string().required(),
        idUser: a.string().required(),
        idWorkout: a.integer().required(),
        idMachine: a.integer().required(),
        idExercise: a.integer().required(),
        max: a.string().required()
    }).identifier([
        "id"
    ]),
    "actionStates": a.model({
        id: a.integer().required(),
        LOADED: a.string().required(),
        appPage: a.string(),
        appCommand: a.string(),
        entityId: a.integer(),
        entityName: a.string(),
        parentId: a.integer(),
        parentName: a.string()
    }).identifier([
        "id"
    ]),
    "muscles": a.model({
        id: a.integer().required(),
        entityName: a.string().required(),
        description: a.string().required(),
        displayNum: a.integer().required(),
        muscleFunction: a.string(),
        idParent: a.integer(),
        parentName: a.string()
    }).identifier([
        "id"
    ]),
    "settings": a.model({
        id: a.integer().required(),
        value: a.string(),
        entityId: a.integer(),
        entityType: a.string(),
        entityName: a.string()
    }).identifier([
        "id"
    ]),
    "exercises": a.model({
        id: a.integer().required(),
        entityName: a.string().required(),
        idMachine: a.integer(),
        displayNum: a.integer(),
        description: a.string(),
        idUser: a.string(),
        fame: a.integer()
    }).identifier([
        "id"
    ]),
    "sessionWorkoutExercises": a.model({
        id: a.integer().required(),
        idSessionWorkout: a.integer().required(),
        idExercise: a.integer(),
        entityName: a.string()
    }).identifier([
        "id"
    ]),
    "entityRelationships": a.model({
        id: a.integer().required(),
        exerciseId: a.integer().required(),
        muscleId: a.integer().required(),
        machineId: a.integer().required(),
        entityName: a.string().required(),
        extraDetails: a.string()
    }).identifier([
        "id"
    ])
});
