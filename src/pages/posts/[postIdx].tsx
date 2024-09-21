import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function PostDetail() {
    const router = useRouter()
    const { postIdx } = router.query
    const me = useQuery({
        queryKey: ['me'],
        queryFn: async () => await axios.get('/api/me'),
    })

    const userIdx = me.data?.data.idx
    const { data: post, refetch } = useQuery({
        queryKey: ['post', postIdx],
        queryFn: async () => {
            const { data } = await axios.get(`/api/posts/${postIdx}`)
            return data
        },
        enabled: !!postIdx,
    })
    const deletePostMutation = useMutation({
        mutationFn: async (postIdx: number) =>
            await axios.delete(`/api/posts/${postIdx}`),
        onError: (error: any) => {
            if (error.response?.status === 403) {
                alert(error.response.data.message)
            } else {
                alert('An unexpected error occurred')
            }
        },
        onSuccess: () => router.push('/posts'),
    })
    const [isEditing, setIsEditing] = useState(false)
    const [editedTitle, setEditedTitle] = useState(post?.title || '')
    const [editedContent, setEditedContent] = useState(post?.content || '')

    const [isEditingComment, setIsEditingComment] = useState<number | null>(
        null
    )
    const [editedCommentContent, setEditedCommentContent] = useState('')

    const updatePostMutation = useMutation({
        mutationFn: async ({ title, content }: any) =>
            await axios.put(`/api/posts/${postIdx}`, { title, content }),
        onError: (error: any) => {
            if (error.response?.status === 403) {
                alert(error.response.data.message)
            } else {
                alert('An unexpected error occurred')
            }
        },
        onSuccess: () => {
            setIsEditing(false)
            refetch()
        },
    })

    const handleEdit = () => {
        setIsEditing(true)
    }
    const handleSave = () => {
        updatePostMutation.mutate({
            title: editedTitle,
            content: editedContent,
        })
    }
    const handleCancel = () => {
        setIsEditing(false)
        setEditedTitle(post?.title || '')
        setEditedContent(post?.content || '')
    }
    const createCommentMutation = useMutation({
        mutationFn: async (newComment: { content: string }) =>
            await axios.post(`/api/posts/${postIdx}/comments`, newComment),
        onSuccess: () => refetch(),
    })
    const updateCommentMutation = useMutation({
        mutationFn: async ({ commentIdx, content }: any) =>
            await axios.put(`/api/comments/${commentIdx}`, { content }),
        onSuccess: () => {
            setIsEditingComment(null)
            refetch()
        },
    })

    const deleteCommentMutation = useMutation({
        mutationFn: async (commentIdx: number) =>
            await axios.delete(`/api/comments/${commentIdx}`),
        onSuccess: () => refetch(),
    })
    const handleCommentEdit = (comment: any) => {
        setIsEditingComment(comment.idx)
        setEditedCommentContent(comment.content)
    }

    const handleCommentSave = (commentIdx: number) => {
        updateCommentMutation.mutate({
            commentIdx,
            content: editedCommentContent,
        })
    }

    return (
        <div className='container mx-auto p-4'>
            {isEditing ? (
                <>
                    <input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className='text-2xl font-bold mb-4 w-full p-2 border rounded'
                    />
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className='w-full p-2 border rounded mb-4'
                        rows={6}
                    />
                    <button
                        onClick={handleSave}
                        className='bg-green-500 text-white py-2 px-4 rounded-md mr-2'
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className='bg-gray-500 text-white py-2 px-4 rounded-md'
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <>
                    <h1 className='text-2xl font-bold mb-4'>{post?.title}</h1>
                    <p>{post?.content}</p>

                    {post?.authorIdx === userIdx && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    deletePostMutation.mutate(post.idx)
                                }}
                                className='bg-red-500 text-white py-1 px-2 rounded mt-2'
                            >
                                Delete
                            </button>
                            <button
                                onClick={handleEdit}
                                className='bg-yellow-500 text-white py-1 px-2 rounded mt-2 ml-2'
                            >
                                Edit
                            </button>
                        </>
                    )}
                </>
            )}
            <div className='mt-6'>
                <h2 className='text-xl font-semibold'>Comments</h2>
                <div className='space-y-4 mt-4'>
                    {post?.comments.map((comment: any) => (
                        <div key={comment.idx} className='border p-2 rounded'>
                            {isEditingComment === comment.idx ? (
                                <>
                                    <textarea
                                        value={editedCommentContent}
                                        onChange={(e) =>
                                            setEditedCommentContent(
                                                e.target.value
                                            )
                                        }
                                        className='w-full p-2 border rounded mb-2'
                                    />
                                    <button
                                        onClick={() =>
                                            handleCommentSave(comment.idx)
                                        }
                                        className='bg-green-500 text-white py-1 px-2 rounded mt-2'
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() =>
                                            setIsEditingComment(null)
                                        }
                                        className='bg-gray-500 text-white py-1 px-2 rounded mt-2 ml-2'
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>
                                        <strong>Author </strong>
                                        {comment.author.nickname}
                                    </p>
                                    <p>{comment.content}</p>
                                    {comment?.authorIdx === userIdx && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteCommentMutation.mutate(
                                                        comment.idx
                                                    )
                                                }}
                                                className='bg-red-500 text-white py-1 px-2 rounded mt-2'
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleCommentEdit(comment)
                                                }
                                                className='bg-yellow-500 text-white py-1 px-2 rounded mt-2 ml-2'
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className='mt-4'>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        createCommentMutation.mutate({
                            content: e.currentTarget.comment.value,
                        })
                        e.currentTarget.comment.value = ''
                    }}
                >
                    <textarea
                        name='comment'
                        className='border rounded w-full p-2 mb-2'
                        placeholder='Write a comment...'
                    />
                    <button
                        type='submit'
                        className='bg-blue-500 text-white py-2 px-4 rounded-md'
                    >
                        Post Comment
                    </button>
                </form>
            </div>
        </div>
    )
}
