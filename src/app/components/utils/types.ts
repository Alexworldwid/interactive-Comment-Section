export type User = {
    image: { png: string, webp: string },
    username: string
}

export type CommentBase = {
    id: number,
    content: string,
    createdAt: string,
    score: number,
    user: User,
}

export type Comment = CommentBase & {
    replies: Reply[]
}

export type Reply = CommentBase & {
    replyingTo: string
}
