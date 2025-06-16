import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/profiles')({
  component: RouteComponent,
});

function RouteComponent() {
  // PhoneInput
  const [PhoneInput, setPhoneInput] = useState<
    (typeof import('react-phone-input-2'))['default'] | null
  >(null);

  useEffect(() => {
    import('react-phone-input-2').then((module) => {
      setPhoneInput(() => module.default);
    });
  }, []);

  return (
    <div>
      <br />
      <br />
      <br />
      {PhoneInput && (
        <PhoneInput
          country={'la'}
          enableAreaCodes
          autocompleteSearch
          enableSearch
        />
      )}
    </div>
  );
}
