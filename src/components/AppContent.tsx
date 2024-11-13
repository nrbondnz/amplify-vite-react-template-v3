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

	// makes all events cause a navigate to /entity which is list
	useEffect(() => {
		if (lastEvent) {
			console.log(`Last Event: ${lastEvent.entity} - ${lastEvent.actionType}`);
			navigate(`/${lastEvent.entity}`);
		}
	}, [lastEvent, navigate]);

	return <div>App Content Component</div>;
};

export default AppContent;