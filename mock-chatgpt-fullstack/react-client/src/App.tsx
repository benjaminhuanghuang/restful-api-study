import { useEffect, useRef } from 'react'
import { ChatInput } from './components/ChatInput'
import { MessageBubble } from './components/MessageBubble'
import { useChatStream } from './hooks/useChatStream'

function App() {
  const { messages, isStreaming, send, retry, stop } = useChatStream()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  return (
    <div className="mx-auto flex h-svh w-full max-w-3xl flex-col">
      <header className="border-b border-neutral-200 px-4 py-3">
        <h1 className="text-sm font-semibold text-neutral-900">Mock ChatGPT</h1>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <p className="pt-20 text-center text-sm text-neutral-400">
            Send a message to see the mock LLM stream a response.
          </p>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onRetry={retry} />
        ))}
        <div ref={bottomRef} />
      </main>

      <ChatInput isStreaming={isStreaming} onSend={send} onStop={stop} />
    </div>
  )
}

export default App
