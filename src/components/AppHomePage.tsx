import { useSubscription } from "@context/SubscriptionContext";
import { AppEvent } from "@shared/types/types";
import { Amplify } from "aws-amplify";
import React from "react";
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

const AppHomePage: React.FC = () => {
	const { addCustomEvent } = useSubscription();

	console.log("AppHomePage component is rendering");

	const handleWorkout = () => {
		const event: AppEvent = {
			entity: "workouts",
			entityId: 0,
			actionType: 'LIST_REQUEST',
			pageType: 'APPHOME'
		};
		addCustomEvent(event);
	};

	const handleTodaysWorkout = () => {
		const event: AppEvent = {
			entity: "todaysWorkout",
			entityId: 0,
			actionType: 'START_WORKOUT',
			pageType: 'APPHOME'
		};
		addCustomEvent(event);
	};

	const handleFindExercises = () => {
		const event: AppEvent = {
			entity: "not set",
			entityId: 0,
			actionType: 'FIND_REQUEST',
			pageType: 'APPHOME'
		};
		addCustomEvent(event);
	};

	function handleHome() {
		const event: AppEvent = {
			entity: "not set",
			entityId: 0,
			actionType: 'LIST_REQUEST',
			pageType: 'APPHOME'
		};
		addCustomEvent(event);
	}

	return (
		<div>
			<h1>MyGym</h1>
			<div>
				<button onClick={handleHome}>Home</button>
				<button onClick={handleWorkout}>My Workouts</button>
				<button onClick={handleTodaysWorkout}>Lets do it</button>
				<button onClick={handleFindExercises}>Lookup exercises</button>
			</div>
		</div>
	);
};

export default AppHomePage;