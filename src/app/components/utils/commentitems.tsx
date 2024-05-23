import React from 'react';
import { Comment } from './types';
import Image from 'next/image';
import { FaReply } from "react-icons/fa";


interface CommentItemsProps {
    onVote: (id: number, type: 'up' | 'down') => void;
    comment: Comment
}

const Commentitems:React.FC<CommentItemsProps> = ({ onVote, comment }) => {
    return (
        <li className='bg-white my-5 rounded-lg p-4 pb-0'>
            <span className='flex gap-10 items-center mb-2'>
                <Image src={comment.user.image.webp} width={40} height={20} alt={`${comment.user.username} image` } />
                <p className='font-bold text-xl'>{comment.user.username}</p>
                <p className='text-[#67727E]'>{comment.createdAt}</p>
            </span>

            <span>
                <p className='text-[#67727E] md:text-xl font-medium'>{comment.content}</p>
            </span>

            <span className='flex justify-between items-center pb-4'>
                <span className='flex gap-3 bg-[#d5dae0] p-2 mt-4 rounded-xl w-28 justify-between items-center'>
                    <button className='text-2xl text-slate-600 font-bold' onClick={() => onVote(comment.id, 'up')}>+</button>
                    <p className='text-2xl font-bold'>{comment.score}</p>
                    <button className='text-2xl text-slate-600 font-bold' onClick={() => onVote(comment.id, 'down')}>-</button>
                </span>

                <button className='flex items-center gap-2 hover:scale-105 transition-all duration-200 ease-in-out text-[#5457B6] font-bold'>
                    <FaReply  />
                    Reply
                </button>
            </span>
        </li>
    );
};

export default Commentitems;