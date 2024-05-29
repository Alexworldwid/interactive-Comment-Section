import React, { useState } from 'react';
import { Comment, Reply, User } from './types';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Image from 'next/image';
import { FaReply } from 'react-icons/fa';
import ReplyForm from '../ui/replyForm';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';
import EditReplyForm from '../ui/editReplyForm';
import DeleteReplyModal from '../ui/deleteReplyModal';

interface ReplyItemProps {
    reply: Reply
    currentUser: User,
    addReply: (content: string, user: User, parentId: number, replyingTo: string ) => void
    editCommentOrReply: (updatedComment: string, commentId: number, replyId?: number) => void
    comment: Comment,
    deleteCommentOrReply: (commentId: number, replyId: number) => void,
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, currentUser, addReply, editCommentOrReply, comment, deleteCommentOrReply }) => {
    const [replying, setReplying] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [replyScore, setReplyScore] = useState<number>(reply.score);
    const [deleteReplyModalIsOpen, setDeleteReplyModalIsOpen] = useState<boolean>(false);
    const formattedTime = isValid(parseISO(reply.createdAt))
        ? formatDistanceToNow(parseISO(reply.createdAt), { addSuffix: true })
        : 'Invalid date';

    const handleIsReplying = () => {
        setReplying(!replying)
        console.log(replying)
    } 

    const handleIsEditing = () => {
        setEditing(!editing);
    }

    const handleDeleteReplyModal = () => {
        setDeleteReplyModalIsOpen(!deleteReplyModalIsOpen);
    }

    //Patch a reply 
    const editReply = async (content: string, parentId: number, replyId?: number) => {
        try {
            const res = await fetch(`/api/comments/${parentId}/${replyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({content})
            })
            if(!res.ok) {
                throw new Error('error fetching data')
            }
            const data: Reply = await res.json();
            console.log(data)
            const updatedReply = data.content;
            editCommentOrReply(updatedReply, parentId, replyId)
        } catch (error) {
            console.error(error);
        }
    }

    // upvote the reply score
    const upVote = async (vote: number, parentId: number, replyId: number) => {
        try {
            const res = await fetch(`/api/comments/${parentId}/${replyId}/upvote`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vote })
            });
            if (!res.ok) {
                throw new Error ('response not ok')
            }
            const data = await res.json();
            if (comment.id === parentId) {
                if (reply.id === replyId) {
                    setReplyScore(data.score);
                }
            }
        } catch (error) {
            console.error(error)
        }
        
    }


        // upvote the reply score
        const downVote = async (vote: number, parentId: number, replyId: number) => {
            try {
                const res = await fetch(`/api/comments/${parentId}/${replyId}/downvote`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ vote })
                });
                if (!res.ok) {
                    throw new Error ('response not ok')
                }
                const data = await res.json();
                if (comment.id === parentId) {
                    if (reply.id === replyId) {
                        setReplyScore(data.score);
                    }
                }
            } catch (error) {
                console.error(error)
            }
            
        }
    
    return (
        <>
        {currentUser.username !== reply.user.username && (
            <li className='w-[90%]'>
                <div className='bg-white mb-4 rounded-lg p-4 w-full'>
                    <span className='flex gap-10 items-center mb-2'>
                        <Image src={reply.user.image.webp} width={40} height={20} alt={`${reply.user.username} image`} />
                        <p className='text-[#5457B6] text-lg md:text-xl font-bold'>{reply.user.username}</p>
                        <p className='text-lg md:text-xl text-slate-400 font-semibold'>{reply.createdAt}</p>
                    </span>

                    <span>
                        <p className='text-lg md:text-xl font-semibold text-slate-400'><span className='text-[#5457B6] font-bold'>@{reply.replyingTo} </span>{reply.content}</p>

                    </span>

                    <span className='flex justify-between items-center pb-4'>
                        <span className='flex gap-3 bg-[#d5dae0] p-2 mt-4 rounded-xl w-28 justify-between items-center'>
                            <button className='text-2xl text-slate-600 font-bold' onClick={() => upVote(1, comment.id, reply.id)}>+</button>
                            <p className='text-2xl font-bold'>{replyScore}</p>
                            <button className='text-2xl text-slate-600 font-bold' onClick={() => downVote(1, comment.id, reply.id)}>-</button>
                        </span>

                        <button onClick={handleIsReplying} className='flex items-center gap-2 hover:scale-105 transition-all duration-200 ease-in-out text-[#5457B6] font-bold'>
                            <FaReply  />
                            Reply
                        </button>
                    </span>
                </div>

                {
                replying && <ReplyForm 
                                currentUser={currentUser} 
                                parentId={comment.id} 
                                handleIsReplying={handleIsReplying} 
                                replyingTo={reply.user.username} 
                                addReply={addReply} />
                }

                    
            </li>
            
        )}

        {currentUser.username === reply.user.username && (
            <li className='bg-white mb-4 rounded-lg p-4 w-[90%]'>
                <span className='flex gap-10 items-center mb-2'>
                    <Image src={currentUser.image.png} alt={`${currentUser.username} image`} width={40} height={40} />
                    <p>{currentUser.username} <span>you</span></p>
                    <p>{formattedTime}</p>
                </span>

                <span>
                    {!editing && (
                         <p className='text-[#5457B6] font-bold'>@{reply.replyingTo} <span className='text-lg md:text-xl font-semibold text-slate-400'>{reply.content}</span></p>
                    )}
                   
                 {editing && (
                       <EditReplyForm 
                       content={reply.content} 
                       parentId={comment.id} 
                       replyId={reply.id} 
                       replyingTo={reply.replyingTo} 
                       editReply={editReply} 
                       handleIsEditing={handleIsEditing}
                       /> 
                   )}
                    
                </span>

                <span className='flex justify-between items-center pb-4'>
                    <span className='flex gap-3 bg-[#d5dae0] p-2 mt-4 rounded-xl w-28 justify-between items-center'>
                        <button className='text-2xl text-slate-600 font-bold' onClick={() => upVote(1, comment.id, reply.id)}>+</button>
                        <p className='text-2xl font-bold'>{replyScore}</p>
                        <button className='text-2xl text-slate-600 font-bold' onClick={() => downVote(1, comment.id, reply.id)}>-</button>
                    </span>

                    {!editing && (
                        <span className='flex items-center gap-4'>
                            <button className='flex items-center gap-1 hover:scale-105 transition-all duration-200 ease-in-out text-red-600 font-bold' onClick={handleDeleteReplyModal}>
                                <MdDelete />
                                Delete
                            </button>
                            
                            <button onClick={handleIsEditing} className='flex items-center gap-1 hover:scale-105 transition-all duration-200 ease-in-out text-[#5457B6] font-bold' >
                                <CiEdit />
                                Edit
                            </button>
                        </span>
                    )}
                    
                </span>

                { deleteReplyModalIsOpen && <DeleteReplyModal deleteCommentOrReply={deleteCommentOrReply} commentId={comment.id} replyId={reply.id} handleDeleteReply={handleDeleteReplyModal} /> }
            </li>
        )}
    </>
        
    );
};

export default ReplyItem;