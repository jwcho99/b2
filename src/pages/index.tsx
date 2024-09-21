import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Home() {
    const router = useRouter()
    const me = useQuery({
        queryKey: ['me'],
        queryFn: async () => await axios.get('/api/me'),
    })

    const logoutMutation = useMutation({
        mutationFn: async () => await axios.post('/api/logout'),
        onSuccess: () => {
            me.refetch()
            window.location.reload()
        },
    })

    const logout = () => logoutMutation.mutate()
    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <div className='bg-white p-8 rounded-xl shadow-md max-w-md w-full'>
                <p className='text-center text-2xl font-semibold mb-6 text-gray-800'>
                    Welcome Back!
                </p>
                {me.data?.data ? (
                    <div>
                        <p className='text-center text-lg mb-4 text-gray-600'>
                            Logged in as:{' '}
                            <strong>{me.data?.data.nickname}</strong>
                        </p>
                        <div className='mt-4'>
                            <button
                                onClick={logout}
                                className='w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='space-y-4'>
                            <button
                                onClick={() => router.push('/signUp')}
                                className='w-full bg-green-600 text-white p-2'
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={() => router.push('/login')}
                                className='w-full bg-indigo-600 text-white p-2'
                            >
                                Log In
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
