import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ROLE_CHECK } from '../../common/constants';
import { getUserByHandle, createUser } from '../../services/users.services';
import { registerUser } from '../../services/auth.services';
import toast from 'react-hot-toast';
import Button from '../../components/UI/Buttons/Button';

const Register: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'student',
    phoneNumber: '',
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
      toast.error('Email is required!');
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
          toast.error('Username already exists!');
          return;
        }
        return await registerUser(form.email, form.password)

          .then((credential) => {
            createUser(
              form.username,
              credential.user.uid,
              credential.user.email ?? '',
              form.firstName,
              form.lastName,
              form.role,
              form.phoneNumber,
              form.address
            )
              .catch(console.error);
            setUser({
              user: credential.user
            });
          })
          .then(() => {
            toast.success('User created successfully, redirecting...');
            navigate('/home');
          })
          .catch((e) => { console.error(e.message); });
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
                      type="text"
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
                      onChange={updateForm('phoneNumber')}
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
                        className="pr-18 text-blue-500 hover:text-blue-700"
                        to="/Login"
                      >
                        Already have an account?
                      </Link>
                      <Button text="REGISTER" onClickFunction={handleRegisterUser} buttonType="button" />
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

export default Register;
