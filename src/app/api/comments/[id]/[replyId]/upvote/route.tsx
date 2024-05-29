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


export async function PATCH(request: Request, { params }: { params: { id: string, replyId: string } }) {
    try {
        let comments: Comment[] = await readCommentsFromFile()
        const { vote } = await request.json();
        const parentId = parseInt(params.id);
        const replyId = parseInt(params.replyId);

        console.log(`Received request to update reply with ID: ${replyId} under comment with ID: ${parentId}`);
        console.log('Request body:', { vote, parentId });

        const parentComment = comments.find(comment => comment.id === parentId);
        console.log('Found parent comment:', parentComment);

        if (parentComment) {
            const replyIndex = parentComment.replies.findIndex(reply => reply.id === replyId);
            console.log('Found reply index:', replyIndex);

            if (replyIndex !== -1) {
                parentComment.replies[replyIndex].score += vote;
                await writeCommentsToFile(comments)
                return new Response(JSON.stringify(parentComment.replies[replyIndex]), { status: 200, headers: { 'Content-Type': 'application/json' } });
            } else {
                return new Response("Reply not found", { status: 404, headers: { 'Content-Type': 'application/json' } });
            }
        } else {
            return new Response("Parent comment not found", { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error) {
        console.error('Error updating reply:', error);
        return new Response("Error updating reply", { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}