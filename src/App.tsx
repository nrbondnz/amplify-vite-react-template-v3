import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

// Lazy-loaded components
const AppContent = React.lazy(() => import("@components/AppContent"));
const FileLoader = React.lazy(() => import("@components/utils/FileLoader"));
const HomePage = React.lazy(() => import("@components/HomePage"));
const AppHomePage = React.lazy(() => import("@components/AppHomePage"));
const FindExerciseCombo = React.lazy(() => import("@components/FindExerciseCombo"));
const ManageSettings = React.lazy(() => import("@components/machines/ManageSettings"));
const ImageSelector = React.lazy(() => import("@components/utils/ImageSelector"));
const MuscleSelectionListWrapper = React.lazy(() => import("@muscle_selection_list_wrapper"));
const ExerciseSelection = React.lazy(() => import("@components/ExerciseSelection"));
const MachineDetails = React.lazy(() => import("@components/MachineDetails"));
const ExerciseDetails = React.lazy(() => import("@components/ExerciseDetails"));
const MuscleDetails = React.lazy(() => import("@components/MuscleDetailsComponent"));
const ListWorkout = React.lazy(() => import("@components/workouts/ListWorkout"));
const NewWorkout = React.lazy(() => import("@components/workouts/NewWorkout"));
const EditWorkout = React.lazy(() => import("@components/workouts/EditWorkout"));
const ListWorkoutExercise = React.lazy(() => import("@components/workoutExercises/ListWorkoutExercise"));
const NewWorkoutExercise = React.lazy(() => import("@components/workoutExercises/NewWorkoutExercise"));
const EditWorkoutExercise = React.lazy(() => import("@components/workoutExercises/EditWorkoutExercise"));
const ListLocation = React.lazy(() => import("@components/locations/ListLocation"));
const NewLocation = React.lazy(() => import("@components/locations/NewLocation"));
const EditLocation = React.lazy(() => import("@components/locations/EditLocation"));
const MachineList = React.lazy(() => import("@components/machines/MachineList"));
const NewMachine = React.lazy(() => import("@components/machines/NewMachine"));
const EditMachine = React.lazy(() => import("@components/machines/EditMachine"));
const ListExercise = React.lazy(() => import("@components/exercises/ListExercise"));
const NewExercise = React.lazy(() => import("@components/exercises/NewExercise"));
const EditExercise = React.lazy(() => import("@components/exercises/EditExercise"));
const ListMuscle = React.lazy(() => import("@components/muscles/ListMuscle"));
const NewMuscle = React.lazy(() => import("@components/muscles/NewMuscle"));
const EditMuscle = React.lazy(() => import("@components/muscles/EditMuscle"));

