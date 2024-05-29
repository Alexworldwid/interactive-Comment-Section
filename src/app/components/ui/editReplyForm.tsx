import React, { useState } from 'react';

interface ReplyFormProps {
    content: string,
    parentId: number,
    replyId: number,
    replyingTo: string,
    editReply: (content: string, parentId: number, replyId?: number) => void,
    handleIsEditing: () => void
}

const EditReplyForm: React.FC<ReplyFormProps> = ({ content, parentId, replyId, replyingTo, editReply, handleIsEditing }) => {
    const [updatedReply, setUpdatedReply] = useState<string>(content);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (updatedReply.trim()) {
            editReply(updatedReply, parentId, replyId);
            handleIsEditing()
        }
    }

    const cancel = () => {
        handleIsEditing()
    }

    return (
        <form onSubmit={handleSubmit}>
             <div>
                <textarea 
                name="updateComment" 
                id="updateComment"
                value={`${updatedReply}`}
                onChange={(e) => setUpdatedReply(e.target.value)}
                rows={3}
                placeholder='Add a comment...'
                className='w-full border p-4 placeholder:text-xl placeholder:font-semibold'
                ></textarea>
            </div>

            <div className='flex justify-end'>
                {/* <button type='button' onClick={cancel}>Cancel</button> */}
                <button className='bg-[#5457B6] p-1 px-2 text-white font-semibold rounded-lg' type='submit'>Update</button>
            </div>
        </form>
    );
};

export default EditReplyForm;