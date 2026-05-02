function Input({ label, name, type = 'text', value, onChange, error, placeholder, icon: Icon, required = false }) {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={name} className="text-sm font-display font-semibold text-gray-300">
            {label} {required && <span className="text-brand-400">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon size={16} />
            </span>
          )}
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={`w-full bg-dark-700 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${Icon ? 'pl-9' : ''} ${error ? 'border-red-500' : 'border-dark-600 hover:border-dark-500'}`}
          />
        </div>
        {error && (
          <p id={`${name}-error`} role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    )
  }
  
  export default Input