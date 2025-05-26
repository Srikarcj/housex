import { useState, useEffect, useCallback } from 'react';

export const usePictureInPicture = (videoRef) => {
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(
      document.pictureInPictureEnabled ||
        document.webkitPictureInPictureEnabled ||
        document.mozPictureInPictureEnabled
    );
  }, []);

  const enterPictureInPicture = useCallback(async () => {
    try {
      if (videoRef.current && isSupported) {
        if (videoRef.current.requestPictureInPicture) {
          await videoRef.current.requestPictureInPicture();
        } else if (videoRef.current.webkitRequestPictureInPicture) {
          await videoRef.current.webkitRequestPictureInPicture();
        } else if (videoRef.current.mozRequestPictureInPicture) {
          await videoRef.current.mozRequestPictureInPicture();
        }
      }
    } catch (error) {
      console.error('Failed to enter picture-in-picture:', error);
    }
  }, [videoRef, isSupported]);

  const exitPictureInPicture = useCallback(async () => {
    try {
      if (document.exitPictureInPicture) {
        await document.exitPictureInPicture();
      } else if (document.webkitExitPictureInPicture) {
        await document.webkitExitPictureInPicture();
      } else if (document.mozExitPictureInPicture) {
        await document.mozExitPictureInPicture();
      }
    } catch (error) {
      console.error('Failed to exit picture-in-picture:', error);
    }
  }, []);

  const togglePictureInPicture = useCallback(async () => {
    if (isPictureInPicture) {
      await exitPictureInPicture();
    } else {
      await enterPictureInPicture();
    }
  }, [isPictureInPicture, enterPictureInPicture, exitPictureInPicture]);

  useEffect(() => {
    const handlePictureInPictureChange = () => {
      setIsPictureInPicture(
        document.pictureInPictureElement ||
          document.webkitPictureInPictureElement ||
          document.mozPictureInPictureElement
      );
    };

    document.addEventListener('enterpictureinpicture', handlePictureInPictureChange);
    document.addEventListener('leavepictureinpicture', handlePictureInPictureChange);
    document.addEventListener('webkitenterpictureinpicture', handlePictureInPictureChange);
    document.addEventListener('webkitleavepictureinpicture', handlePictureInPictureChange);
    document.addEventListener('mozenterpictureinpicture', handlePictureInPictureChange);
    document.addEventListener('mozleavepictureinpicture', handlePictureInPictureChange);

    return () => {
      document.removeEventListener('enterpictureinpicture', handlePictureInPictureChange);
      document.removeEventListener('leavepictureinpicture', handlePictureInPictureChange);
      document.removeEventListener('webkitenterpictureinpicture', handlePictureInPictureChange);
      document.removeEventListener('webkitleavepictureinpicture', handlePictureInPictureChange);
      document.removeEventListener('mozenterpictureinpicture', handlePictureInPictureChange);
      document.removeEventListener('mozleavepictureinpicture', handlePictureInPictureChange);
    };
  }, []);

  return {
    isSupported,
    isPictureInPicture,
    enterPictureInPicture,
    exitPictureInPicture,
    togglePictureInPicture,
  };
};

export default usePictureInPicture; 