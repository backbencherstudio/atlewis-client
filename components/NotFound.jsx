import React from 'react'

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4 bg-white border-2 border-gray-300 rounded-xl shadow-lg p-10">
        <svg className="w-14 h-14 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm-1.5 4.5h.008v.008h-.008V14.25zm0-6.75a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15z" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800">404 - Page Not Found</h1>
        <p className="text-gray-600 text-center max-w-md">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
      </div>
    </div>
  )
}

export default NotFound