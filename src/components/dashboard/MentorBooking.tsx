import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Star, 
  MapPin, 
  Video, 
  Users, 
  BookOpen, 
  Filter, 
  Search,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Type definitions
interface Mentor {
  id: number;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  rating: number;
  reviews: number;
  hourlyRate: number;
  avatar: string;
  experience: string;
  location: string;
  languages: string[];
  availability: Record<string, string[]>;
  bio: string;
}

interface BookingDetails {
  sessionType: string;
  duration: string;
  topics: string;
  goals: string;
}

// Mock data for mentors
const mentors: Mentor[] = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior Software Engineer",
    company: "Google",
    expertise: ["React", "Node.js", "System Design", "Career Guidance"],
    rating: 4.9,
    reviews: 127,
    hourlyRate: 80,
    avatar: "/api/placeholder/64/64",
    experience: "8+ years",
    location: "San Francisco, CA",
    languages: ["English", "Mandarin"],
    availability: {
      "2024-08-10": ["09:00", "11:00", "14:00", "16:00"],
      "2024-08-11": ["10:00", "13:00", "15:00"],
      "2024-08-12": ["09:00", "11:00", "14:00", "17:00"]
    },
    bio: "Experienced software engineer with a passion for mentoring junior developers. Specialized in full-stack development and system architecture."
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "Data Science Manager",
    company: "Microsoft",
    expertise: ["Python", "Machine Learning", "Data Analysis", "Team Leadership"],
    rating: 4.8,
    reviews: 94,
    hourlyRate: 95,
    avatar: "/api/placeholder/64/64",
    experience: "10+ years",
    location: "Seattle, WA",
    languages: ["English", "Spanish"],
    availability: {
      "2024-08-10": ["10:00", "13:00", "15:00"],
      "2024-08-11": ["09:00", "11:00", "16:00"],
      "2024-08-12": ["10:00", "14:00", "16:00"]
    },
    bio: "Data science leader helping professionals transition into AI/ML roles. Expert in building data-driven products and teams."
  },
  {
    id: 3,
    name: "Priya Patel",
    title: "UX Design Lead",
    company: "Adobe",
    expertise: ["UI/UX Design", "Design Systems", "User Research", "Prototyping"],
    rating: 4.9,
    reviews: 156,
    hourlyRate: 75,
    avatar: "/api/placeholder/64/64",
    experience: "7+ years",
    location: "San Jose, CA",
    languages: ["English", "Hindi"],
    availability: {
      "2024-08-10": ["11:00", "14:00", "16:00"],
      "2024-08-11": ["09:00", "13:00", "15:00", "17:00"],
      "2024-08-12": ["10:00", "12:00", "15:00"]
    },
    bio: "Design leader passionate about creating intuitive user experiences. Helps designers level up their skills and portfolio."
  }
];

export default function MentorBooking() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('');
  const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    sessionType: '1-on-1',
    duration: '60',
    topics: '',
    goals: ''
  });

  // Get unique expertise areas for filter
  const expertiseAreas = [...new Set(mentors.flatMap(mentor => mentor.expertise))];

  // Filter mentors based on search and expertise
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = !selectedExpertise || mentor.expertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

  const handleBookSession = () => {
    if (selectedMentor && selectedDate && selectedTime) {
      setShowBookingForm(true);
    }
  };

  const confirmBooking = () => {
    // Here you would typically send the booking data to your backend
    if (selectedMentor) {
      alert(`Session booked with ${selectedMentor.name} on ${selectedDate} at ${selectedTime}!`);
    }
    setShowBookingForm(false);
    setSelectedMentor(null);
    setSelectedDate('');
    setSelectedTime('');
    setBookingDetails({
      sessionType: '1-on-1',
      duration: '60',
      topics: '',
      goals: ''
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Book a Mentor</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Get personalized guidance from industry experts to accelerate your career growth
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Users className="w-4 h-4" />
          <span>{mentors.length} mentors available</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Expertise</option>
              {expertiseAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedExpertise('');
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Mentor Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {mentor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mentor.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{mentor.title}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{mentor.company}</p>
                </div>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">{mentor.rating}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">({mentor.reviews} reviews)</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{mentor.experience}</span>
              </div>

              {/* Location and Rate */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{mentor.location}</span>
                </div>
                <span className="text-lg font-bold text-green-600">${mentor.hourlyRate}/hr</span>
              </div>

              {/* Expertise Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {mentor.expertise.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{mentor.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {mentor.bio}
              </p>

              {/* Action Button */}
              <button
                onClick={() => setSelectedMentor(mentor)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Book Session with {selectedMentor.name}
                </h2>
                <button
                  onClick={() => {
                    setSelectedMentor(null);
                    setShowBookingForm(false);
                    setSelectedDate('');
                    setSelectedTime('');
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!showBookingForm ? (
                <>
                  {/* Date Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Select Date</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {Object.keys(selectedMentor?.availability || {}).map((date) => (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedDate(date);
                            setSelectedTime('');
                          }}
                          className={`p-3 rounded-lg border text-center transition-colors ${
                            selectedDate === date
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="font-medium">{formatDate(date)}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedMentor?.availability[date]?.length || 0} slots
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && selectedMentor && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Select Time</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(selectedMentor.availability[selectedDate] || []).map((time: string) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 rounded-lg border text-center transition-colors ${
                              selectedTime === time
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Clock className="w-4 h-4 mx-auto mb-1" />
                            <div className="text-sm font-medium">{time}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Session Summary */}
                  {selectedDate && selectedTime && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                      <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Session Summary</h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                          <span>Mentor:</span>
                          <span className="font-medium">{selectedMentor?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-medium">{formatDate(selectedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">60 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rate:</span>
                          <span className="font-medium">${selectedMentor?.hourlyRate || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedMentor(null);
                        setSelectedDate('');
                        setSelectedTime('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBookSession}
                      disabled={!selectedDate || !selectedTime}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Booking Form */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session Type
                      </label>
                      <select
                        value={bookingDetails.sessionType}
                        onChange={(e) => setBookingDetails({...bookingDetails, sessionType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="1-on-1">1-on-1 Mentoring</option>
                        <option value="code-review">Code Review</option>
                        <option value="career-guidance">Career Guidance</option>
                        <option value="technical-interview">Technical Interview Prep</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration
                      </label>
                      <select
                        value={bookingDetails.duration}
                        onChange={(e) => setBookingDetails({...bookingDetails, duration: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="30">30 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Topics to Discuss
                      </label>
                      <textarea
                        value={bookingDetails.topics}
                        onChange={(e) => setBookingDetails({...bookingDetails, topics: e.target.value})}
                        placeholder="What specific topics would you like to discuss?"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Goals for this Session
                      </label>
                      <textarea
                        value={bookingDetails.goals}
                        onChange={(e) => setBookingDetails({...bookingDetails, goals: e.target.value})}
                        placeholder="What do you hope to achieve from this session?"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  {/* Final Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-6">
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Final Summary</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Total Cost:</span>
                        <span className="font-bold text-green-600">
                          ${Math.round(selectedMentor.hourlyRate * (parseInt(bookingDetails.duration) / 60))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={confirmBooking}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}