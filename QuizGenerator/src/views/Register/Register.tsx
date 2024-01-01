/* eslint-disable @typescript-eslint/semi */
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ROLE_CHECK } from '../../common/constants';
import { getUserByHandle, createUser } from '../../services/users.services';
import { registerUser } from '../../services/auth.services';

const Register: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'student',
    phoneNumber: '',
    profileImgUrl: '',
    address: ''
  });

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const updateForm = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
          ? ROLE_CHECK.EDUCATOR
          : ROLE_CHECK.STUDENT
        : e.target.value;
    setForm({
      ...form,
      [field]: value
    });
  };

  const handleRegisterUser = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    if (form.email.length === 0) {
      alert('Email is required!');
      return;
    }

    // checkUserPhone(form.phone)
    //   .then((result) => {
    // if (result) {
    //   alert(`user with phone ${form.phone} already exist!`);
    //   navigate('/register');
    // } else {
    getUserByHandle(form.username)
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          alert('Username already exists!');
        }
        return await registerUser(form.email, form.password);
      })
      .then((credential) => {
        createUser(
          form.username,
          credential.user.uid,
          credential.user.email ?? '',
          form.firstName,
          form.lastName,
          form.role,
          form.phoneNumber,
          form.profileImgUrl,
          form.address
        )
          .catch(console.error)

        // credential.user.value = form.username;
        setUser({
          user: credential.user
        });
      })
      .then(() => {
        alert('User created successfully, redirecting...');
        navigate('/home');
      })
      .catch((e) => { console.error(e.message); });
    // }
    // })
    // .catch((e) => { console.error(e); });
  };
  return (
    <>
      {/* <!-- component --> */}
      <div className="mt-10 p-6 bg-gray-100 flex items-center justify-center opacity-90">
        <div className="container max-w-screen-lg mx-auto">
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Personal Details</p>
                <p>Please fill out all the fields.</p>
              </div>
              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-5">
                    <label>User Name</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      value={form.username}
                      onChange={updateForm('username')}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label>First Name</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      value={form.firstName}
                      onChange={updateForm('firstName')}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label>Last Name</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      value={form.lastName}
                      onChange={updateForm('lastName')}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label>Email Address</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      placeholder="email@domain.com"
                      type="email"
                      value={form.email}
                      onChange={updateForm('email')}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label>Address / Street</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      value={form.address}
                      onChange={updateForm('address')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label>Phone Number</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="text"
                      value={form.phoneNumber}
                      onChange={updateForm('phone')}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label>Password</label>
                    <input className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      type="password"
                      value={form.password}
                      onChange={updateForm('password')}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <div className="inline-flex items-center">
                      <input className="form-checkbox"
                        type="checkbox"
                        checked={form.role === ROLE_CHECK.EDUCATOR}
                        onChange={updateForm('role')}
                      />
                      <label className="ml-2">I am educator.</label>
                    </div>
                  </div>
                  <div className="md:col-span-5 text-right">
                    <div className="flex justify-between items-end">
                      <Link
                        className="pr-18 text-blue-700"
                        to="/Login"
                      >
                        Already have an account?
                      </Link>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleRegisterUser}
                        type="button"
                      >
                        REGISTER
                      </button>
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
}

export default Register
