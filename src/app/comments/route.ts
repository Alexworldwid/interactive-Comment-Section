import { Content } from "next/font/google";
import { comments } from "../lib/db"

export async function GET() {
    return Response.json(comments)
}

//post new comment
export async function POST(request: Request) {
    const { content, user } = await request.json();

    const newComment = {
        id: comments.length + 1,
        content: content,
        createdAt: new Date().toISOString(),
        score: 0,
        user: user,
        replyingTo: null,
        replies: []
    };

    comments.push(newComment);

    return new Response(JSON.stringify(newComment), {
        headers: {
            'Content-Type': 'application/json',
        },
        status: 201
    });
    
}


