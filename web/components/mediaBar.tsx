import React, { useState } from 'react'

interface MediaProps {
  image: number
  imageType: string
  imageRatio: number
  audio: number
  audioType: string
  audioRatio: number
  video: number
  videoType: string
  videoRatio: number
  text: number
  textType: string
  textRatio: number
  free: number
  freeType: string
  freeRatio: number
  className?: string
}

const MediaBar: React.FC<MediaProps> = ({
  // 画像のKB
  image,
  imageType,
  // 画像のGB
  imageRatio,
  audio,
  audioType,
  audioRatio,
  video,
  videoType,
  videoRatio,
  text,
  textType,
  textRatio,
  free,
  freeType,
  freeRatio,
  className,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const categories = [
    {
      name: '画像',
      ratio: imageRatio,
      color: 'bg-image',
      size: image,
      type: imageType,
    },
    {
      name: '音声',
      ratio: audioRatio,
      color: 'bg-movie',
      size: audio,
      type: audioType,
    },
    {
      name: '動画',
      ratio: videoRatio,
      color: 'bg-voice',
      size: video,
      type: videoType,
    },
    {
      name: 'テキスト',
      ratio: textRatio,
      color: 'bg-text',
      size: text,
      type: textType,
    },
    {
      name: '空き容量',
      ratio: freeRatio,
      color: 'bg-free',
      size: free,
      type: freeType,
    },
  ]

  return (
    <div className="relative">
      <div
        className={`flex w-full h-2.5 ${className} rounded-full overflow-hidden`}
      >
        {categories.map((category) => (
          <div
            key={category.name}
            style={{ width: `${category.ratio}%` }}
            className={`${category.color} relative`}
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          />
        ))}
      </div>
      {hoveredCategory && (
        <div className="absolute top-full left-0 mt-1 bg-black text-white text-xs p-1 rounded shadow-lg z-10">
          {categories.find((c) => c.name === hoveredCategory) && (
            <>
              <div>
                {hoveredCategory}:{' '}
                {categories
                  .find((c) => c.name === hoveredCategory)!
                  .ratio.toFixed(1)}
                %
              </div>
              <div>
                容量:{' '}
                {categories
                  .find((c) => c.name === hoveredCategory)!
                  .size.toFixed(2)}{' '}
                {categories.find((c) => c.name === hoveredCategory)!.type}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MediaBar
