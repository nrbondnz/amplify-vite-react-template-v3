import { Amplify } from "aws-amplify";
import { getUrl } from 'aws-amplify/storage';
import React, { useState } from "react";
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

const HomePage: React.FC = () => {
	const [myUrl, setMyUrl] = useState<string>();

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

			setMyUrl(result.url.toString()); // Corrected .toString call
			console.log("hp result:", result);
		} catch (error) {
			console.log(`Error: ${error}`);
		}
	};

	// Call the async function
	React.useEffect(() => {
		loadData();
	}, []); // Added dependency array to ensure it's called only once

	console.log("HomePage: ", myUrl);

	return (
		<div>
			<h1>Home Page</h1>
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