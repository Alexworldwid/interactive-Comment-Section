import React, { MouseEventHandler, useState } from 'react';
import { Comment, Reply, User } from './types';
import Image from 'next/image';
import { FaReply } from "react-icons/fa";
import { MdDelete } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import ReplyForm from '../ui/replyForm';
import EditForm from '../ui/editCommentForm';
import DeleteCommentModal from '../ui/deleteCommentModal';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';




interface CommentItemsProps {
    comment: Comment,
    currentUser: User,
    addReply: (content: string, user: User, parentId: number, replyingTo: string ) => void,
    editCommentOrReply: (updatedComment: string, commentId: number, replyId?: number) => void
    deleteCommentOrReply: (commentId: number, replyId?: number) => void,
}

const Commentitems:React.FC<CommentItemsProps> = ({ comment, currentUser, addReply, editCommentOrReply, deleteCommentOrReply }) => {
    const [replying, setReplying] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [vote, setVote] = useState<number>(comment.score);
    const [isOpen, setIsOpen] = useState<boolean> (false);
    const formattedTime = isValid(parseISO(comment.createdAt))
        ? formatDistanceToNow(parseISO(comment.createdAt), { addSuffix: true })
        : 'Invalid date';

    const handleIsReplying = () => {
        setReplying(!replying)
        console.log(replying)
    } 

    const handleEditing = () => {
        setEditing(!editing)
    }

    const handleCommentModal = () => [
        setIsOpen(!isOpen)
    ]


    // PATCH a comment 
    const editComment = async (content: string, commentId: number) => {
        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({content})
            });
            if (!res.ok) {
                throw new Error ('response not ok')
            }
            const data = await res.json();
            console.log(data)
            const updatedContent = data.content
            editCommentOrReply(updatedContent, commentId, undefined);
        } catch (error) {
            console.error(error)
        }
    }

    //PATCH upvote Comment
    const upvoteComment = async (vote: number, commentId: number) => {
        try {
            const res = await fetch(`/api/comments/${commentId}/upvote`, {
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
            if (comment.id === commentId) {
                setVote(data.score);
            }
        } catch (error) {
            console.error(error)
        }
    }

    //PATCH downvote comment
    const DownVote = async (vote: number, commentId: number) => {
        try {
            const res = await fetch(`/api/comments/${commentId}/downvote`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vote })
            })
            if (!res.ok) {
                throw new Error ('response not ok')
            }
            const data = await res.json();
            if (comment.id === commentId) {
                if (vote > 0) {
                    setVote(data.score);
                }
            }
        } catch (error) {
            
        }
    }
    
    return (
        <>
        {currentUser.username !== comment.user.username && (
            <div>
                <div className='bg-white my-5 rounded-lg p-4 pb-0 md:flex md:items-start md:gap-3'>
                    <div className='hidden md:flex bg-slate-200 rounded-lg'>
                        <span className='flex flex-col p-2 '>
                            <button className='text-2xl text-slate-600 font-bold' onClick={() => upvoteComment(1, comment.id)}>+</button>
                            <p className='text-2xl font-bold'>{vote}</p>
                            <button className='text-2xl text-slate-600 font-bold' onClick={() => DownVote(1, comment.id)}>-</button>
                        </span>
                    </div>

                    <div className='md:pb-4'>
                        <span className='flex gap-10 items-center justify-between mb-2'>
                            <span className='flex items-center gap-6'>
                                <Image src={comment.user.image.webp} width={40} height={20} alt={`${comment.user.username} image` } />
                                <p className='font-bold text-xl text-[#5457B6] '>{comment.user.username}</p>
                                <p className='text-[#67727E]'>{comment.createdAt}</p>
                            </span>
                
                            <button onClick={handleIsReplying} className='hidden md:flex items-center gap-2 hover:scale-105 transition-all duration-200 ease-in-out text-[#5457B6] font-bold'>
                                <FaReply  />
                                Reply
                            </button>
                        </span>

                        <span className='md:mb-4'>
                            <p className='text-[#67727E] md:text-xl font-medium'>{comment.content}</p>
                        </span>

                    </div>
                    
                    <span className='flex justify-between items-center pb-4 md:hidden'>
                        <span className='flex gap-3 bg-[#d5dae0] p-2 mt-4 rounded-xl w-28 justify-between items-center'>
                            <button className='text-2xl text-slate-600 font-bold' onClick={() => upvoteComment(1, comment.id)}>+</button>
                            <p className='text-2xl font-bold'>{vote}</p>
                            <button className='text-2xl text-slate-600 font-bold' onClick={() => DownVote(1, comment.id)}>-</button>
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
                                        replyingTo={comment.user.username} 
                                        addReply={addReply} />
                    }
            </div>
            

           
        )}


        {currentUser.username === comment.user.username && (
            <div className='bg-white mb-4 rounded-lg p-4 md:flex items-start gap-3'>
                {/* button on medium screen */}
                <span className='flex-col p-2 hidden md:flex bg-slate-200 rounded-lg'>
                    <button className='text-2xl text-slate-600 font-bold' onClick={() => upvoteComment(1, comment.id)}>+</button>
                    <p className='text-2xl font-bold'>{vote}</p>
                    <button className='text-2xl text-slate-600 font-bold' onClick={() => DownVote(1, comment.id)}>-</button>
                </span>

                <div className='flex flex-col mb-2 gap-3 w-full'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-6'>
                            <Image src={currentUser.image.png} alt={`${currentUser.username} image`} width={40} height={40} />
                            <p className='flex gap-2 items-center text-[#5457B6] text-lg md:text-xl font-bold '>{currentUser.username} 
                                <span className='bg-[#5457B6] text-white px-2 pb-1 text-center rounded-lg'>you</span>
                            </p>
                            <p className='text-slate-600 font-semibold text-lg md:text-xl'>{formattedTime}</p>
                        </div>

                        <div className='md:flex items-center gap-4 hidden'>
                            <button className='flex items-center gap-1 hover:scale-105 transition-all duration-200 ease-in-out text-red-600 font-bold' onClick={handleCommentModal} >
                                <MdDelete />
                                Delete
                            </button>
                            <button className='flex items-center gap-1 hover:scale-105 transition-all duration-200 ease-in-out text-[#5457B6] font-bold' onClick={handleEditing}>
                                <CiEdit />
                                Edit
                            </button>
                        </div>
                    </div>

                    <span className=''>
                        {!editing && (
                            <p className='text-[#67727E] md:text-xl font-medium'> {comment.content}</p>
                        )}
                        
                        {editing && (
                            <EditForm editComment={editComment} commentId={comment.id} content={comment.content} handleIsEditing={handleEditing}  />
                        )}
                    </span>
                </div>
                

                {!editing && (
                     <span className='flex justify-between items-center pb-4 md:hidden'>
                        <span className='flex gap-3 bg-[#d5dae0] p-2 mt-4 rounded-xl w-28 justify-between items-center'>
                            <button className='text-2xl text-slate-600 font-bold' onClick={() => upvoteComment(1, comment.id)}>+</button>
                            <p className='text-2xl font-bold'>{vote}</p>
                            <button className='text-2xl text-slate-600 font-bold' onClick={() => DownVote(1, comment.id)}>-</button>
                        </span>
    
                        <span className='flex items-center gap-4'>
                            <button className='flex items-center gap-1 hover:scale-105 transition-all duration-200 ease-in-out text-red-600 font-bold' onClick={handleCommentModal} >
                                <MdDelete />
                                Delete
                            </button>
                            <button className='flex items-center gap-1 hover:scale-105 transition-all duration-200 ease-in-out text-[#5457B6] font-bold' onClick={handleEditing}>
                                <CiEdit />
                                Edit
                            </button>
                        </span>
                    </span>   
                )}
                

                    {
                      isOpen && <DeleteCommentModal deleteCommentOrReply={deleteCommentOrReply} commentId={comment.id} handleCommentModal={handleCommentModal} />
                    } 
                
            </div>
        )}
        </>
        
    );
};

export default Commentitems;