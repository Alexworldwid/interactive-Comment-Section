"use client";

import Image from "next/image";
import Commentlist from "./components/ui/commentlist";
import Form from "./components/ui/form";
import { useEffect, useState } from "react";
import { User, Comment } from "./components/utils/types";
import { currentUser } from "c:/Users/Adewale Obadun/myproject/interactive-comments-section-main/src/app/lib/db"



export default function Home() {
  const [comments, setComments] = useState<Comment[]>([]);
  const user: User = currentUser;

  
  //fetch comments from API
  const fetchComments = async () => {
    try {
      const res = await fetch('/comments');
      if(!res.ok) {
        throw new Error ('response not ok :(')
      }
      const data = await res.json();
      setComments(data);
      console.log(data, res.statusText, res.status, res);
    } catch (error) {
      console.error(error);
    }
  };


  //Add a new top comment by sending a Post request to the API 
  const addComment = async (content: string, user: User) => {
    const res = await fetch('/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content, user })
    });

    const newComment = await res.json();
    setComments([...comments, newComment]);
  };


  //Handle upvote and downvote by sending a PATCH request to the API
  const handleVote = async (id:number, type: 'up' | 'down') => {
    const comment = comments.find(comment => comment.id === id);
    if (comment) {
      const updatedComment = {
        ...comment, 
        score: type === 'up' ? comment.score + 1 : comment.score - 1
      }

      await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedComment)
      });

      setComments(comments.map(comment => (comment.id === id ? updatedComment : comment)))
    }
  };


  useEffect(() => {
    fetchComments();
  }, [])


  return (
    <main className="bg-[#EAECF1] p-6 pt-8">
      <Commentlist comments={comments} onVote={handleVote} currentUser={user} />
      <Form onSubmit={addComment} currentUser={user} />
    </main>
  );
}
