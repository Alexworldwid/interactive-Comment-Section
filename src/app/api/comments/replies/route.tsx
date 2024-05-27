import { Comment } from "@/app/components/utils/types";
import { promises as fs } from 'fs';
import path from "path";



const dataFilePath = path.join(process.cwd(), 'public', 'data', 'data.json');

export const readCommentsFromFile = async () => {
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data) as Comment[]
};

export const writeCommentsToFile = async (comments: Comment[]) => {
  await fs.writeFile(dataFilePath, JSON.stringify(comments, null, 2))
}


// Handle POST requests for replies
export async function POST(request: Request) {
    const { content, user, parentId, replyingTo } = await request.json();
    let comments: Comment[] = await readCommentsFromFile();

    const parentComment = comments.find(comment => comment.id === parentId);
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
        replyingTo: replyingTo,

    };

    parentComment.replies.push(newReply);
    await writeCommentsToFile(comments);

    return new Response(JSON.stringify(newReply), {
        headers: {
            'Content-Type': 'application/json',
        },
        status: 201
    });
}