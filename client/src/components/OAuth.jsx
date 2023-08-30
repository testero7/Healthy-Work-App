import React from 'react'
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
function OAuth() {
    //const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleClick = async () => {
        try{
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const response = await fetch('/api/auth/google', {
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            });
            const data = await response.json();
            dispatch(signInSuccess(data));
        }catch (err){
            console.log("Something went wrong!");
        }
    };

  return (
    <button type="button" onClick={handleGoogleClick}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
    <FontAwesomeIcon icon={faGoogle} />
    </button>
  )
}

export default OAuth
