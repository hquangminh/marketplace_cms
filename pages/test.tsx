import React, { useState, useMemo, useEffect } from 'react';

const CallNumberComponent = () => {
  const [number, setNumber] = useState<number>(0);

  const formattedPhoneNumber = useMemo(() => {
    console.log('22');

    const calculatePhoneNumber = () => {
      console.log('Calculating phone number...');
      return number * 2;
    };

    return calculatePhoneNumber();
  }, [number]);

  useEffect(() => {
    console.log('number', number);

    console.log('sjsjjsjs');
  }, []);

  return (
    <div>
      <label>
        Number:
        <input
          type='text'
          value={number}
          onChange={(e) => setNumber(parseInt(e.target.value, 10))}
        />
      </label>
      <br />
      <p>Formatted Phone Number: {formattedPhoneNumber}</p>
    </div>
  );
};

export default CallNumberComponent;
