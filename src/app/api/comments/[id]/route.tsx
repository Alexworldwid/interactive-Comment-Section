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


export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { content } = await request.json();
        let comments: Comment[] = await readCommentsFromFile();

        // Input validation
        if (!content || typeof content !== 'string') {
            return new Response("Invalid content", { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const index = comments.findIndex(comment => comment.id === parseInt(params.id));

        if (index !== -1) {
            // Update content if the comment exists
            comments[index].content = content;
            await writeCommentsToFile(comments)
            return new Response(JSON.stringify(comments[index]), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else {
            // Return error if comment is not found
            return new Response("Comment not found", { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error) {
        console.error('Error updating comment:', error);
        return new Response("Internal Server Error", { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}


export async function DELETE(request: Request, {params}: {params: {id: string}}) {
    try {
        let comments: Comment[] = await readCommentsFromFile();
        const index = comments.findIndex(comment => comment.id === parseInt(params.id));

        if (index !== -1) {
            // Remove the comment if it exists
            comments.splice(index, 1);
            await writeCommentsToFile(comments);
            return new Response("Comment deleted successfully", { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else {
            // Return error if comment is not found
            return new Response("Comment not found", { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        return new Response("Internal Server Error", { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}