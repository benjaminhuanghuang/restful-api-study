import { useState } from 'react'
import type { FormEvent } from 'react'

interface ChatInputProps {
  isStreaming: boolean
  onSend: (text: string) => void
  onStop: () => void
}

export function ChatInput({ isStreaming, onSend, onStop }: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (isStreaming) return
    onSend(value)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-neutral-200 p-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
        placeholder="Message the mock assistant..."
        rows={1}
        className="max-h-40 flex-1 resize-none rounded-xl border border-neutral-300 px-3 py-2 text-[15px] outline-none focus:border-neutral-500"
      />

      {isStreaming ? (
        <button
          type="button"
          onClick={onStop}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Stop
        </button>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 hover:enabled:bg-neutral-700"
        >
          Send
        </button>
      )}
    </form>
  )
}
