import { useState } from 'react';
import { X } from 'lucide-react';
import SimpleBookingForm from './SimpleBookingForm';

const NewBookingModal = ({ onClose, onSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Booking</h2>
            <p className="text-sm text-gray-500">Schedule a new service</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <SimpleBookingForm onSuccess={onSuccess} onCancel={onClose} />
      </div>
    </div>
  );
};

export default NewBookingModal; 