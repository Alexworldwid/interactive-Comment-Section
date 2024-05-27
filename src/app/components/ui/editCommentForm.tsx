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
        <form onSubmit={handleSubmit}>
            <div>
                <textarea 
                name="updateComment" 
                id="updateComment"
                value={updatedText}
                onChange={(e) => setUpdatedText(e.target.value)}
                rows={3}
                placeholder='Add a comment...'
                className='w-full border p-4 placeholder:text-xl placeholder:font-semibold'
                ></textarea>
            </div>

            <div>
                <button type='button' onClick={cancel}>Cancel</button>
                <button type='submit'>Update</button>
            </div>
        </form>
    );
};

export default EditForm;