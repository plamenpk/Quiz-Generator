import { ListResult, listAll, ref as sRef } from 'firebase/storage';
import { imageStorageDb } from '../config/firebase-config';
import { uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadToStorage = (photo: File | null): Promise<string> | undefined => {

 
  if (photo === null) return;

  const imageRef = sRef(imageStorageDb, `images/${photo.name}`);

  return uploadBytes(imageRef, photo)
    .then((snapshot) => {
      
      return getDownloadURL(snapshot.ref).then((url) => {

        return url;
      });
    });
};

const imagesListRef = sRef(imageStorageDb, 'images/');

export const listImg = (): Promise<ListResult> => {
  return listAll(imagesListRef);
};
