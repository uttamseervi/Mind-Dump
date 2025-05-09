'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface BlogInteractionsProps {
    postId: string;
}

export default function BlogInteractions({ postId }: BlogInteractionsProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<any[]>([]); // store comments
    const [likes, setLikes] = useState(0); // store total likes
    const [hasLiked, setHasLiked] = useState(false); // track whether the user has liked
    const [commentText, setCommentText] = useState(''); // track comment text

    // Fetch initial comments and likes
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments?postId=${postId}`);
                setComments(response.data || []); // set the comments state
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        const fetchLikes = async () => {
            try {
                const response = await axios.get(`/api/likes?postId=${postId}`);
                setLikes(response.data.likeCount || 0); // set the total likes
                setHasLiked(response.data.liked || false); // set whether user has liked or not
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        };

        fetchComments();
        fetchLikes();
    }, [postId]); // re-fetch on postId change

    // Handle like toggle
    const handleLike = async () => {
        try {
            const response = await axios.post('/api/likes', { postId }); // toggle like status
            setHasLiked(response.data.liked); // update whether the user liked
            setLikes(response.data.likeCount || 0); // update total likes
        } catch (error) {
            toast.error('Failed to like post');
            console.error('Error toggling like:', error);
        }
    };

    // Handle comment posting
    const handleComment = async () => {
        if (!commentText.trim()) return; // prevent empty comment submission

        try {
            const response = await axios.post('/api/comments', {
                postId,
                content: commentText,
            });

            const newComment = response.data;
            setComments((prev) => [newComment, ...prev]); // add new comment to state
            setCommentText(''); // reset the textarea
            toast.success('Comment added!');
        } catch (error) {
            toast.error('Failed to add comment');
            console.error('Error posting comment:', error);
        }
    };

    return (
        <div className="space-y-10 mt-10">
            {/* Likes Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Reactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleLike} variant="outline">
                        {hasLiked ? '💖 Liked' : '🤍 Like'} ({likes})
                    </Button>
                </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Comments ({comments.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Display comment input if the user is logged in */}
                    {session?.user && (
                        <div>
                            <Textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                            />
                            <Button className="mt-2" onClick={handleComment}>
                                Post Comment
                            </Button>
                        </div>
                    )}

                    {/* If no comments */}
                    {comments.length === 0 && (
                        <p className="text-muted-foreground">No comments yet.</p>
                    )}

                    {/* Display comments */}
                    {comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={c.user?.image || ''} />
                                <AvatarFallback>{c.user?.name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold">{c.user?.name || 'Anonymous'}</p>
                                <p className="text-muted-foreground text-sm">{c.content}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
