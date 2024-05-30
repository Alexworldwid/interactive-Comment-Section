import React, { useEffect, useRef, useState } from 'react';
import { Comment, Reply, User } from '../utils/types';
import Image from 'next/image';

interface FormProps {
    currentUser: User
    parentId: number,
    handleIsReplying: () => void,
    replyingTo: string,
    addReply: (content: string, user: User, parentId: number, replyingTo: string ) => void,
}

const ReplyForm:React.FC<FormProps> = ({ currentUser, parentId, handleIsReplying, replyingTo, addReply }) => {
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null); // Reference to the textarea element

    // Automatically focus on the textarea when the component mounts
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    //handle submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            addReply( content, currentUser, parentId, replyingTo );
            setContent('')
            handleIsReplying()
        }
    }

    return (
        <form className='w-full my-4 bg-white p-4 rounded-lg' onSubmit={handleSubmit}>
            <div className='flex items-start gap-3'>
                <Image className='hidden md:block' src={currentUser.image.png} alt={currentUser.username} width={40} height={40} />

                <textarea 
                ref={textareaRef}
                name="comment" 
                id="comment" 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder='Add a comment...'
                className='w-full border p-4 placeholder:text-xl placeholder:font-semibold'
                ></textarea>

                <button type='submit' className='text-2xl font-semibold hidden md:block'>
                    Reply
                </button>
            </div>
            

            <div className='flex md:hidden justify-between w-full mt-3 '>
                <Image src={currentUser.image.png} alt={currentUser.username} width={40} height={40} />
                
                <button type='submit' className='text-2xl font-semibold'>
                    Reply
                </button>
            </div>
        </form>
    );
};

export default ReplyForm;