const App: React.FC = () => {
    return (
        <div>
            <Routes>
                <Route
                    path="/appcontent"
                    element={
                        <Suspense fallback={<div>Loading AppContent...</div>}>
                            <AppContent />
                        </Suspense>
                    }
                />
                <Route
                    path="/fileloader"
                    element={
                        <Suspense fallback={<div>Loading FileLoader...</div>}>
                            <FileLoader pEntityName="machines" />
                        </Suspense>
                    }
                />
                <Route
                    path="/"
                    element={
                        <Suspense fallback={<div>Loading HomePage...</div>}>
                            <HomePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/app"
                    element={
                        <Suspense fallback={<div>Loading AppHomePage...</div>}>
                            <AppHomePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/app/find"
                    element={
                        <Suspense fallback={<div>Loading FindExerciseCombo...</div>}>
                            <FindExerciseCombo />
                        </Suspense>
                    }
                />
                <Route
                    path="/settings/:entityId/:entityType"
                    element={
                        <Suspense fallback={<div>Loading ManageSettings...</div>}>
                            <ManageSettings onSaveRef={React.createRef()} />
                        </Suspense>
                    }
                />
                <Route
                    path="/imageselector"
                    element={
                        <Suspense fallback={<div>Loading ImageSelector...</div>}>
                            <ImageSelector alt="machines" />
                        </Suspense>
                    }
                />
                <Route
                    path="/app/find/muscles-selection/muscles/:muscleId"
                    element={
                        <Suspense fallback={<div>Loading MuscleSelectionListWrapper...</div>}>
                            <MuscleSelectionListWrapper />
                        </Suspense>
                    }
                />
                <Route
                    path="/app/find/exercises-selection/:entityType/:entityId"
                    element={
                        <Suspense fallback={<div>Loading ExerciseSelection...</div>}>
                            <ExerciseSelection />
                        </Suspense>
                    }
                />
                <Route
                    path="/combo-details/machines/:id"
                    element={
                        <Suspense fallback={<div>Loading MachineDetails...</div>}>
                            <MachineDetails />
                        </Suspense>
                    }
                />
                <Route
                    path="/combo-details/exercises/:id"
                    element={
                        <Suspense fallback={<div>Loading ExerciseDetails...</div>}>
                            <ExerciseDetails />
                        </Suspense>
                    }
                />
                <Route
                    path="/combo-details/muscles/:id"
                    element={
                        <Suspense fallback={<div>Loading MuscleDetails...</div>}>
                            <MuscleDetails />
                        </Suspense>
                    }
                />
                <Route
                    path="/workouts"
                    element={
                        <Suspense fallback={<div>Loading ListWorkout...</div>}>
                            <ListWorkout />
                        </Suspense>
                    }
                />
                <Route
                    path="/workouts/new"
                    element={
                        <Suspense fallback={<div>Loading NewWorkout...</div>}>
                            <NewWorkout />
                        </Suspense>
                    }
                />
                <Route
                    path="/workouts/:id"
                    element={
                        <Suspense fallback={<div>Loading EditWorkout...</div>}>
                            <EditWorkout />
                        </Suspense>
                    }
                />
                <Route
                    path="/workoutExercises"
                    element={
                        <Suspense fallback={<div>Loading ListWorkoutExercise...</div>}>
                            <ListWorkoutExercise />
                        </Suspense>
                    }
                />
                <Route
                    path="/workoutExercises/new"
                    element={
                        <Suspense fallback={<div>Loading NewWorkoutExercise...</div>}>
                            <NewWorkoutExercise />
                        </Suspense>
                    }
                />
                <Route
                    path="/workoutExercises/:id"
                    element={
                        <Suspense fallback={<div>Loading EditWorkoutExercise...</div>}>
                            <EditWorkoutExercise />
                        </Suspense>
                    }
                />
                <Route
                    path="/locations"
                    element={
                        <Suspense fallback={<div>Loading ListLocation...</div>}>
                            <ListLocation />
                        </Suspense>
                    }
                />
                <Route
                    path="/locations/new"
                    element={
                        <Suspense fallback={<div>Loading NewLocation...</div>}>
                            <NewLocation />
                        </Suspense>
                    }
                />
                <Route
                    path="/locations/:id"
                    element={
                        <Suspense fallback={<div>Loading EditLocation...</div>}>
                            <EditLocation />
                        </Suspense>
                    }
                />
                <Route
                    path="/machines"
                    element={
                        <Suspense fallback={<div>Loading MachineList...</div>}>
                            <MachineList />
                        </Suspense>
                    }
                />
                <Route
                    path="/machines/new"
                    element={
                        <Suspense fallback={<div>Loading NewMachine...</div>}>
                            <NewMachine />
                        </Suspense>
                    }
                />
                <Route
                    path="/machines/:id"
                    element={
                        <Suspense fallback={<div>Loading EditMachine...</div>}>
                            <EditMachine />
                        </Suspense>
                    }
                />
                <Route
                    path="/exercises"
                    element={
                        <Suspense fallback={<div>Loading ListExercise...</div>}>
                            <ListExercise />
                        </Suspense>
                    }
                />
                <Route
                    path="/exercises/new"
                    element={
                        <Suspense fallback={<div>Loading NewExercise...</div>}>
                            <NewExercise />
                        </Suspense>
                    }
                />
                <Route
                    path="/exercises/:id"
                    element={
                        <Suspense fallback={<div>Loading EditExercise...</div>}>
                            <EditExercise />
                        </Suspense>
                    }
                />
                <Route
                    path="/muscles"
                    element={
                        <Suspense fallback={<div>Loading ListMuscle...</div>}>
                            <ListMuscle />
                        </Suspense>
                    }
                />
                <Route
                    path="/muscles/new"
                    element={
                        <Suspense fallback={<div>Loading NewMuscle...</div>}>
                            <NewMuscle />
                        </Suspense>
                    }
                />
                <Route
                    path="/muscles/:id"
                    element={
                        <Suspense fallback={<div>Loading EditMuscle...</div>}>
                            <EditMuscle />
                        </Suspense>
                    }
                />
            </Routes>
        </div>
    );
};
export default App;