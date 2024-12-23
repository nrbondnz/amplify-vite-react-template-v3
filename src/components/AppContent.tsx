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
		console.log("AppContent useEffect : ", lastEvent);
		if (lastEvent?.actionType) {
			console.log(`Last Event: ${lastEvent.entity} - ${lastEvent.actionType}`);

			if ( lastEvent.pageType === "APPHOME" ) {
				if (lastEvent.actionType === "FIND_REQUEST") {
					const path = `/app/find`;
					console.log(`Path: ${path}`);
					navigate(path);
					return;
				}
				if (lastEvent.actionType === "CANCEL") {
					const path = `/app`;
					console.log(`Path: ${path}`);
					navigate(path);
					return;
				}
			}
			if (lastEvent.pageType === "CONTROL") {
				if (lastEvent.actionType === "APP_REQUEST") {
					const path = `/app`;
					console.log(`Path: ${path}`);
					navigate(path);
					return;
				}
			} else if (lastEvent.pageType === "COMBO_SEARCH") {
				navigate( `/app/find/${lastEvent.entity}-selection/${lastEvent.entity}/${lastEvent.entityId}`);
				return;
			}
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
			} else if (lastEvent.actionType === "LIST_REQUEST") {
				const path = `/${lastEvent.entity}`;
				console.log(`Path: ${path}`);
				navigate(path);
				return;
			} else if (lastEvent.actionType === "CANCEL_REQUEST") {
				if (lastEvent.pageType && lastEvent.pageType === "LIST") {
					navigate(`/`);
				} else {
					// just list as on sub page
					navigate(`/${lastEvent.entity}`);
				}
				return;

			} else if (lastEvent.actionType === "UPDATE" || lastEvent.actionType === "DELETE" || lastEvent.actionType === "CREATE") {
				navigate(`/${lastEvent.entity}`);
				return;
			} else {
				console.error(`Unknown action type: ${lastEvent.actionType}`);
				navigate('/');
				return;
			}
			// otherwise for now go to entity list
			//const path = `/${lastEvent.entity}`;
			//console.log(`Path: ${path}`);
			//navigate(path);
		} else {
			console.error("No last event");
			//navigate('/');
			return;
		}
	}, [lastEvent, navigate]);

	return <div></div>;
};

export default AppContent;
