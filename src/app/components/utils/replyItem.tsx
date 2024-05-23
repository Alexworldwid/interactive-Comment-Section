import React from 'react';
import { Comment, Reply, User } from './types';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Image from 'next/image';
import { comment } from 'postcss';
import { FaReply } from 'react-icons/fa';

interface ReplyItemProps {
    onVote: (id: number, type: 'up' | 'down') => void;
    reply: Reply;
    currentUser: User;
    comment: Comment
}

const ReplyItem: React.FC<ReplyItemProps> = ({ onVote, reply, currentUser, comment }) => {
    return (
        <>
        {currentUser.username !== reply.user.username && (
            <li className='bg-white mb-4 rounded-lg p-4 w-[90%]'>
                <span className='flex gap-10 items-center mb-2'>
                    <Image src={reply.user.image.webp} width={40} height={20} alt={`${reply.user.username} image`} />
                    <p>{reply.user.username}</p>
                    <p>{reply.createdAt}</p>
                </span>

                <span>
                    <p><span>@{comment.user.username} </span>{reply.content}</p>
                </span>

                <span className='flex justify-between items-center pb-4'>
                    <span className='flex gap-3 bg-[#d5dae0] p-2 mt-4 rounded-xl w-28 justify-between items-center'>
                        <button className='text-2xl text-slate-600 font-bold' onClick={() => onVote(reply.id, 'up')}>+</button>
                        <p className='text-2xl font-bold'>{reply.score}</p>
                        <button className='text-2xl text-slate-600 font-bold' onClick={() => onVote(reply.id, 'down')}>-</button>
                    </span>

                    <button className='flex items-center gap-2 hover:scale-105 transition-all duration-200 ease-in-out text-[#5457B6] font-bold'>
                       <FaReply  />
                       Reply
                    </button>
                </span>
            </li>
        )}

        {currentUser.username === reply.user.username && (
            <li className='bg-white mb-4 rounded-lg p-4 w-[90%]'>
                <span className='flex gap-10 items-center mb-2'>
                    <Image src={currentUser.image.png} alt={`${currentUser.username} image`} width={40} height={40} />
                    <p>{currentUser.username} <span>you</span></p>
                    <p>{reply.createdAt}</p>
                </span>

                <span>
                    <p><span>@{comment.user.username}</span> {reply.content}</p>
                </span>

                <span className='flex justify-between items-center pb-4'>
                    <span className='flex gap-3 bg-[#d5dae0] p-2 mt-4 rounded-xl w-28 justify-between items-center'>
                        <button className='text-2xl text-slate-600 font-bold' onClick={() => onVote(reply.id, 'up')}>+</button>
                        <p className='text-2xl font-bold'>{reply.score}</p>
                        <button className='text-2xl text-slate-600 font-bold' onClick={() => onVote(reply.id, 'down')}>-</button>
                    </span>

                    <span className='flex items-center gap-4'>
                        <button className='flex items-center gap-1 hover:scale-105 transition-all duration-200 ease-in-out text-red-600 font-bold'>
                            <MdDelete />
                            Delete
                        </button>
                        <button className='flex items-center gap-1 hover:scale-105 transition-all duration-200 ease-in-out text-[#5457B6] font-bold'>
                            <CiEdit />
                            Edit
                        </button>
                    </span>
                </span>
            </li>
        )}
    </>
        
    );
};

export default ReplyItem;