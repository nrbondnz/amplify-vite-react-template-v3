import { useSubscription } from "@context/SubscriptionContext";
import { EntityTypes } from "@shared/types/types";
import { Amplify } from "aws-amplify";
import { getUrl } from 'aws-amplify/storage';
import React, { useState, useEffect } from "react";
import outputs from '../../amplify_outputs.json';

// Import addCustomEvent from the correct module
// Ensure you replace 'your-utils-module-path' with the actual path to your utility module.


Amplify.configure(outputs);

const HomePage: React.FC = () => {
	const [myUrl, setMyUrl] = useState<string>();
	const { addCustomEvent } = useSubscription();

	// Define an async function inside your component
	const loadData = async () => {
		const path = "images/machines/machines-2-overview.jpg";
		try {
			const result = await getUrl({
				path,
				options: {
					// Specify a target bucket using name assigned in Amplify Backend
					bucket: "amplifyTeamDrive"
				}
			});

			// Convert URL to string
			setMyUrl(result.url.toString()); // Ensure result.url is converted to string
			console.log("hp result:", result);
		} catch (error) {
			console.log(`Error: ${error}`);
		}
	};

	// Call the async function
	useEffect(() => {
		loadData();
	}, []); // Added dependency array to ensure it's called only once

	console.log("HomePage: ", myUrl);

	const handleGotoPage = (page: EntityTypes): React.MouseEventHandler<HTMLDivElement> => {
		return () => {
			addCustomEvent(page, "CANCEL_REQUEST");
		};
	};

	return (
		<div>
			<h1>Home Page</h1>
			{Object.values(EntityTypes).map((entityType) => (
				<div key={entityType} onClick={handleGotoPage(entityType as EntityTypes)} style={{ cursor: 'pointer', margin: '5px 0' }}>
					{entityType}
				</div>
			))}
			{myUrl && (
				<img
					src={myUrl}
					alt="Machine Overview"
					height="150"
					width="150"
				/>
			)}
		</div>
	);
};

export default HomePage;