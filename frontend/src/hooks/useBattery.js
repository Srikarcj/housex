import { useState, useEffect } from 'react';

export const useBattery = () => {
  const [battery, setBattery] = useState({
    charging: false,
    chargingTime: Infinity,
    dischargingTime: Infinity,
    level: 1,
  });

  useEffect(() => {
    let battery = null;

    const handleBatteryChange = () => {
      setBattery({
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        level: battery.level,
      });
    };

    const initBattery = async () => {
      try {
        battery = await navigator.getBattery();
        handleBatteryChange();

        battery.addEventListener('chargingchange', handleBatteryChange);
        battery.addEventListener('chargingtimechange', handleBatteryChange);
        battery.addEventListener('dischargingtimechange', handleBatteryChange);
        battery.addEventListener('levelchange', handleBatteryChange);
      } catch (error) {
        console.error('Battery API not supported:', error);
      }
    };

    initBattery();

    return () => {
      if (battery) {
        battery.removeEventListener('chargingchange', handleBatteryChange);
        battery.removeEventListener('chargingtimechange', handleBatteryChange);
        battery.removeEventListener('dischargingtimechange', handleBatteryChange);
        battery.removeEventListener('levelchange', handleBatteryChange);
      }
    };
  }, []);

  return battery;
};

export default useBattery; 