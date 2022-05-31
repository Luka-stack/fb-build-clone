import { useRef, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { EmojiHappyIcon } from '@heroicons/react/outline';
import { CameraIcon, VideoCameraIcon } from '@heroicons/react/solid';
import firebase from 'firebase';

import { db, storage } from '../firebase';

function InputBox() {
  const [imageToPost, setImageToPost] = useState(null);

  const { data: session } = useSession();

  const inputRef = useRef(null);
  const fileRef = useRef(null);

  const sendPost = (e) => {
    e.preventDefault();

    if (!inputRef.current.value) return;

    db.collection('posts')
      .add({
        message: inputRef.current.value,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => {
        if (imageToPost) {
          const uploadTask = storage
            .ref(`posts/${doc.id}`)
            .putString(imageToPost, 'data_url');

          removeImage();

          uploadTask.on(
            'state_change',
            null,
            (error) => console.error(error),
            () => {
              storage
                .ref('posts')
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
                  db.collection('posts')
                    .doc(doc.id)
                    .set({ postImage: url }, { merge: true });
                });
            }
          );
        }
      });

    inputRef.current.value = '';
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
    };
  };

  const removeImage = () => {
    setImageToPost(null);
  };

  return (
    <div className="p-2 mt-6 font-medium text-gray-500 bg-white shadow-md rounded-2xl">
      <div className="flex items-center p-4 space-x-4">
        <Image
          className="rounded-full"
          alt={session.user.name}
          src={session.user.image}
          width={40}
          height={40}
          layout="fixed"
        />

        <form className="flex flex-1">
          <input
            ref={inputRef}
            className="flex-grow h-12 px-5 bg-gray-100 rounded-full focus:outline-none"
            type="text"
            placeholder={`What's on your mind, ${session.user.name}?`}
          />
          <button hidden onClick={sendPost} type="submit">
            Submit
          </button>
        </form>

        {imageToPost && (
          <div
            onClick={removeImage}
            className="flex flex-col transition duration-150 transform cursor-pointer filter hover:brightness-110 hover:scale-105"
          >
            <img
              src={imageToPost}
              alt="post image"
              className="object-contain h-10"
            />
            <p className="text-center text-red-500 text-sx">Remove</p>
          </div>
        )}
      </div>

      <div className="flex p-3 border-t justify-evenly">
        <div className="input-icon">
          <VideoCameraIcon className="text-red-500 h-7" />
          <p className="text-xs sm:text-sm xl:text-base">Live Video</p>
        </div>

        <div className="input-icon" onClick={() => fileRef.current.click()}>
          <CameraIcon className="text-green-500 h-7" />
          <p className="text-xs sm:text-sm xl:text-base">Photo/Video</p>
          <input ref={fileRef} type="file" hidden onChange={addImageToPost} />
        </div>

        <div className="input-icon">
          <EmojiHappyIcon className="text-yellow-500 h-7" />
          <p className="text-xs sm:text-sm xl:text-base">Feeling/Activity</p>
        </div>
      </div>
    </div>
  );
}

export default InputBox;
