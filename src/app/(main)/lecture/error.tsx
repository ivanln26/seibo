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
    router.back()
  }, [error])

  return (
    <div className='flex flex-col h-full w-full justify-center items-center gap-5'>
    </div>
  )
}