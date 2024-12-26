import React, { useEffect } from "react";
import { useSubscription } from "@context/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

const AppContent: React.FC = () => {
	const { lastEvent } = useSubscription();
	const navigate = useNavigate();

	console.log("AppContent", lastEvent);

	useEffect(() => {
		if (!lastEvent?.actionType) {
			console.error("No last event or actionType");
			navigate('/');
			return;
		}

		console.log("AppContent useEffect : ", lastEvent);

		// Define navigation logic by pageType and actionType
		const handleNavigation = (pageType: string, actionType: string) => {
			switch (pageType) {
				case "APPHOME":
					switch (actionType) {
						case "FIND_REQUEST":
							navigate(`/app/find`);
							break;
						case "CANCEL":
							navigate(`/app`);
							break;
							case "LIST_REQUEST":
								navigate(`/${lastEvent.entity}`);
								break;
						default:
							console.error(`Unknown action type: ${actionType} for pageType: APPHOME`);
							navigate(`/`);
					}
					break;

				case "CONTROL":
					if (actionType === "APP_REQUEST") {
						navigate(`/app`);
					} else {
						console.error(`Unknown action type: ${actionType} for pageType: CONTROL`);
						navigate(`/`);
					}
					break;

				case "COMBO_SEARCH":
					navigate(`/app/find/${lastEvent.entity}-selection/${lastEvent.entity}/${lastEvent.entityId}`);
					break;

				case "LIST":
					if (actionType === "CANCEL_REQUEST") {
						navigate(`/`);
					} else if (actionType === "EDIT_REQUEST") {
						navigate(`/${lastEvent.entity}/${lastEvent.entityId}`);
					} else if (actionType === "NEW_REQUEST") {
						// use history to work out workout id
						if (lastEvent.entity === "workoutExercises") {
							navigate(`/app/find`);
							break;
						}
						navigate(`/${lastEvent.entity}/new`);
						break;
					} else {
						console.error(`Unknown action type: ${actionType} for pageType: LIST`);
						navigate(`/`);
					}
					break;
				case "NEW":
					if (actionType === "ADDED_ENTITY" || actionType === "CANCEL_REQUEST") {
						navigate(`/${lastEvent.entity}`);

					} else {
						console.error(`Unknown action type: ${actionType} for pageType: NEW`);
					}
					break;
				case "EDIT":
					if (actionType === "CANCEL_REQUEST") {
						navigate(`/${lastEvent.entity}`);

					} else {
						console.error(`Unknown action type: ${actionType} for pageType: NEW`);
					}
					break;
				case "BUILDER":
					if (actionType === "ADD") {
						// update current workout, if none selectedLis
						// going back to search page
						navigate(`/app/find/${lastEvent.entity}-selection/${lastEvent.entity}/${lastEvent.entityId}`);
					} else {
						console.error(`Unknown action type: ${actionType} for pageType: LIST`);
						navigate(`/`);
					}
					break;
				default:
					// Handle generic cases for unknown pageType or common actions
					switch (actionType) {
						case "EDIT_REQUEST":
							navigate(`/${lastEvent.entity}/${lastEvent.entityId}`);
							break;
						case "NEW_REQUEST":
							navigate(`/${lastEvent.entity}/new`);
							break;
						case "LIST_REQUEST":
							navigate(`/${lastEvent.entity}`);
							break;
						case "CANCEL_REQUEST":
							// Fallback for non-"LIST" pageType
							navigate(`/${lastEvent.entity}`);
							break;
						case "UPDATE":
						case "DELETE":
						case "CREATE":
							navigate(`/${lastEvent.entity}`);
							break;
						default:
							console.error(`Unknown action type: ${actionType}`);
							navigate(`/`);
					}
			}
		};

		// Call the defined navigation logic
		handleNavigation(lastEvent.pageType!, lastEvent.actionType);

	}, [lastEvent, navigate]);

	return <div></div>;
};

export default AppContent;