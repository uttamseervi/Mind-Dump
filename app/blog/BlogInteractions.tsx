'use client'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, Edit, Trash2, X, Check } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface User {
    id: string;
    name: string | null;
    image: string | null;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: User;
}

interface BlogInteractionsProps {
    postId: string;
}

export default function BlogInteractions({ postId }: BlogInteractionsProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [likedUsers, setLikedUsers] = useState<User[]>([]);
    const [showLikedUsers, setShowLikedUsers] = useState(false);
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    // Fetch initial comments and likes
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments?postId=${postId}`);
                setComments(response.data || []);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        const fetchLikes = async () => {
            try {
                const response = await axios.get(`/api/likes?postId=${postId}`);
                setLikes(response.data.likeCount || 0);
                setHasLiked(response.data.liked || false);
                setLikedUsers(response.data.likes || []);
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        };

        fetchComments();
        fetchLikes();
    }, [postId]);

    // Handle like toggle
    const handleLike = async () => {
        try {
            const response = await axios.post('/api/likes', { postId });
            setHasLiked(response.data.liked);
            setLikes(response.data.likeCount || 0);

            // Refresh the liked users list
            const likesResponse = await axios.get(`/api/likes?postId=${postId}`);
            setLikedUsers(likesResponse.data.likes || []);
        } catch (error) {
            toast.error('Failed to like post');
            console.error('Error toggling like:', error);
        }
    };

    // Handle comment posting
    const handleComment = async () => {
        if (!commentText.trim()) return;

        try {
            const response = await axios.post('/api/comments', {
                postId,
                content: commentText,
            });

            const newComment = response.data;
            setComments((prev) => [newComment, ...prev]);
            setCommentText('');
            toast.success('Comment added!');
        } catch (error) {
            toast.error('Failed to add comment');
            console.error('Error posting comment:', error);
        }
    };

    // Handle comment editing
    const handleEditComment = async (commentId: string) => {
        if (!editText.trim()) return;

        try {
            const response = await axios.put('/api/comments', {
                commentId,
                content: editText,
            });

            const updatedComment = response.data;
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId ? updatedComment : comment
                )
            );
            setEditingComment(null);
            setEditText('');
            toast.success('Comment updated!');
        } catch (error) {
            toast.error('Failed to update comment');
            console.error('Error updating comment:', error);
        }
    };

    // Handle comment deletion
    const handleDeleteComment = async (commentId: string) => {
        try {
            await axios.delete(`/api/comments?commentId=${commentId}`);
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
            toast.success('Comment deleted!');
        } catch (error) {
            toast.error('Failed to delete comment');
            console.error('Error deleting comment:', error);
        }
    };

    // Start editing a comment
    const startEdit = (comment: Comment) => {
        setEditingComment(comment.id);
        setEditText(comment.content);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingComment(null);
        setEditText('');
    };

    // Check if current user can edit/delete a comment
    const canModifyComment = (comment: Comment) => {
        return session?.user?.email && comment.author.name === session.user.name;
    };

    return (
        <div className="space-y-10 mt-10">
            {/* Likes Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Reactions ({likes})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={handleLike} variant="outline">
                        {hasLiked ? '💖 Liked' : '🤍 Like'}
                    </Button>

                    {/* Show who has liked with dropdown */}
                    {likedUsers.length > 0 && (
                        <div className="mt-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowLikedUsers(!showLikedUsers)}
                                className="flex items-center gap-2 p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
                            >
                                {showLikedUsers ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                                {likedUsers.length} {likedUsers.length === 1 ? 'person' : 'people'} liked this
                            </Button>

                            {showLikedUsers && (
                                <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                                    {likedUsers.map((user) => (
                                        <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={user.image || ''} />
                                                <AvatarFallback className="text-sm">
                                                    {user.name?.[0] || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium">{user.name || 'Unknown User'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
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
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={comment.author?.image || ''} />
                                <AvatarFallback>
                                    {comment.author?.name?.[0] || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">
                                        {comment.author?.name || 'Unknown User'}
                                    </p>
                                    {canModifyComment(comment) && (
                                        <div className="flex items-center gap-1">
                                            {editingComment === comment.id ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEditComment(comment.id)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={cancelEdit}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => startEdit(comment)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete this comment? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteComment(comment.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {editingComment === comment.id ? (
                                    <div className="mt-2">
                                        <Textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm">{comment.content}</p>
                                )}

                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
