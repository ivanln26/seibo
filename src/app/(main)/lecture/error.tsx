'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import Button from '@/components/button'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className='flex flex-col h-full w-full justify-center items-center gap-5'>
      <h2 className='text-4xl'>{error.message}</h2>
      <Button onClick={() => router.back()}>Volver</Button>
    </div>
  )
}