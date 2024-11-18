// src/App.tsx
import AppHomePage from "@components/AppHomePage";
import EditExercise from "@components/exercises/EditExercise";
import ListExercise from "@components/exercises/ListExercise";
import NewExercise from "@components/exercises/NewExercise";
import ManageSettings from "@components/machines/ManageSettings";
import FileLoader from "@components/utils/FileLoader";
import EditWorkoutExercise
    from "@components/workoutExercises/EditWorkoutExercise";
import ListWorkoutExercise
    from "@components/workoutExercises/ListWorkoutExercise";
import NewWorkoutExercise
    from "@components/workoutExercises/NewWorkoutExercise";
import EditWorkout from "@components/workouts/EditWorkout";
import ListWorkout from "@components/workouts/ListWorkout";
import NewWorkout from "@components/workouts/NewWorkout";
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSubscription } from "@context/SubscriptionContext";
import HomePage from './components/HomePage';
import EditMachine from "@components/machines/EditMachine";
import NewMachine from "@components/machines/NewMachine";
import MachineList from "@components/machines/MachineList";
import EditMuscle from "@components/muscles/EditMuscle";
import ListMuscle from "@components/muscles/ListMuscle";
import NewMuscle from "@components/muscles/NewMuscle";
import NewLocation from "./components/locations/NewLocation";
import ListLocation from "./components/locations/ListLocation";
import EditLocation from './components/locations/EditLocation';
import AppContent from "@components/AppContent";

const App: React.FC = () => {
    const { lastEvent } = useSubscription();
    const [navigateToAppContent, setNavigateToAppContent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (lastEvent) {
            setNavigateToAppContent(true);
        }
    }, [lastEvent]);

    useEffect(() => {
        if (navigateToAppContent) {
            navigate("/appcontent");
            setNavigateToAppContent(false); // Reset state after navigation
        }
    }, [navigateToAppContent, navigate]);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/app" element={<AppHomePage />} />

            <Route path="/workouts" element={<ListWorkout />} />
            <Route path="/workouts/new" element={<NewWorkout />} />
            <Route path="/workouts/:id" element={<EditWorkout />} />
            <Route path="/workout_exercises" element={<ListWorkoutExercise />} />
            <Route path="/workout_exercises/new" element={<NewWorkoutExercise />} />
            <Route path="/workout_exercises/:id" element={<EditWorkoutExercise />} />
            
            <Route path="/locations" element={<ListLocation />} />
            <Route path="/locations/new" element={<NewLocation />} />
            <Route path="/locations/:id" element={<EditLocation />} />
            <Route path="/muscles" element={<ListMuscle />} />
            <Route path="/muscles/new" element={<NewMuscle />} />
            <Route path="/muscles/:id" element={<EditMuscle />} />
            <Route path="/exercises" element={<ListExercise />} />
            <Route path="/exercises/new" element={<NewExercise />} />
            <Route path="/exercises/:id" element={<EditExercise />} />
            <Route path="/machines" element={<MachineList />} />
            <Route path="/machines/new" element={<NewMachine />} />
            <Route path="/machines/:id" element={<EditMachine />} />
            <Route path="/settings/:entityId/:entityType" element={<ManageSettings onSaveRef={React.createRef()} />} />
            <Route path="/appcontent" element={<AppContent />} />
            <Route path="/fileloader" element={<FileLoader pEntityName="machines"/>} />
        </Routes>
    );
};

export default App;