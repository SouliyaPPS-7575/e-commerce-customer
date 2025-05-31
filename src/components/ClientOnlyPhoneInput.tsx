import { useEffect, useState } from 'react';
import '~/styles/phone-input-styles.css';
import 'react-phone-input-2/lib/material.css';

interface ClientOnlyPhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ClientOnlyPhoneInput({
  value,
  onChange,
  placeholder,
  disabled,
}: ClientOnlyPhoneInputProps) {
  const [PhoneInput, setPhoneInput] = useState<
    (typeof import('react-phone-input-2'))['default'] | null
  >(null);

  useEffect(() => {
    import('react-phone-input-2').then((module) => {
      setPhoneInput(() => module.default);
    });
  }, []);

  if (!PhoneInput) return null;

  return (
    <PhoneInput
      country={'la'}
      enableAreaCodes
      autocompleteSearch
      enableSearch
      placeholder={placeholder}
      searchPlaceholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(val: string) => {
        const formatted = val.startsWith('+') ? val : '+' + val;
        onChange(formatted);
      }}
    />
  );
}
