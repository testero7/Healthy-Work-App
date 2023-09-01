import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
    const fileRef = useRef(null);
    const [image, setImage] = useState(undefined);
    const { loading, error } = useSelector((state) => state.user);
    const { currentUser } = useSelector((state) => state.user);
    const [imagePercent, setImagePercent] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [ imageError, setImageError ] = useState(false);
    const [ formData, setFormData] = useState({});
    console.log(formData);
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

  const handleConfirmAction = () => {
    // Handle the action (e.g., delete account) here
    setShowModal(false);
  };
//   service firebase.storage {
//     match /b/{bucket}/o {
//       match /{allPaths=**} {
//         allow read;
//         allow write: if
//         request.resource.size < 2 * 1024 * 1024 &&
//         request.resource.contentType.matches('image/.*')
//       }
//     }
//   }
  return (
    <div className="p-3 max-w-lg mx-auto bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-sans text-center mb-7 text-blue-400">Profile</h1>
        <form className="flex flex-col gap-4">
            <input type='file' 
            ref={fileRef} 
            hidden accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
            />
          <img
            src={formData.photo || currentUser.rest.photo}
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
            defaultValue={currentUser.rest.username}
            type="text"
            id="username"
            placeholder="Username"
            className="bg-slate-100 rounded-lg p-3"
          />
          <input
            defaultValue={currentUser.rest.email}
            type="email"
            id="email"
            placeholder="E-mail"
            className="bg-slate-100 rounded-lg p-3"
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="bg-slate-100 rounded-lg p-3"
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
