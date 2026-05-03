function Button({ children, variant = 'primary', disabled = false, className = '', type = 'button', onClick }) {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg px-5 py-2.5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
  
    const variants = {
      primary: 'bg-orange-500 hover:bg-orange-400 text-white',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600',
      danger: 'bg-red-600 hover:bg-red-500 text-white',
      ghost: 'bg-transparent hover:bg-gray-700 text-orange-400 border border-orange-500',
    }
  
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`${base} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    )
  }
  
  export default Button