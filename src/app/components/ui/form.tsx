import React, { useState } from 'react';
import { User } from '../utils/types';

interface FormProps {
    onSubmit: (content: string, user: User) => void; // Update function signature to accept content and user
    currentUser: User
}

const Form:React.FC<FormProps> = ({ onSubmit, currentUser }) => {
    const [content, setContent] = useState('');

    //handle submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(content, currentUser);
            setContent('')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea 
            name="comment" 
            id="comment" 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder='Add a comment'
            ></textarea>

            <button type='submit'>
                SEND
            </button>
        </form>
    );
};

export default Form;