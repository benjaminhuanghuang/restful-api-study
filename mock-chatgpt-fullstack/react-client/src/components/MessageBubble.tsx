import { memo } from 'react'
import type { ChatMessage } from '../types'

interface MessageBubbleProps {
  message: ChatMessage
  onRetry: (id: string) => void
}

export const MessageBubble = memo(function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75ch] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
          isUser ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'
        }`}
      >
        {message.content}
        {message.status === 'streaming' && (
          <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-neutral-400 align-middle" />
        )}

        {message.status === 'stopped' && (
          <p className="mt-1 text-xs text-neutral-500">Stopped</p>
        )}

        {message.status === 'failed' && (
          <div className="mt-1.5 flex items-center gap-2 text-xs text-red-600">
            <span>Something went wrong.</span>
            <button
              type="button"
              onClick={() => onRetry(message.id)}
              className="font-medium underline underline-offset-2 hover:text-red-700"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  )
})
