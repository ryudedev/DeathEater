type DeleteIconProps = {
  size?: number
  color?: string
  strokeWidth?: number
  rotate?: number
}

export default function DeleteIcon({
  size = 24,
  color = '#FF3D3D',
  strokeWidth = 1.5,
  rotate = 0,
}: DeleteIconProps) {
  return (
    <svg
      width={size}
      height={size + 1}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M3.83327 9.85308C4.44858 7.1685 6.49673 5.07236 9.11985 4.44264C11.0142 3.98787 12.9858 3.98787 14.8801 4.44264C17.5033 5.07236 19.5514 7.1685 20.1667 9.85308C20.6111 11.7919 20.6111 13.8096 20.1667 15.7483C19.5514 18.4329 17.5033 20.5291 14.8801 21.1588C12.9858 21.6135 11.0142 21.6135 9.11986 21.1588C6.49673 20.5291 4.44858 18.4329 3.83327 15.7483C3.38891 13.8096 3.38891 11.7919 3.83327 9.85308Z"
        stroke="#FF3D3D"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13.4143 12.0858L10.5858 14.9142M13.4143 14.9142L10.5858 12.0858"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}
