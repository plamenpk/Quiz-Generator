import { AuthContext } from '../../context/AuthContext';
import React, { useState, useContext, ChangeEvent } from 'react';
import { updateUserData } from '../../services/users.services';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '../../common/constants';
import { useNavigate } from 'react-router-dom';
import { uploadToStorage } from '../../services/uploadToStorage.services';
import toast from 'react-hot-toast';
import Button from '../../components/UI/Buttons/Button';

const Profile: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { appState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState<string>();
  const [upload, setUpload] = useState<string>('Upload');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
  });

  const updateForm = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const handleUpload = (): void => {
    if (profilePhoto !== null && profilePhoto !== undefined) {
      uploadToStorage(profilePhoto)
        .then((url) => {
          setData(url);
          setUpload('Uploaded');
        })
        .catch((error) => {
          console.error('Error uploading: ', error);
        });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files: FileList | null = e.target.files;

    if (files && files.length > 0) {
      setProfilePhoto(files[0] as File);
      const url: string = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
    }
  };

  const handleUpdateUserData = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (form.firstName) {
      if (
        form.firstName.length < MIN_NAME_LENGTH ||
        form.firstName.length > MAX_NAME_LENGTH
      ) {
        alert('First Name is required');
        return;
      }
    }
    if (form.lastName) {
      if (
        form.lastName.length < MIN_NAME_LENGTH ||
        form.lastName.length > MAX_NAME_LENGTH
      ) {
        alert('Last Name is required');
        return;
      }
    }

    if (!form.email) {
      toast.error('Email is required');
      return;
    }

    if (!form.firstName) form.firstName = appState?.userData?.firstName ?? '';
    if (!form.lastName) form.lastName = appState?.userData?.lastName ?? '';
    if (!form.email) form.email = appState?.userData?.email ?? '';
    if (!form.address) form.address = appState?.userData?.address ?? '';

    updateUserData(
      appState?.userData?.username ?? '',
      form.firstName,
      form.lastName,
      form.email,
      form.address,
      data ?? ''
    )
      .then(() => {
        toast.success('Profile updated successfully');
        navigate('/home');
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <div className="mt-10 mb-16 p-8 bg-gray-100 flex items-center justify-center opacity-90">
        <div className="container max-w-screen-lg mx-auto my-3">
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Personal Details</p>
                <p>Please fill out all the fields.</p>
                <div className="col-span-full">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-zinc-200"
                  >
                    Photo
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <div className="h-20 w-20 rounded-full border-2 border-gray-300 dark:border-indigo-500 flex items-center justify-center text-gray-500 dark:text-indigo-500">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            className="h-20 w-20 rounded-full"
                          />
                        ) : (
                          '+'
                        )}
                      </div>
                    </label>
                    <Button text={upload} onClickFunction={handleUpload} buttonType="button" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-">
                  <div className="md:col-span-3">
                    <label>First Name</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      value={form.firstName}
                      onChange={updateForm('firstName')}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label>Last Name</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      value={form.lastName}
                      onChange={updateForm('lastName')}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label>Address</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      value={form.address}
                      onChange={updateForm('address')}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label>Email</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      placeholder="email@domain.com"
                      value={form.email}
                      onChange={updateForm('email')}
                    />
                  </div>
                  <div className="md:col-span-3 text-right">
                    <div className="flex justify-between items-end">
                      <Button text="Cancel" onClickFunction={handleUpdateUserData} buttonType="button"></Button>
                      <Button text="Save Changes" onClickFunction={handleUpdateUserData} buttonType="submit"></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;