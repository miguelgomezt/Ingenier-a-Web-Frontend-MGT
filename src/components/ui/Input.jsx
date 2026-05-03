function Input({ label, name, type = 'text', value, onChange, error, placeholder, icon: Icon, required = false }) {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={name} className="text-sm font-semibold text-gray-300">
            {label} {required && <span className="text-orange-400">*</span>}
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
            className={`w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${Icon ? 'pl-9' : ''} ${error ? 'border-red-500' : 'border-gray-600'}`}
          />
        </div>
        {error && (
          <p role="alert" className="text-xs text-red-400">{error}</p>
        )}
      </div>
    )
  }
  
  export default Input