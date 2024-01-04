import { get, query, set, ref, orderByChild, equalTo, update, type DataSnapshot } from 'firebase/database';
import { database } from '../config/firebase-config';

export const getUserByHandle = async (handle: string): Promise<DataSnapshot> => {
  return await get(ref(database, `users/${handle}`));
};

export const createUser = async (
  username: string,
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  phoneNumber: number | string,
  address: string
): Promise<void> => {
  await set(ref(database, `users/${username}`), {
    username,
    uid,
    email,
    firstName,
    lastName,
    role,
    phoneNumber,
    address,
    createdOn: Date.now(),
    isBlocked: false
  });
};

export const getUserData = async (uid: string): Promise<DataSnapshot> => {
  const usersRef = ref(database, 'users');
  const userQuery = query(usersRef, orderByChild('uid'), equalTo(uid));
  return await get(userQuery);
};

export const updateUserData = (
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  address: string,
  imgURL: string
): Promise<void> => {
  const pathFirstName = `users/${username}/firstName`;
  const pathLastName = `users/${username}/lastName`;
  const pathEmail = `users/${username}/email`;
  const pathPhoto = `users/${username}/profileImgURL`;
  const pathAddress = `users/${username}/address`;
  return update(ref(database), {
    [pathFirstName]: firstName,
    [pathLastName]: lastName,
    [pathEmail]: email,
    [pathPhoto]: imgURL,
    [pathAddress]: address,
  });
};
