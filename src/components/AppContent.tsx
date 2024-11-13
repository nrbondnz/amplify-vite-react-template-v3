// src/components/AppContent.tsx
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
		console.log("AppContent useEffect")
		if (lastEvent?.entity && lastEvent?.actionType) {
			console.log(`Last Event: ${lastEvent.entity} - ${lastEvent.actionType}`);
			if (lastEvent.actionType === "EDIT_REQUEST"){
				navigate('${lastEvent.entity}/edit/${lastEvent.id}');
			} else if (lastEvent.actionType = "NEW_REQUEST"){
				navigate('${lastEvent.entity}/new');
			}
			// otherwise for now goto entity list
			navigate(`/${lastEvent.entity}`);
		}
	}, [lastEvent, navigate]);

	return <div>App Content Component</div>;
};

export default AppContent;