// src/App.tsx
import EditExercise from "@components/exercises/EditExercise";
import ListExercise from "@components/exercises/ListExercise";
import NewExercise from "@components/exercises/NewExercise";
import { FindExerciseCombo } from "@components/FindExerciseCombo";
import HomePage from "@components/HomePage";
import EditLocation from "@components/locations/EditLocation";
import ListLocation from "@components/locations/ListLocation";
import { NewLocation } from "@components/locations/NewLocation";
import EditMachine from "@components/machines/EditMachine";
import MachineList from "@components/machines/MachineList";
import ManageSettings from "@components/machines/ManageSettings";
import NewMachine from "@components/machines/NewMachine";
import EditMuscle from "@components/muscles/EditMuscle";
import ListMuscle from "@components/muscles/ListMuscle";
import NewMuscle from "@components/muscles/NewMuscle";
import FileLoader from "@components/utils/FileLoader";
import ImageSelector from "@components/utils/ImageSelector";
import EditWorkoutExercise
    from "@components/workoutExercises/EditWorkoutExercise";
import ListWorkoutExercise
    from "@components/workoutExercises/ListWorkoutExercise";
import NewWorkoutExercise
    from "@components/workoutExercises/NewWorkoutExercise";
import EditWorkout from "@components/workouts/EditWorkout";
import ListWorkout from "@components/workouts/ListWorkout";
import NewWorkout from "@components/workouts/NewWorkout";
//import { useSubscription } from "@context/SubscriptionContext";
import { Amplify } from "aws-amplify";
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppHomePage from "@components/AppHomePage";


import AppContent from "@components/AppContent";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);
const App: React.FC = () => {
    //const {lastEvent} = useSubscription();
    return (
        <div>
            <Routes>
                <Route path="/appcontent" element={<AppContent />} />
                <Route path="/fileloader" element={<FileLoader pEntityName="machines" />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/app" element={<AppHomePage />} />
                <Route path="/app/find" element={<FindExerciseCombo />} />
                <Route path="/settings/:entityId/:entityType" element={<ManageSettings onSaveRef={React.createRef()} />} />
                <Route path="/imageselector" element={<ImageSelector alt="machines" />} />

                <Route path="/workouts" element={<ListWorkout />} />
                <Route path="/workouts/new" element={<NewWorkout />} />
                <Route path="/workouts/:id" element={<EditWorkout />} />
                <Route path="/workout_exercises" element={<ListWorkoutExercise />} />
                <Route path="/workout_exercises/new" element={<NewWorkoutExercise />} />
                <Route path="/workout_exercises/:id" element={<EditWorkoutExercise />} />
                <Route path="/locations" element={<ListLocation />} />
                <Route path="/locations/new" element={<NewLocation loading={false} />} />
                <Route path="/locations/:id" element={<EditLocation />} />
                <Route path="/muscles" element={<ListMuscle />} />
                <Route path="/muscles/new" element={<NewMuscle />} />
                <Route path="/muscles/:id" element={<EditMuscle />} />
                <Route path="/exercises" element={<ListExercise />} />
                <Route path="/exercises/new" element={<NewExercise />} />
                <Route path="/exercises/:id" element={<EditExercise />} />*/
                <Route path="/machines" element={<MachineList />} />
                <Route path="/machines/new" element={<NewMachine />} />
                <Route path="/machines/:id" element={<EditMachine />} />

            </Routes>
        </div>
    );
};

export default App;