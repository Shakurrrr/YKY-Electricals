import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Check, 
  X, 
  Clock, 
  Filter,
  Search,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';
import { bookingsAPI, projectsAPI } from '../utils/api';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  adminComment?: string;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'projects'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Sample data - will be replaced with Supabase data
  useEffect(() => {

    const fetchData = async () => {
      try {
        // Fetch bookings
        const bookingsResponse = await bookingsAPI.getAllBookings();
        setBookings(bookingsResponse.bookings.map((booking: any) => ({
          id: booking.id.toString(),
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          serviceType: booking.service_type,
          preferredDate: booking.preferred_date,
          description: booking.description,
          status: booking.status,
          adminComment: booking.admin_comment,
          createdAt: booking.created_at
        })));

        // Fetch projects
        const projectsResponse = await projectsAPI.getAll();
        setProjects(projectsResponse.projects.map((project: any) => ({
          id: project.id.toString(),
          title: project.title,
          category: project.category,
          image: project.image_url || 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: project.description
        })));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const filteredBookings = bookings
    .filter(booking => statusFilter === 'all' || booking.status === statusFilter)
    .filter(booking => 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleStatusUpdate = async (bookingId: string, status: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      await bookingsAPI.updateStatus(bookingId, status, adminComment);
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status, adminComment }
          : booking
      ));
      
      setSelectedBooking(null);
      setAdminComment('');
    } catch (error) {
      console.error('Failed to update booking:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings and projects</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Service Bookings
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Project Gallery
            </button>
          </nav>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.name}</h3>
                        <p className="text-sm text-gray-600">{booking.serviceType}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>Requested: {new Date(booking.createdAt).toLocaleDateString()}</p>
                      <p>Preferred: {new Date(booking.preferredDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{booking.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{booking.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{booking.preferredDate}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">{booking.description}</p>
                  </div>
                  
                  {booking.adminComment && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Admin Comment:</strong> {booking.adminComment}
                      </p>
                    </div>
                  )}
                  
                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                      >
                        <Check size={16} className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
                      >
                        <X size={16} className="mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No bookings found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Project Gallery</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                <Plus size={20} className="mr-2" />
                Add Project
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full capitalize">
                        {project.category}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit3 size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Booking Status
              </h3>
              <p className="text-gray-600 mb-4">
                Customer: {selectedBooking.name} - {selectedBooking.serviceType}
              </p>
              
              <div className="mb-4">
                <label htmlFor="adminComment" className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (will be sent to customer)
                </label>
                <textarea
                  id="adminComment"
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a comment for the customer..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'approved')}
                  disabled={isUpdating}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'rejected')}
                  disabled={isUpdating}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Reject'}
                </button>
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    setAdminComment('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;