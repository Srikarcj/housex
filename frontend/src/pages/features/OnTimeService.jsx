import React from 'react';
import { Clock, Calendar, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OnTimeService = () => {
  const navigate = useNavigate();

  const serviceMetrics = [
    {
      title: "On-Time Rate",
      value: "98%",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Average Response",
      value: "30 min",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Completion Rate",
      value: "99%",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const serviceProcess = [
    {
      step: "1",
      title: "Quick Response",
      description: "We respond to all inquiries within 30 minutes during business hours (9 AM - 6 PM)",
      icon: Clock,
      image: "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg"
    },
    {
      step: "2",
      title: "Scheduled Service",
      description: "Flexible scheduling options with real-time availability",
      icon: Calendar,
      image: "https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg"
    },
    {
      step: "3",
      title: "On-Time Arrival",
      description: "Our team arrives at the scheduled time, every time",
      icon: CheckCircle,
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
    },
    {
      step: "4",
      title: "Efficient Completion",
      description: "Projects completed on schedule with quality assurance",
      icon: AlertCircle,
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
    }
  ];

  const handleGetStarted = () => {
    toast.success('Successfully selected On-Time Service. Redirecting to sign up...');
    setTimeout(() => {
      navigate('/sign-up');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">On-Time Service</h1>
              <p className="text-xl text-blue-100 mb-8">
                We value your time. That's why we guarantee punctual service delivery for every project.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-blue-300" />
                  <span className="ml-2 text-lg">Punctual & Reliable</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-3 gap-4">
                  {serviceMetrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl font-bold mb-2">{metric.value}</div>
                      <div className="text-blue-100">{metric.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Metrics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{metric.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Service Process Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Service Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceProcess.map((step, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div className="h-48 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{step.step}</span>
                    </div>
                    <step.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Book Your Service Now
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Experience our commitment to punctuality and reliability
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Book Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnTimeService; 