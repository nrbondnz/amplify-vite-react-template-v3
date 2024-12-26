import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify-data/resource';
import { AppEvent, AppStatePage } from '@shared/types/types';

// Define the interface for the SubscriptionContext
interface SubscriptionContextProps {
	eventHistory: AppEvent[]; // Array of event history, capped at length 10
	lastEvent: AppEvent | null; // Most recent event
	addCustomEvent: (event: AppEvent) => void; // Method to add a custom event
	currentSelectedEntity: { entity: string; entityId: number } | null; // Current selected entity
}

// Create the context
const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [eventHistory, setEventHistory] = useState<AppEvent[]>([]); // Store a max length of 10 events
	const client = generateClient<Schema>();

	// Method to add a new custom event to the history
	const addCustomEvent = (event: AppEvent) => {
		console.log('Adding custom event:', event);

		// Add the new event to the history and prune to a max length of 10
		setEventHistory((prev) => {
			const updatedHistory = [event, ...prev]; // Add event as the most recent
			return updatedHistory.slice(0, 10); // Keep only the last 10 events
		});
	};

	// Exposed current selected entity:
	// This finds the most recent event that has both a valid `entity` and `entityId`
	const currentSelectedEntity =
		eventHistory.find(
			(event): event is AppEvent =>
				!!event.entity && event.entityId !== undefined // Ensure valid `entity` and `entityId`
		)
			? { entity: eventHistory[0].entity, entityId: eventHistory[0].entityId as number }
			: null;

	// Dynamically subscribe to Amplify events
	const subscribeToEntityEvents = () => {
		const subscriptions: any[] = [];

		// Generic handler for events
		const handleEvent = (entity: AppStatePage, actionType: string) => (data: any) => {
			const event: AppEvent = {
				entity,
				actionType,
				entityId: data?.id ?? 0,
				pageType: '', // Optional: adjust if needed
				entityData: data,
			};
			console.log(`Event received: ${actionType} for ${entity}`, event);
			addCustomEvent(event); // Add the new event to the list
		};

		// Loop through all models in `client.models` to set up subscriptions
		Object.entries(client.models).forEach(([key, model]) => {
			const typedModel = model as unknown as {
				onCreate: () => { subscribe: (callback: any) => any };
				onUpdate: () => { subscribe: (callback: any) => any };
				onDelete: () => { subscribe: (callback: any) => any };
			};

			const entity = (AppStatePage as any)[key.charAt(0).toUpperCase() + key.slice(1)];
			if (!entity) {
				console.warn(`Skipping subscription for model: ${key} (no AppStatePage mapping)`);
				return;
			}

			// Safely subscribe to onCreate, onUpdate, and onDelete
			subscriptions.push(
				typedModel.onCreate().subscribe({
					next: handleEvent(entity, 'CREATE'),
					error: (error: any) => console.warn(`Create ${key} subscription error`, error),
				})
			);

			subscriptions.push(
				typedModel.onUpdate().subscribe({
					next: handleEvent(entity, 'UPDATE'),
					error: (error: any) => console.warn(`Update ${key} subscription error`, error),
				})
			);

			subscriptions.push(
				typedModel.onDelete().subscribe({
					next: handleEvent(entity, 'DELETE'),
					error: (error: any) => console.warn(`Delete ${key} subscription error`, error),
				})
			);
		});

		// Cleanup function to unsubscribe from all subscriptions
		return () => {
			subscriptions.forEach((sub) => sub.unsubscribe());
		};
	};

	// Set up subscriptions on component mount
	useEffect(() => {
		const unsubscribe = subscribeToEntityEvents();
		return () => {
			if (typeof unsubscribe === 'function') {
				unsubscribe();
			}
		};
	}, []);

	// Provide the subscription context values
	return (
		<SubscriptionContext.Provider
			value={{
				eventHistory,
				lastEvent: eventHistory[0] || null, // The most recent event (or null if no events exist)
				addCustomEvent,
				currentSelectedEntity, // The current selected entity (or null if no valid entity is found)
			}}
		>
			{children}
		</SubscriptionContext.Provider>
	);
};

// Custom hook to access the SubscriptionContext
export const useSubscription = () => {
	const context = useContext(SubscriptionContext);
	if (context === undefined) {
		throw new Error('useSubscription must be used within a SubscriptionProvider');
	}
	return context;
};