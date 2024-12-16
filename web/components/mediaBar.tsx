import React from 'react'

interface MediaProps {
  image: number // 画像
  audio: number // 音声
  video: number // 動画
  text: number // テキスト
  free: number // 空き容量
  className?: string
}

const MediaBar: React.FC<MediaProps> = ({
  image,
  audio,
  video,
  text,
  free,
  className,
}) => {
  const total = image + audio + video + text + free

  // 各カテゴリの比率を計算
  const imageRatio = (image / total) * 100
  const audioRatio = (audio / total) * 100
  const videoRatio = (video / total) * 100
  const textRatio = (text / total) * 100
  const freeRatio = (free / total) * 100

  return (
    <div
      className={`flex w-full h-2.5 ${className} rounded-full overflow-hidden`}
    >
      {/* 各部分のバーを色分けして表示 */}
      <div
        style={{
          width: `${imageRatio}%`,
        }}
        className="bg-image"
        title={`Image: ${imageRatio.toFixed(1)}%`}
      />
      <div
        style={{
          width: `${audioRatio}%`,
        }}
        className="bg-movie"
        title={`Audio: ${audioRatio.toFixed(1)}%`}
      />
      <div
        style={{
          width: `${videoRatio}%`,
        }}
        className="bg-voice"
        title={`Video: ${videoRatio.toFixed(1)}%`}
      />
      <div
        style={{
          width: `${textRatio}%`,
        }}
        className="bg-text"
        title={`Text: ${textRatio.toFixed(1)}%`}
      />
      <div
        style={{
          width: `${freeRatio}%`,
        }}
        className="bg-free"
        title={`Free: ${freeRatio.toFixed(1)}%`}
      />
    </div>
  )
}

export default MediaBar
