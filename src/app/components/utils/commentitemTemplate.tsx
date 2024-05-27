import React, { MouseEventHandler, useState } from 'react';
import { Comment, Reply, User } from './types';
import Image from 'next/image';
import { FaReply } from "react-icons/fa";
import { MdDelete } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import ReplyForm from '../ui/replyForm';
import EditForm from '../ui/editCommentForm';


interface CommentItemsProps {
    comment: Comment,
    currentUser: User,
    addReply: (content: string, user: User, parentId: number, replyingTo: string ) => void,
    editCommentOrReply: (updatedComment: string, commentId: number, replyId?: number) => void
    deleteCommentOrReply: (commentId: number, replyId: number) => void
}

const Commentitems:React.FC<CommentItemsProps> = ({ comment, currentUser, addReply, editCommentOrReply, deleteCommentOrReply}) => {
    const [replying, setReplying] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [vote, setVote] = useState<number>(comment.score)

    const handleIsReplying = () => {
        setReplying(!replying)
        console.log(replying)
    } 

    const handleEditing = () => {
        setEditing(!editing)
    }


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
                <div className='bg-white my-5 rounded-lg p-4 pb-0'>
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
            <div className='bg-white mb-4 rounded-lg p-4 '>
                <span className='flex gap-10 items-center mb-2'>
                    <Image src={currentUser.image.png} alt={`${currentUser.username} image`} width={40} height={40} />
                    <p>{currentUser.username} <span>you</span></p>
                    <p>{comment.createdAt}</p>
                </span>

                <span>
                    {!editing && (
                        <p> {comment.content}</p>
                    )}
                    
                    {editing && (
                        <EditForm 
                        editComment={editComment} 
                        commentId={comment.id} 
                        content={comment.content} 
                        handleIsEditing={handleEditing}  
                        />
                    )}
                    
                </span>

                <span className='flex justify-between items-center pb-4'>
                    <span className='flex gap-3 bg-[#d5dae0] p-2 mt-4 rounded-xl w-28 justify-between items-center'>
                        <button className='text-2xl text-slate-600 font-bold' onClick={() => upvoteComment(1, comment.id)}>+</button>
                        <p className='text-2xl font-bold'>{vote}</p>
                        <button className='text-2xl text-slate-600 font-bold' onClick={() => DownVote(1, comment.id)}>-</button>
                    </span>

                    <span className='flex items-center gap-4'>
                        <button className='flex items-center gap-1 hover:scale-105 transition-all duration-200 ease-in-out text-red-600 font-bold'  onClick={() => deleteCommentOrReply(comment.id, undefined)}>
                            <MdDelete />
                            Delete
                        </button>
                        <button className='flex items-center gap-1 hover:scale-105 transition-all duration-200 ease-in-out text-[#5457B6] font-bold' onClick={handleEditing}>
                            <CiEdit />
                            Edit
                        </button>
                    </span>
                </span>
            </div>
        )}
        </>
        
    );
};

export default Commentitems;