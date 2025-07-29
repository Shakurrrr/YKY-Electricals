import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Clock, Users, Star, Filter } from 'lucide-react';
import { projectsAPI } from '../utils/api';

const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Commercial Office Wiring',
      category: 'commercial',
      image: 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Complete electrical installation for a 5000 sq ft office space with modern lighting and power systems.'
    },
    {
      id: 2,
      title: 'Residential Panel Upgrade',
      category: 'installations',
      image: 'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Upgraded electrical panel from 100A to 200A service with new safety features and code compliance.'
    },
    {
      id: 3,
      title: 'Emergency Repair Service',
      category: 'repairs',
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Quick diagnosis and repair of electrical fault in residential property, restoring power within 2 hours.'
    },
    {
      id: 4,
      title: 'Smart Home Integration',
      category: 'installations',
      image: 'https://images.pexels.com/photos/6045391/pexels-photo-6045391.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Installation of smart switches, outlets, and automated lighting system for modern home.'
    },
    {
      id: 5,
      title: 'Industrial Maintenance',
      category: 'commercial',
      image: 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Regular maintenance and inspection of electrical systems in manufacturing facility.'
    },
    {
      id: 6,
      title: 'Outlet Installation',
      category: 'repairs',
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Installation of additional outlets and USB charging stations in kitchen and living areas.'
    }
  ]);


  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent service! They fixed our electrical issues quickly and professionally.',
      location: 'New York, NY'
    },
    {
      id: 2,
      name: 'Mike Chen',
      rating: 5,
      comment: 'Very reliable and knowledgeable. Highly recommend for any electrical work.',
      location: 'Los Angeles, CA'
    },
    {
      id: 3,
      name: 'Emily Davis',
      rating: 5,
      comment: 'Professional team with fair pricing. Great communication throughout the project.',
      location: 'Chicago, IL'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Professional 
                <span className="text-orange-400"> Electrical </span>
                Services You Can Trust
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                From installations to emergency repairs, we provide safe, reliable, 
                and efficient electrical solutions for your home and business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/book-service" 
                  className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Book a Service
                </Link>
                <Link 
                  to="/contact" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 text-center"
                >
                  Get Free Quote
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Electrical Work" 
                className="rounded-lg shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm">Emergency Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose YKY Electricals?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We deliver exceptional electrical services with a commitment to safety, 
              quality, and customer satisfaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Technicians</h3>
              <p className="text-gray-600">Licensed and certified electricians with years of experience</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">All work follows strict safety protocols and code compliance</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-300">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Emergency</h3>
              <p className="text-gray-600">Round-the-clock emergency services for urgent electrical issues</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Focus</h3>
              <p className="text-gray-600">Dedicated to providing excellent customer service and satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Recent Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Take a look at some of our completed projects showcasing our expertise 
              in electrical installations and repairs.
            </p>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setActiveFilter('installations')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === 'installations'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Installations
              </button>
              <button
                onClick={() => setActiveFilter('repairs')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === 'repairs'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Repairs
              </button>
              <button
                onClick={() => setActiveFilter('commercial')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === 'commercial'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Commercial
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full capitalize">
                    {project.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about our services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't wait for electrical problems to get worse. Contact us today for 
            professional electrical services you can trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/book-service" 
              className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
            >
              Book Service Now
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300"
            >
              Get Free Estimate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;