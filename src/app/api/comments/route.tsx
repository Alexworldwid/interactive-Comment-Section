import { Comment } from '@/app/components/utils/types'; 
import { promises as fs } from 'fs';
import path from "path";


// get the path to the file
const dataFilePath = path.join(process.cwd(), 'public', 'data', 'data.json');

//function to read from the saved file
export const readCommentsFromFile = async () => {
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data) as Comment[]
};

//function to write to the file(mock database)
export const writeCommentsToFile = async (comments: Comment[]) => {
  await fs.writeFile(dataFilePath, JSON.stringify(comments, null, 2))
}

//fetch all the comment array
export async function GET() {
    const comments: Comment[] = await readCommentsFromFile();
    return Response.json(comments)
}

//post new comment to the comment array
export async function POST(request: Request) {
    const { content, user } = await request.json();
    let comments: Comment[] = await readCommentsFromFile();

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

    //update the comment array with the new comment 
    await writeCommentsToFile(comments);

    return new Response(JSON.stringify(newComment), {
        headers: {
            'Content-Type': 'application/json',
        },
        status: 201
    });
    
}




