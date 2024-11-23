import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
	name: 'my-app-bucket007',
	access: (allow) => ({
		'images/machines/*': [
			allow.entity('identity').to(['read', 'write', 'delete'])
		]
	})
});