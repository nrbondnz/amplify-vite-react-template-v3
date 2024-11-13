// SubscriptionContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { client } from '@shared/utils/client';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

interface LastEvent {
	entity: string;
	actionType: string;
	timestamp: number;
}

interface ISubscriptionContext {
	lastEvent: LastEvent | null;
	postEvent: (entity: string, actionType: string) => void;
}

const SubscriptionContext = createContext<ISubscriptionContext>({
	lastEvent: null,
	postEvent: () => {}
});

interface SubscriptionProps {
	children: ReactNode;
}

const SubscriptionProvider: React.FC<SubscriptionProps> = ({ children }) => {
	const [lastEvent, setLastEvent] = useState<LastEvent | null>(null);

	const handleEvent = (entity: string, actionType: string) => {
		const event: LastEvent = {
			entity,
			actionType,
			timestamp: Date.now(),
		};
		setLastEvent(event);
		localStorage.setItem("lastEvent", JSON.stringify(event));
	};

	// Expose postEvent for clients to use
	const postEvent = (entity: string, actionType: string) => {
		handleEvent(entity, actionType);
	};

	useEffect(() => {
		console.log("Setting up subscriptions...");

		const muscleCreateSub = client.models.muscles.onCreate().subscribe({
			next: () => handleEvent("muscles", "CREATE"),
			error: (error: Error) => console.warn("Subscription error (muscle create):", error),
		});

		const muscleUpdateSub = client.models.muscles.onUpdate().subscribe({
			next: () => handleEvent("muscles", "UPDATE"),
			error: (error: Error) => console.warn("Subscription error (muscle update):", error),
		});

		const muscleDeleteSub = client.models.muscles.onDelete().subscribe({
			next: () => handleEvent("muscles", "DELETE"),
			error: (error: Error) => console.warn("Subscription error (muscle delete):", error),
		});

		const locationCreateSub = client.models.locations.onCreate().subscribe({
			next: () => handleEvent("locations", "CREATE"),
			error: (error: Error) => console.warn("Subscription error (location create):", error),
		});

		const locationUpdateSub = client.models.locations.onUpdate().subscribe({
			next: () => handleEvent("locations", "UPDATE"),
			error: (error: Error) => console.warn("Subscription error (location update):", error),
		});

		const locationDeleteSub = client.models.locations.onDelete().subscribe({
			next: () => handleEvent("locations", "DELETE"),
			error: (error: Error) => console.warn("Subscription error (location delete):", error),
		});

		const machineCreateSub = client.models.machines.onCreate().subscribe({
			next: () => handleEvent("machines", "CREATE"),
			error: (error: Error) => console.warn("Subscription error (machine create):", error),
		});

		const machineUpdateSub = client.models.machines.onUpdate().subscribe({
			next: () => handleEvent("machines", "UPDATE"),
			error: (error: Error) => console.warn("Subscription error (machine update):", error),
		});

		const machineDeleteSub = client.models.machines.onDelete().subscribe({
			next: () => handleEvent("machines", "DELETE"),
			error: (error: Error) => console.warn("Subscription error (machine delete):", error),
		});

		return () => {
			console.log("Cleaning up subscriptions...");
			muscleCreateSub.unsubscribe();
			muscleUpdateSub.unsubscribe();
			muscleDeleteSub.unsubscribe();
			locationCreateSub.unsubscribe();
			locationUpdateSub.unsubscribe();
			locationDeleteSub.unsubscribe();
			machineCreateSub.unsubscribe();
			machineUpdateSub.unsubscribe();
			machineDeleteSub.unsubscribe();
		};
	}, []);

	return (
		<SubscriptionContext.Provider value={{ lastEvent, postEvent }}>
			{children}
		</SubscriptionContext.Provider>
	);
};

// TODO understand this better
export const useSubscription = () => useContext(SubscriptionContext);

export default SubscriptionProvider;