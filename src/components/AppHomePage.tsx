import { useSubscription } from "@context/SubscriptionContext";
import { AppEvent } from "@shared/types/types";
import { Amplify } from "aws-amplify";
import React from "react";
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

const AppHomePage: React.FC = () => {
	const { addCustomEvent } = useSubscription();

	const handleWorkout = () => {
		const event: AppEvent = {
			entity: "workouts",
			actionType: 'LIST_REQUEST',
			pageType: 'APPHOME'
		};
		addCustomEvent(event);
	};

	const handleTodaysWorkout = () => {
		const event: AppEvent = {
			entity: "todaysWorkout",
			actionType: 'START_WORKOUT',
			pageType: 'APPHOME'
		};
		addCustomEvent(event);
	};

	const handleFindExercises = () => {
		const event: AppEvent = {
			entity: "exercises",
			actionType: 'FIND_REQUEST',
			pageType: 'APPHOME'
		};
		addCustomEvent(event);
	};

	return (
		<div>
			<h1>MyGym</h1>
			<div>
				<button onClick={handleWorkout}>Workouts</button>
				<button onClick={handleTodaysWorkout}>Lets do it</button>
				<button onClick={handleFindExercises}>Lookup exercises</button>
			</div>
		</div>
	);
};

export default AppHomePage;