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

		const handleEvent = (entity: AppStatePage, actionType: string, entityId?: number, pageType?: string, entityData?: any) => (data: any) => {
			entityData = data.data; // Adjust this if the structure is different

			const event: AppEvent = {
				entity,
				actionType,
				entityId: entityId ?? 0,
				pageType: pageType ?? '',
				entityData: entityData, // Optional: Include the full entity data if needed
			};
			console.log('Setting lastEvent:', event)
			setLastEvent(event);
		};

		// Subscriptions for Locations
		subscriptions.push(
			client.models.locations.onCreate().subscribe({
				next: handleEvent(AppStatePage.Location, 'CREATE'),
				error: (error: any) => console.warn('Create Location subscription error:', error),
				complete: () => {}, // Placeholder for complete
			})
		);

		subscriptions.push(
			client.models.locations.onUpdate().subscribe({
				next: handleEvent(AppStatePage.Location, 'UPDATE'),
				error: (error: any) => console.warn('Update Location subscription error:', error),
				complete: () => {}, // Placeholder for complete
			})
		);

		subscriptions.push(
			client.models.locations.onDelete().subscribe({
				next: handleEvent(AppStatePage.Location, 'DELETE'),
				error: (error: any) => console.warn('Delete Location subscription error:', error),
			})
		);

		// Subscriptions for Machines
		subscriptions.push(
			client.models.machines.onCreate().subscribe({
				next: handleEvent(AppStatePage.Machine, 'CREATE'),
				error: (error: any) => console.warn('Create Machine subscription error:', error),
			})
		);

		subscriptions.push(
			client.models.machines.onUpdate().subscribe({
				next: handleEvent(AppStatePage.Machine, 'UPDATE'),
				error: (error: any) => console.warn('Update Machine subscription error:', error),
			})
		);

		subscriptions.push(
			client.models.machines.onDelete().subscribe({
				next: handleEvent(AppStatePage.Machine, 'DELETE'),
				error: (error: any) => console.warn('Delete Machine subscription error:', error),
			})
		);

		// Subscriptions for Users
		subscriptions.push(
			client.models.userDetails.onCreate().subscribe({
				next: handleEvent(AppStatePage.User, 'CREATE'),
				error: (error: any) => console.warn('Create User subscription error:', error),
			})
		);

		subscriptions.push(
			client.models.userDetails.onUpdate().subscribe({
				next: handleEvent(AppStatePage.User, 'UPDATE'),
				error: (error: any) => console.warn('Update User subscription error:', error),
			})
		);

		subscriptions.push(
			client.models.userDetails.onDelete().subscribe({
				next: handleEvent(AppStatePage.User, 'DELETE_USER'),
				error: (error: any) => console.warn('Delete User subscription error:', error),
			})
		);

		// Subscriptions for Exercises
		subscriptions.push(
			client.models.exercises.onCreate().subscribe({
				next: handleEvent(AppStatePage.Exercise, 'CREATE_EXERCISE'),
				error: (error: any) => console.warn('Create Exercise subscription error:', error),
			})
		);

		subscriptions.push(
			client.models.exercises.onUpdate().subscribe({
				next: handleEvent(AppStatePage.Exercise, 'UPDATE_EXERCISE'),
				error: (error: any) => console.warn('Update Exercise subscription error:', error),
			})
		);

		subscriptions.push(
			client.models.exercises.onDelete().subscribe({
				next: handleEvent(AppStatePage.Exercise, 'DELETE_EXERCISE'),
				error: (error: any) => console.warn('Delete Exercise subscription error:', error),
			})
		);

		// Subscriptions for Workouts
		subscriptions.push(
			client.models.workouts.onCreate().subscribe({
				next: handleEvent(AppStatePage.Workout, 'CREATE_WORKOUT'),
				error: (error: any) => console.warn('Create Workout subscription error:', error),
			})
		);

		subscriptions.push(
			client.models.workouts.onUpdate().subscribe({
				next: handleEvent(AppStatePage.Workout, 'UPDATE_WORKOUT'),
				error: (error: any) => console.warn('Update Workout subscription error:', error),
			})
		);

		subscriptions.push(
			client.models.workouts.onDelete().subscribe({
				next: handleEvent(AppStatePage.Workout, 'DELETE_WORKOUT'),
				error: (error: any) => console.warn('Delete Workout subscription error:', error),
			})
		);

		// Subscriptions for Muscles
		subscriptions.push(
			client.models.muscles.onCreate().subscribe({
				next: handleEvent(AppStatePage.Muscle, 'CREATE_MUSCLE'),
				error: (error: any) => console.warn('Create Muscle subscription error:', error),
			})
		);

		subscriptions.push(
			client.models.muscles.onUpdate().subscribe({
				next: handleEvent(AppStatePage.Muscle, 'UPDATE_MUSCLE'),
				error: (error: any) => console.warn('Update Muscle subscription error:', error),
			})
		);

		subscriptions.push(
			client.models.muscles.onDelete().subscribe({
				next: handleEvent(AppStatePage.Muscle, 'DELETE_MUSCLE'),
				error: (error: any) => console.warn('Delete Muscle subscription error:', error),
			})
		);

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