'use client'
import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react'
import React, { useRef, useState } from 'react'

export default function Live() {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null)

  const dotLottieRefCallback = (dotLottie: DotLottie) => {
    setDotLottie(dotLottie)
  }

  function play() {
    if (dotLottie) {
      dotLottie.play()
      dotLottie.unfreeze()
    }
  }

  // 初期タッチ位置を保存する
  const initialTouchY = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    initialTouchY.current = e.touches[0].clientY // 最初のタッチ位置を記録
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (initialTouchY.current !== null) {
      const finalTouchY = e.changedTouches[0].clientY // 指を離した位置を取得
      if (initialTouchY.current > finalTouchY) {
        // 上方向へのスワイプで play を実行
        play()
      }
      // タッチ位置をリセット
      initialTouchY.current = null
    }
  }

  return (
    <div
      className="h-screen w-full touch-none"
      onTouchStart={handleTouchStart} // タッチの開始時に記録
      onTouchEnd={handleTouchEnd} // 指を離した時に処理
    >
      <DotLottieReact
        src="/lotties/capsule.lottie"
        dotLottieRefCallback={dotLottieRefCallback}
      />
    </div>
  )
}
