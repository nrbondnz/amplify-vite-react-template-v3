import { getCurrentUser } from 'aws-amplify/auth';

const { username, userId, signInDetails } = await getCurrentUser();

export { username, userId, signInDetails };