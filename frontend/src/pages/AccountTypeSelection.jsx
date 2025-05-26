import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import {
  Paintbrush,
  Wrench,
  Building2,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const accountTypes = [
  {
    id: 'painter',
    title: 'Painter',
    description: 'Offer professional painting services for residential and commercial properties.',
    icon: Paintbrush,
    features: [
      'Interior and exterior painting',
      'Color consultation',
      'Surface preparation',
      'Wallpaper installation',
      'Cabinet refinishing'
    ]
  },
  {
    id: 'plumber',
    title: 'Plumber',
    description: 'Provide plumbing services including repairs, installations, and maintenance.',
    icon: Wrench,
    features: [
      'Pipe repairs and installation',
      'Drain cleaning',
      'Water heater services',
      'Bathroom and kitchen plumbing',
      'Emergency services'
    ]
  },
  {
    id: 'contractor',
    title: 'Contractor',
    description: 'Handle general contracting services for construction and renovation projects.',
    icon: Building2,
    features: [
      'Home renovations',
      'Construction management',
      'Project coordination',
      'Building repairs',
      'Permit assistance'
    ]
  }
];

const AccountTypeSelection = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [selectedType, setSelectedType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType) {
      toast.error('Please select an account type');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/professionals/account-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ accountType: selectedType })
      });

      if (!response.ok) throw new Error('Failed to set account type');
      
      const selectedAccount = accountTypes.find(type => type.id === selectedType);
      toast.success(`Successfully logged in as ${selectedAccount.title}`);
      
      setTimeout(() => {
        navigate(`/dashboard/${selectedType}`);
      }, 1500);
    } catch (error) {
      console.error('Error setting account type:', error);
      toast.error('Failed to set account type');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Account Type</h1>
          <p className="mt-4 text-lg text-gray-600">
            Select the type of professional services you'll be offering
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accountTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className={`relative rounded-lg border p-6 cursor-pointer transition-all ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  {selectedType === type.id && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-blue-500" />
                    </div>
                  )}
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{type.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{type.description}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Services include:</h4>
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || !selectedType}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                isSubmitting || !selectedType
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Setting up account...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountTypeSelection; 