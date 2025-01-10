import Image from 'next/image'
import React from 'react'

interface VolumuProps {
  isEnabled: boolean
  onClick: () => void
}

const Volumu: React.FC<VolumuProps> = ({ isEnabled, onClick }) => {
  return (
    <button onClick={onClick} className="focus:outline-none">
      <Image
        src={isEnabled ? '/images/volume.svg' : '/images/volume-off.svg'}
        alt="Speaker Icon"
        width={56}
        height={56}
      />
    </button>
  )
}

export default Volumu
