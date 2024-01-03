import { AuthContext } from '../../context/AuthContext';
import React, { useState, useContext, ChangeEvent } from 'react';
import { updateUserData } from '../../services/users.services';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '../../common/constants';
import { useNavigate } from 'react-router-dom';
import { uploadToStorage } from '../../services/uploadToStorage.services';

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
          console.log('uploaded');
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
      console.log('logPrev');
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
      alert('Email is required');
      return;
    }

    if (form.address) {
      if (
        form.address.length < MIN_NAME_LENGTH ||
        form.address.length > MAX_NAME_LENGTH
      ) {
        alert('Address is required');
        return;
      }
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
        alert('Profile updated successfully');
        navigate('/home');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <>
      <div className="mt-10 p-8 bg-gray-100 flex items-center justify-center opacity-90">
        <div className="container max-w-screen-lg mx-auto">
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
                    <button
                      type="button"
                      onClick={handleUpload}
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:bg-zinc-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      {upload}
                    </button>
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
                      <button
                        type="button"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white dark:text-zinc-200 shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={handleUpdateUserData}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white dark:text-zinc-200 shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="h-screen flex flex-col">
        <div className="pb-20">
          <form className="p-5 pb-10 border-indigo-300 dark:border-zinc-200 border bg-gradient-to-l from-violet-200 to-violet-300 dark:bg-gradient-to-tl dark:from-zinc-700 rounded m-10">
            <div className="space-y-12 p-7 bg-gradient-to-bl from-indigo-400 dark:from-zinc-500 rounded-lg ">
              <div className="">
                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-zinc-200">
                  Profile Settings
                </h2>
              </div>
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
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:bg-zinc-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="">
                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-zinc-200">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-zinc-200">
                  Use a permanent address where you can receive mail.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-bold leading-6 text-gray-900 dark:text-zinc-200"
                    >
                      First name
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={updateForm('firstName')}
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-none dark:bg-zinc-400 ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-bold leading-6 text-gray-900 dark:text-zinc-200"
                    >
                      Last name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        onChange={updateForm('lastName')}
                        // name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset dark:bg-zinc-400 ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-bold leading-6 text-gray-900 dark:text-zinc-200"
                      >
                        Address
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={updateForm('address')}
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset dark:bg-zinc-400 ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold leading-6 text-gray-900 dark:text-zinc-200"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        onChange={updateForm('email')}
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset dark:bg-zinc-400 ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white dark:text-zinc-200 shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleUpdateUserData}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white dark:text-zinc-200 shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div> */}
    </>
  );
};
export default Profile;