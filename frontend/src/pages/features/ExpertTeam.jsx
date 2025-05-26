import React from 'react';
import { Users, Award, Star, Briefcase, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ExpertTeam = () => {
  const navigate = useNavigate();

  const teamStats = [
    {
      title: "Years Experience",
      value: "15+",
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Certified Experts",
      value: "100+",
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Projects Completed",
      value: "1000+",
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const experts = [
    {
      name: "Rajesh Kumar",
      role: "Lead Painter",
      experience: "12 years",
      image: "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      specialties: ["Interior Painting", "Exterior Finishes", "Color Consultation"]
    },
    {
      name: "Priya Sharma",
      role: "Senior Contractor",
      experience: "15 years",
      image: "https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg",
      specialties: ["Project Management", "Renovation", "Quality Control"]
    },
    {
      name: "Arjun Patel",
      role: "Technical Specialist",
      experience: "10 years",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
      specialties: ["Surface Preparation", "Specialty Finishes", "Technical Solutions"]
    }
  ];

  const handleGetStarted = () => {
    toast.success('Successfully selected Expert Team service. Redirecting to sign up...');
    setTimeout(() => {
      navigate('/sign-up');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-green-600 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Expert Team</h1>
              <p className="text-xl text-green-100 mb-8">
                Our team of highly skilled professionals brings years of experience and expertise to every project.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-green-300" />
                  <span className="ml-2 text-lg">Professional Excellence</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-3 gap-4">
                  {teamStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl font-bold mb-2">{stat.value}</div>
                      <div className="text-green-100">{stat.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expert Profiles Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Experts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.map((expert, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{expert.name}</h3>
                  <p className="text-green-600 font-medium mb-2">{expert.role}</p>
                  <p className="text-gray-600 mb-4">Experience: {expert.experience}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {expert.specialties.map((specialty, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
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
              Work with Our Expert Team
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Experience excellence with our skilled professionals
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertTeam; 