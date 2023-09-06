import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { updateUserStart,
   updateUserSuccess,
    updateUserFailure,
     deleteUserStart,
     deleteUserFailure,
     deleteUserSuccess,
     signOut
    } from '../redux/user/userSlice';

export default function Profile() {
    const fileRef = useRef(null);
    const [image, setImage] = useState(undefined);
    const { currentUser, loading, error} = useSelector((state) => state.user);
    const [imagePercent, setImagePercent] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [ imageError, setImageError ] = useState(false);
    const [ formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const dispatch = useDispatch();
    console.log(currentUser);
    useEffect(() =>{
        if(image){
            handleUpload(image);
        }
    }, [image]);

    const handleUpload = async (image) => {
        // console.log(image);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
            //console.log(progress);
            setImagePercent(Math.round(progress));
        },
        (error) => {
            setImageError(true);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then
            ((downloadURL) => 
                setFormData({
                    ...formData, photo: downloadURL
                })
            );
        }
    );
};

  const handleAction = (action) => {
    setShowModal(true);
    setActionType(action);
  };

  const handleConfirmAction = async () => {
    // Handle the action (e.g., delete account) here
   
    setShowModal(false);


    if (actionType === 'delete') {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();

        if (data.success === false) {
          dispatch(deleteUserFailure(data));
          return;
        }
        dispatch(deleteUserSuccess());
      } catch (err) {
        dispatch(deleteUserFailure(err));
      }
    } else if (actionType === 'signout') {
      try {
        await fetch('/api/auth/signout');
        dispatch(signOut());
      } catch (err){
        console.log(err);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
        ...formData, [e.target.id]: e.target.value
    });
  }

  //console.log(currentUser.rest._id);
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
            dispatch(updateUserFailure(data));
            return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
    } catch(err) {
        dispatch(updateUserFailure(err));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-sans text-center mb-7 text-blue-400">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type='file' 
            ref={fileRef} 
            hidden accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
            />
          <img
            src={formData.photo || currentUser.photo}
            alt="profile"
            className="h-24 w-24 mt-2 self-center cursor-pointer rounded-full object-cover"
            onClick={() => fileRef.current.click()}
          />
          <p className='text-sm self-center'>
            {imageError ? (
            <span className='text-red-700'>Error occured!</span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-blue-400'>{`Uploading... + ${imagePercent}
            %
            `}</span>) : imagePercent === 100 ? (
                <span className='text-green-500'>Image uploaded!</span>) : '' 
            }
          </p>
            
          <input
            defaultValue={currentUser.username}
            type="text"
            id="username"
            placeholder="Username"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <input
            defaultValue={currentUser.email}
            type="email"
            id="email"
            placeholder="E-mail"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            type="submit"
            className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => handleAction('delete')}
            disabled={loading}
            type="button"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Loading...' : 'Delete account'}
          </button>

          <button
            onClick={() => handleAction('signout')}
            disabled={loading}
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Loading...' : 'Sign out'}
          </button>
        </div>
        <p className='text-red-600 mt-5'>{error && "Something went wrong!"}</p>
            <p className='text-green-500 mt-5'>{updateSuccess && "User updated!"}</p>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-xl">
              Are you sure you want to {actionType === 'delete' ? 'delete your account' : 'sign out'}?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 mr-3"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:opacity-95"
              >
                Confirm
              </button>
              
            </div>
           
          </div>
        </div>
      )}
    </div>
  );
}
