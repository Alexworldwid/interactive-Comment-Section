"use client";

import React, { useEffect, useState } from 'react';
import Commentitems from '../utils/commentitemTemplate';
import { Comment, User, Reply } from '../utils/types';
import ReplyItem from '../utils/replyItemTemplate';
import Image from 'next/image';
import { currentUser } from '@/app/lib/db'; 
import CommentForm from './sendCommentForm';

interface CommentlistProps {
    comments: Comment[],
    user: User,
    addNewComment: (newComment: Comment) => void,
    addNewReply: (parentId: number, newReply: Reply) => void,
    editCommentOrReply: (updatedComment: string, commentId: number, replyId?: number) => void,
    deleteCommentOrReply: (commentId: number, replyId?: number) => void,
}


const Commentlist:React.FC<CommentlistProps> = ({ comments, user, addNewComment, addNewReply, editCommentOrReply, deleteCommentOrReply }) => {
    const [newCommentContent, setNewCommentContent] = useState('');

    
    //POST a new comment
    const addComment = async (content: string, user: User) => {
        const data = {
        content: content,
        user: user
        }

        const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        const newComment = await res.json();
        addNewComment(newComment)
        setNewCommentContent(''); // Reset the input field
    }

    //post a new reply 
    const addReply = async (content: string, user: User, parentId: number, replyingTo: string ) => {
        const data = {
            content: content,
            user: user,
            parentId: parentId,
            replyingTo: replyingTo
        }

        const res = await fetch('/api/comments/replies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const newReply = await res.json();
        addNewReply(parentId, newReply,);
    }

    
    return (
        <section className='w-full max-w-[1000px]'>
            <ul>
                {comments.map(comment => (
                    <li key={`comment-${comment.id}`}>
                        <Commentitems
                        comment={comment}
                        currentUser={user}
                        addReply={addReply}
                        editCommentOrReply={editCommentOrReply}
                        deleteCommentOrReply={deleteCommentOrReply}
                        
                        />
                        <ul className='flex flex-col items-end border-l-2 border-slate-300 border-solid md:ml-10'>
                            {comment.replies && comment.replies.map(reply => (
                                <ReplyItem 
                                key={`reply-${reply.id}`}
                                reply={reply}
                                currentUser={user}
                                addReply={addReply}
                                editCommentOrReply={editCommentOrReply}
                                comment={comment}
                                deleteCommentOrReply={deleteCommentOrReply}
                                
                            />
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>  


            <CommentForm newCommentContent={newCommentContent} setNewCommentContent={setNewCommentContent} currentUser={currentUser} addComment={addComment} />

        </section>        
    );
};

export default Commentlist;