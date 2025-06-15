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
  const [PhoneInput, setPhoneInput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-phone-input-2')
        .then((module) => {
          setPhoneInput(() => module.default);
        })
        .catch((error) => {
          console.error('Failed to load phone input:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Show loading state while component is loading
  if (isLoading) {
    return (
      <div className="w-full h-12 bg-gray-100 animate-pulse rounded border" />
    );
  }

  // If failed to load, show fallback input
  if (!PhoneInput) {
    return (
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Enter phone number'}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  }

  return (
    <PhoneInput
      country={'la'}
      enableAreaCodes={true}
      autocompleteSearch={true}
      enableSearch={true}
      placeholder={placeholder || 'Enter phone number'}
      searchPlaceholder="Search countries"
      value={value}
      disabled={disabled}
      onChange={(val: string) => {
        const formatted = val.startsWith('+') ? val : '+' + val;
        onChange(formatted);
      }}
      inputStyle={{
        width: '100%',
        height: '48px',
        fontSize: '16px',
        paddingLeft: '48px',
      }}
      buttonStyle={{
        backgroundColor: 'transparent',
        border: 'none',
        paddingLeft: '2px',
      }}
      dropdownStyle={{
        zIndex: 9999,
      }}
    />
  );
}
