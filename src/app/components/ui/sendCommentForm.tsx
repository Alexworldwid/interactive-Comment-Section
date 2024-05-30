import React, { useState } from 'react';
import { User } from '../utils/types';
import Image from 'next/image';

interface FormProps {
    newCommentContent: string,
    setNewCommentContent: React.Dispatch<React.SetStateAction<string>>;
    currentUser: User,
    addComment: (content: string, user: User) => void
}

const CommentForm:React.FC<FormProps> = ({ newCommentContent, setNewCommentContent, currentUser, addComment }) => {

    //handle submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCommentContent.trim()) {
            addComment(newCommentContent, currentUser)
            setNewCommentContent('')
        }
    }

    return (
        <form className='w-full my-4 bg-white p-4 rounded-lg' onSubmit={handleSubmit}>
            <div className='flex items-start gap-2'>
                <Image src={currentUser.image.png} alt={currentUser.username} width={40} height={40} className='hidden md:block' />
                
                <textarea 
                name="comment" 
                id="comment" 
                value={newCommentContent} 
                onChange={(e) => setNewCommentContent(e.target.value)}
                rows={3}
                placeholder='Add a comment...'
                className='w-full border p-4 placeholder:text-xl placeholder:font-semibold'
                ></textarea>

                <button type='submit' className='text-2xl font-semibold hidden md:block'>
                    SEND
                </button>
            </div>
            

            <div className='flex justify-between w-full mt-3 md:hidden'>
                <Image src={currentUser.image.png} alt={currentUser.username} width={40} height={40} />
                
                <button type='submit' className='text-2xl font-semibold'>
                    SEND
                </button>
            </div>
        </form>
    );
};

export default CommentForm;