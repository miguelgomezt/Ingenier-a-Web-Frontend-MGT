function Button({ children, variant = 'primary', disabled = false, className = '', type = 'button', onClick }) {
    const base = 'inline-flex items-center justify-center gap-2 font-display font-semibold rounded-xl px-5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
  
    const variants = {
      primary: 'bg-brand-500 hover:bg-brand-400 text-white focus:ring-brand-500',
      secondary: 'bg-dark-600 hover:bg-dark-700 text-white border border-dark-600 focus:ring-dark-600',
      danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-600',
      ghost: 'bg-transparent hover:bg-dark-700 text-brand-400 border border-brand-500 focus:ring-brand-500',
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