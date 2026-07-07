import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ name, value, onChange, placeholder = '', required = false }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field pr-12"
        required={required}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
