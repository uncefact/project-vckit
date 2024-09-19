export const scrollMessages = (smooth?: boolean) => {
  document.getElementById('chat-window')?.scrollTo({
    top: document.getElementById('chat-window')?.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto',
  })
}
