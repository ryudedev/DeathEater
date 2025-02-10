import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`${className} flex bg-primary border border-primary rounded-full`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
