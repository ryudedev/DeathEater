type MessageProps = {
  text: string
  isError: boolean | null // エラー時はtrue
}

export default function Message({ text, isError = false }: MessageProps) {
  return (
    <p className={`text-sm ${!isError ? 'text-[#F95A5A]' : 'text-[#1E9A9A]'}`}>
      {text}
    </p>
  )
}
