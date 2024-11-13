import React, { useEffect } from "react";
import { useSubscription } from "@context/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

const AppContent: React.FC = () => {
	const { lastEvent } = useSubscription();
	const navigate = useNavigate();

	console.log('AppContent', lastEvent);

	useEffect(() => {
		console.log("AppContent useEffect");
		if (lastEvent?.entity && lastEvent?.actionType) {
			console.log(`Last Event: ${lastEvent.entity} - ${lastEvent.actionType}`);
			if (lastEvent.actionType === "EDIT_REQUEST") {
				const path = `/${lastEvent.entity}/${lastEvent.entityId}`;
				console.log(`Path: ${path}`);
				navigate(path);
				return;
			} else if (lastEvent.actionType === "NEW_REQUEST") {
				const path = `/${lastEvent.entity}/new`;
				console.log(`Path: ${path}`);
				navigate(path);
				return;
			} else if (lastEvent.actionType === "CANCEL_REQUEST") {
				// just list gor now
				navigate(`/${lastEvent.entity}`);
			}
			// otherwise for now go to entity list
			const path = `/${lastEvent.entity}`;
			console.log(`Path: ${path}`);
			navigate(path);
		}
	}, [lastEvent, navigate]);

	return <div>App Content Component</div>;
};

export default AppContent;