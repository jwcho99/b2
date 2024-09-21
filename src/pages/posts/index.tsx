import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Posts() {
    const router = useRouter()
    const { page } = router.query
    const [isCreating, setIsCreating] = useState(false)

    let pageNumber = 1
    if (page !== undefined && !Array.isArray(page)) {
        pageNumber = parseInt(page, 10)
    }
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['posts', pageNumber],
        queryFn: async () => {
            const response = await axios.get(`/api/posts`, {
                params: { page: pageNumber },
            })
            return response.data
        },
    })
    const createPostMutation = useMutation({
        mutationFn: async (newPost: { title: string; content: string }) =>
            await axios.post('/api/posts', newPost),
        onSuccess: () => {
            setIsCreating(false)
            refetch()
        },
    })
    const handleSubmit = (e: any) => {
        e.preventDefault()
        const title = e.currentTarget.title.value
        const content = e.currentTarget.content.value
        createPostMutation.mutate({ title, content })
    }
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error fetching posts</div>

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold m-6'>Posts</h1>

            {isCreating ? (
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label
                            htmlFor='title'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Title
                        </label>
                        <input
                            type='text'
                            id='title'
                            name='title'
                            required
                            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>
                    <div>
                        <label
                            htmlFor='content'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Content
                        </label>
                        <textarea
                            id='content'
                            name='content'
                            required
                            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                        Create Post
                    </button>
                    <button
                        type='button'
                        className='w-full bg-gray-500 text-white py-2 px-4 rounded-md shadow mt-2'
                        onClick={() => setIsCreating(false)}
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className='bg-blue-500 text-white py-2 px-4 rounded-md shadow mb-4'
                    >
                        Create New Post
                    </button>
                    <div className='grid grid-cols-1 gap-4'>
                        {data.posts.map((post: any) => (
                            <div
                                key={post.idx}
                                className='p-4 border rounded-md shadow'
                                onClick={() =>
                                    router.push(`/posts/${post.idx}`)
                                }
                            >
                                <h2 className='text-xl font-semibold'>
                                    {post.title}
                                </h2>
                                <p>{post.content}</p>
                            </div>
                        ))}
                    </div>
                    {/* Pagination controls */}
                    <div className='mt-6'>
                        <button
                            onClick={() =>
                                router.push(`/posts?page=${pageNumber - 1}`)
                            }
                            disabled={pageNumber <= 1}
                            className='mr-2'
                        >
                            Previous
                        </button>
                        <button
                            onClick={() =>
                                router.push(`/posts?page=${pageNumber + 1}`)
                            }
                            disabled={pageNumber >= data.totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
