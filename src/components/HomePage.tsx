import AppContent from "@components/AppContent";
import { useSubscription } from "@context/SubscriptionContext";
import { AppEvent, EntityTypes } from "@shared/types/types";
import { Amplify } from "aws-amplify";
//import { AppConfig } from "aws-sdk";
import React from "react";
import outputs from '../../amplify_outputs.json';
//import { getUrl } from 'aws-amplify/storage';

Amplify.configure(outputs);

const HomePage: React.FC = () => {
	const { addCustomEvent, lastEvent } = useSubscription();

	const handleGotoPage = (page: EntityTypes) => () => {
		const event: AppEvent = {
			entity: page,
			entityId: 0,
			actionType: 'LIST_REQUEST',
			pageType: 'HOME'
		};
		addCustomEvent(event);
	};

	const handleGotoApp = () => {
		const event: AppEvent = {
			entity: 'not set22',
			entityId: 0,
			actionType: 'APP_REQUEST',
			pageType: 'CONTROL'
		};
		addCustomEvent(event);
	};

	return (

		<div>
			<h1>Home Page 2</h1>
			{!lastEvent && <AppContent/>}
			{Object.values(EntityTypes).map((entityType) => (
				<div key={entityType} onClick={handleGotoPage(entityType as EntityTypes)} style={{ cursor: 'pointer', margin: '5px 0' }}>
					{entityType}
				</div>
			))}
			<button onClick={handleGotoApp}>App Home</button>
		</div>
	);
};

export default HomePage;