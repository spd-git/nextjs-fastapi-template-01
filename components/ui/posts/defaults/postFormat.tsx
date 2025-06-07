
"use client";

import { PostImage } from './post-image';

export interface Post {
    id: string;
    caption: string;
    image_prompt: string;
}

export function PostFormat({ post }: { post: Post }) {
    return (

        <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm">
            {
                <div className="relative w-full aspect-square bg-gray-100">
                    <PostImage imagePrompt={post.image_prompt} alt={post.id} />
                </div>
            }
            <div className="p-4">
                <h3 className="font-medium mb-2">Post {post.id}</h3>
                <p className="text-sm text-gray-600">{post.caption}</p>
            </div>
        </div>
    );
}