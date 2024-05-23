"use client";

import React, { useEffect, useState } from 'react';
import Commentitems from '../utils/commentitems';
import { Comment, User } from '../utils/types';
import ReplyItem from '../utils/replyItem';
interface CommentlistProps {
    comments: Comment[];
    onVote: (id: number, type: 'up' | 'down') => void;
    currentUser: User
}


const Commentlist = ({ comments, onVote, currentUser }: CommentlistProps) => {
    return (
        <section>
            <ul>
            {comments.map(comment => (
                    <div key={comment.id}> {/* Wrap the Comment and Replies */}
                        <Commentitems key={comment.id} onVote={onVote} comment={comment} />
                        {comment.replies && comment.replies.length > 0 && (
                            <ul className="w-full flex flex-col items-end border-slate-400 border-l-2"> {/* Use a div or fragment */}
                                {comment.replies.map(reply => (
                                     <ReplyItem key={reply.id} reply={reply} onVote={onVote} currentUser={currentUser} comment={comment} />
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </ul>   
        </section>
    );
};

export default Commentlist;