export type MessageRole = 'user' | 'assistant'

export type MessageStatus = 'streaming' | 'completed' | 'failed' | 'stopped'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  status?: MessageStatus
}
