import Image from 'next/image'
import React from 'react'

interface MicProps {
  isEnabled: boolean
  onClick: () => void
}

const Mic: React.FC<MicProps> = ({ isEnabled, onClick }) => {
  return (
    <button onClick={onClick} className="focus:outline-none">
      <Image
        src={isEnabled ? '/images/mic.svg' : '/images/mic-off.svg'}
        alt="Mic Icon"
        width={56}
        height={56}
      />
    </button>
  )
}

export default Mic
