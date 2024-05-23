import { comments } from "@/app/lib/db"; 


// Handle POST requests for replies
export async function POST(request: Request) {
    const { content, user, parentCommentId } = await request.json();

    const parentComment = comments.find(comment => comment.id === parentCommentId);
    if (!parentComment) {
        return new Response(JSON.stringify({ error: 'Parent comment not found' }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 404
        });
    }

    const newReply = {
        id: parentComment.replies.length + 1, // Unique ID within the replies
        content: content,
        createdAt: new Date().toISOString(),
        score: 0,
        user: user,
        replyingTo: parentComment.user.username,

    };

    parentComment.replies.push(newReply);

    return new Response(JSON.stringify(newReply), {
        headers: {
            'Content-Type': 'application/json',
        },
        status: 201
    });
}