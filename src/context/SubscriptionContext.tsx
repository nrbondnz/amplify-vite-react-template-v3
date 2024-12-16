import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify-data/resource';
import { AppEvent, AppStatePage } from '@shared/types/types';

interface SubscriptionContextProps {
	lastEvent: AppEvent | null;
	addCustomEvent: (event: AppEvent) => void;
	// other context properties and methods
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [lastEvent, setLastEvent] = useState<AppEvent | null>(null);
	//const [refreshExerciseManager, setRefreshExerciseManager] =
	// useState(false);
	const client = generateClient<Schema>();

	const subscribeToEntityEvents = () => {
		const subscriptions: any[] = [];

		// Generic event handler
		const handleEvent = (entity: AppStatePage, actionType: string) => (data: any) => {
			const event: AppEvent = {
				entity,
				actionType,
				entityId: data?.id ?? 0,
				pageType: '', // Optional: adjust if needed
				entityData: data,
			};
			console.log(`Event received: ${actionType} for ${entity}`, event);
			setLastEvent(event);
		};

		// Dynamically loop through all models in `client.models`
		Object.entries(client.models).forEach(([key, model]) => {
			// Safely assert each model conforms to the `Model` type
			const typedModel = model as unknown as {
				onCreate: () => { subscribe: (callback: any) => any };
				onUpdate: () => { subscribe: (callback: any) => any };
				onDelete: () => { subscribe: (callback: any) => any };
			};

			// Attempt to map the model name to the corresponding AppStatePage
			const entity = (AppStatePage as any)[key.charAt(0).toUpperCase() + key.slice(1)];
			if (!entity) {
				console.warn(`Skipping subscription for model: ${key} (no AppStatePage mapping)`);
				return;
			}

			// Safely access `onCreate`, `onUpdate`, and `onDelete`
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

	const addCustomEvent = (event: AppEvent) => {
		console.log('Adding custom event:', event);
		setLastEvent(event);
	};

	useEffect(() => {
		const unsubscribe = subscribeToEntityEvents();

		return () => {
			// Cleanup subscription
			if (unsubscribe && typeof unsubscribe === 'function') {
				unsubscribe();
			}
		};
	}, []);

	return (
		<SubscriptionContext.Provider value={{ lastEvent, addCustomEvent }}>
			{children}
		</SubscriptionContext.Provider>
	);
};

export const useSubscription = () => {
	const context = useContext(SubscriptionContext);
	if (context === undefined) {
		throw new Error('useSubscription must be used within a SubscriptionProvider');
	}
	return context;
};