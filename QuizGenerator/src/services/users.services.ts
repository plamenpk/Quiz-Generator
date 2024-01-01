import { get, query, set, ref, orderByChild, equalTo, type DataSnapshot } from 'firebase/database'
import { database } from '../config/firebase-config'

export const getUserByHandle = async (handle: string): Promise<DataSnapshot> => {
  return await get(ref(database, `users/${handle}`))
}

export const createUser = async (
  username: string,
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  phoneNumber: string,
  profileImgUrl: string,
  address: string
): Promise<void> => {
  await set(ref(database, `users/${username}`), {
    username,
    uid,
    email,
    firstName,
    lastName,
    profileImgUrl,
    role,
    phoneNumber,
    address,
    createdOn: Date.now(),
    isBlocked: false
  })
}

export const getUserData = async (uid: string): Promise<DataSnapshot> => {
  const usersRef = ref(database, 'users')
  const userQuery = query(usersRef, orderByChild('uid'), equalTo(uid))
  return await get(userQuery)
}
