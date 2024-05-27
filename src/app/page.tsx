"use client";

import Image from "next/image";
import Commentlist from "./components/ui/commentlist";
import { useEffect, useState } from "react";
import { User, Comment, Reply } from "./components/utils/types";
import { currentUser } from "./lib/db"; 


export default function Home() {
  const [comments, setComments] = useState<Comment[]>([]);
  const user: User = currentUser;

  //add comment Logic
  const addNewComment = (newComment: Comment) => {
    setComments((prevComments) => [...prevComments, { ...newComment, id: prevComments.length + 1 }]);
  }

  //add reply Logic
  const addNewReply = (parentId: number, newReply: Reply) => {
    setComments((prevComments) => 
      prevComments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, { ...newReply, id: comment.replies.length + 1 }]
          };
        } 
        return comment;
      })
    );
  };

  //update comment or reply Logic
  const editCommentOrReply = (updatedContent: string, commentId: number, replyId?: number) => {
    try {
        setComments((prevComments) => 
            prevComments.map(comment => {
                if (comment.id === commentId) {
                    if (replyId === undefined) {
                        // Update comment content
                        return { ...comment, content: updatedContent };
                    } else {
                        // Update reply content
                        const updatedReplies = comment.replies.map(reply =>
                            reply.id === replyId ? { ...reply, content: updatedContent } : reply
                        );
                        return { ...comment, replies: updatedReplies };
                    }
                }
                return comment;
            })
        );
    } catch (error) {
        console.error('Error updating comment or reply:', error);
    }
  };

  //delete comment or reply 
const deleteCommentOrReply = async (commentId: number, replyId?: number) => {
  try {
      // If replyId is provided, delete the reply
      if (replyId !== undefined) {
          const res = await fetch(`/api/comments/${commentId}/${replyId}`, {
              method: 'DELETE',
          });
          if (!res.ok) {
              throw new Error('Failed to delete reply');
          }
      } else {
          // If replyId is not provided, delete the comment
          const res = await fetch(`/api/comments/${commentId}`, {
              method: 'DELETE',
          });
          if (!res.ok) {
              throw new Error('Failed to delete comment');
          }
      }

      // After successful deletion, update the state to reflect the changes
      setComments((prevComments) => {
          if (replyId !== undefined) {
              return prevComments.map(comment => {
                  if (comment.id === commentId) {
                      const updatedReplies = comment.replies.filter(reply => reply.id !== replyId);
                      return { ...comment, replies: updatedReplies };
                  }
                  return comment;
              });
          } else {
              return prevComments.filter(comment => comment.id !== commentId);
          }
      });
  } catch (error) {
      console.error('Error deleting comment or reply:', error);
  }
}


  //fetch Comment when Component mounts
  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch('/api/comments');
      if(!res.ok) {
        throw new Error('res not ok');
      }
      const data = await res.json();
      setComments(data);
    }

    fetchComments();
  }, []);

  
  
  return (
    <main className="bg-[#EAECF1] p-6 pt-8">
      <Commentlist 
      comments={comments} 
      user={user} 
      addNewComment={addNewComment} 
      addNewReply={addNewReply} 
      editCommentOrReply={editCommentOrReply}
      deleteCommentOrReply={deleteCommentOrReply}  />
    </main>
  );
}
