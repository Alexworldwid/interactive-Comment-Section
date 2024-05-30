import React, { useState } from 'react';

interface EditFormProps {
    editComment: (content: string, commentId: number) => void, 
    commentId: number, 
    content: string,
    handleIsEditing: () => void
}

const EditForm: React.FC<EditFormProps> = ({editComment, commentId, content, handleIsEditing}) => {
    const [updatedText, setUpdatedText] = useState<string>(content)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(updatedText.trim()) {
            editComment(updatedText, commentId);
            handleIsEditing()
        }
    }

    const cancel = () => {
        handleIsEditing()
    }

    return (
        <form className='w-full' onSubmit={handleSubmit}>
            <div className='w-full'>
                <textarea 
                name="updateComment" 
                id="updateComment"
                value={updatedText}
                onChange={(e) => setUpdatedText(e.target.value)}
                rows={3}
                placeholder='Add a comment...'
                className='w-[100%] border p-4 placeholder:text-xl placeholder:font-semibold'
                ></textarea>
            </div>

            <div className='flex justify-end'>
                {/* <button type='button' onClick={cancel}>Cancel</button> */}
                <button className='bg-[#5457B6] p-1 px-2 text-white font-semibold rounded-lg' type='submit'>Update</button>
            </div>
        </form>
    );
};

export default EditForm;