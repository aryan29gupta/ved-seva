import React, { useState, useEffect } from 'react';
import {
  Heart,
  Shield,
  User,
  Calendar,
  Settings,
  LogOut,
  Camera,
  Edit3,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Stethoscope,
  Clock,
  DollarSign,
  CheckCircle,
  Upload,
  Bell,
  Menu,
  Eye,
  Award,
  BookOpen,
  Building,
  Globe,
  Users,
  Star
} from "lucide-react";
import Footer from '../components/ui/footer';
import AppointmentsSection from './DoctorAppointment';

export default function DoctorProfileDashboard() {
  const [activeSection, setActiveSection] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState({});

  // Initialize profile data from localStorage or use defaults
  const [profileData, setProfileData] = useState(() => {
    // Load data from localStorage if available
    const storedData = localStorage.getItem("doctorData");
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        return {
          // Header Card
          profilePhoto: null,
          fullName: parsedData.fullName || parsedData.name || "Dr. Unknown",
          specialization: parsedData.specialization || "General Medicine",
          isVerified: parsedData.isVerified !== undefined ? parsedData.isVerified : true,
          
          // Personal Information
          gender: parsedData.gender || "Male",
          contactNumber: parsedData.contactNumber || "",
          email: parsedData.email || "",
          city: parsedData.city || "",
          
          // Professional Information
          education: parsedData.education || "MBBS",
          specializations: parsedData.specializations || [parsedData.specialization || "General Medicine"],
          experience: parsedData.experience || "0",
          affiliation: parsedData.affiliation || "",
          
          // Practice Settings
          consultationType: parsedData.consultationType || "Hybrid",
          consultationFee: parsedData.consultationFee || "1500",
          availability: {
            monday: { start: "09:00", end: "17:00", available: true },
            tuesday: { start: "09:00", end: "17:00", available: true },
            wednesday: { start: "09:00", end: "17:00", available: true },
            thursday: { start: "09:00", end: "17:00", available: true },
            friday: { start: "09:00", end: "17:00", available: true },
            saturday: { start: "09:00", end: "13:00", available: true },
            sunday: { start: "", end: "", available: false }
          },
          
          // About Me
          bio: parsedData.bio || "Experienced healthcare professional dedicated to providing quality medical care."
        };
      } catch (error) {
        console.error("Error parsing stored doctor data:", error);
      }
    }
    
    // Fallback default data if no stored data
    return {
      // Header Card
      profilePhoto: null,
      fullName: "Dr. Rajesh Kumar",
      specialization: "Cardiologist",
      isVerified: true,
      
      // Personal Information
      gender: "Male",
      contactNumber: "+91 98765 43210",
      email: "rajesh@gmail.com",
      city: "New Delhi",
      
      // Professional Information
      education: "MBBS, MD (Cardiology)",
      specializations: ["Cardiology", "Interventional Cardiology"],
      experience: "12",
      affiliation: "AIIMS New Delhi",
      
      // Practice Settings
      consultationType: "Hybrid",
      consultationFee: "1500",
      availability: {
        monday: { start: "09:00", end: "17:00", available: true },
        tuesday: { start: "09:00", end: "17:00", available: true },
        wednesday: { start: "09:00", end: "17:00", available: true },
        thursday: { start: "09:00", end: "17:00", available: true },
        friday: { start: "09:00", end: "17:00", available: true },
        saturday: { start: "09:00", end: "13:00", available: true },
        sunday: { start: "", end: "", available: false }
      },
      
      // About Me
      bio: "Experienced cardiologist with over 12 years of practice in interventional cardiology. Specialized in complex cardiac procedures and preventive cardiology. Committed to providing comprehensive cardiac care using the latest medical technologies and evidence-based treatments."
    };
  });

  // Load doctor data when component mounts
  useEffect(() => {
    const loadDoctorData = () => {
      const storedData = localStorage.getItem("doctorData");
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          
          setProfileData(prevData => ({
            ...prevData,
            fullName: parsedData.fullName || parsedData.name || prevData.fullName,
            email: parsedData.email || prevData.email,
            contactNumber: parsedData.contactNumber || prevData.contactNumber,
            specialization: parsedData.specialization || prevData.specialization,
            city: parsedData.city || prevData.city,
            gender: parsedData.gender || prevData.gender,
            experience: parsedData.experience || prevData.experience,
            education: parsedData.education || prevData.education,
            affiliation: parsedData.affiliation || prevData.affiliation,
            consultationType: parsedData.consultationType || prevData.consultationType,
            consultationFee: parsedData.consultationFee || prevData.consultationFee,
            bio: parsedData.bio || prevData.bio,
            isVerified: parsedData.isVerified !== undefined ? parsedData.isVerified : prevData.isVerified,
            specializations: parsedData.specializations || [parsedData.specialization || prevData.specialization]
          }));
        } catch (error) {
          console.error("Error loading doctor data:", error);
        }
      }
    };

    loadDoctorData();
  }, []);

  // Save profile data to localStorage when updated
  const saveProfileData = (updatedData) => {
    try {
      const currentData = JSON.parse(localStorage.getItem("doctorData") || "{}");
      const mergedData = { ...currentData, ...updatedData };
      localStorage.setItem("doctorData", JSON.stringify(mergedData));
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  const toggleEdit = (section) => {
    setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field, value) => {
    const updatedData = { [field]: value };
    setProfileData(prev => ({ ...prev, ...updatedData }));
    saveProfileData(updatedData);
  };

  const handleSpecializationChange = (index, value) => {
    const newSpecs = [...profileData.specializations];
    newSpecs[index] = value;
    const updatedData = { specializations: newSpecs };
    setProfileData(prev => ({ ...prev, ...updatedData }));
    saveProfileData(updatedData);
  };

  const addSpecialization = () => {
    const newSpecs = [...profileData.specializations, ""];
    const updatedData = { specializations: newSpecs };
    setProfileData(prev => ({ ...prev, ...updatedData }));
    saveProfileData(updatedData);
  };

  const removeSpecialization = (index) => {
    const newSpecs = profileData.specializations.filter((_, i) => i !== index);
    const updatedData = { specializations: newSpecs };
    setProfileData(prev => ({ ...prev, ...updatedData }));
    saveProfileData(updatedData);
  };

  const handleAvailabilityChange = (day, field, value) => {
    const updatedAvailability = {
      ...profileData.availability,
      [day]: { ...profileData.availability[day], [field]: value }
    };
    const updatedData = { availability: updatedAvailability };
    setProfileData(prev => ({ ...prev, ...updatedData }));
    saveProfileData(updatedData);
  };

  const sidebarItems = [
    { id: 'profile', icon: User, label: 'Profile', active: true },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'experience', icon: BookOpen, label: 'Experience' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'signout', icon: LogOut, label: 'Sign Out' }
  ];

  const EditableField = ({ label, value, field, type = "text", multiline = false }) => {
    const isEditing = editMode[field];
    
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">{label}</label>
          <button
            onClick={() => toggleEdit(field)}
            className="text-blue-500 hover:text-blue-600 transition-colors p-1"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>
        {isEditing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
              rows={4}
            />
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          )
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{value || "Not specified"}</div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">वैदSeva</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-600 hover:text-blue-600 transition-colors">
                <Bell className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {profileData.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {profileData.fullName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-100 transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {activeSection === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  {/* Profile Photo */}
                  <div className="relative group">
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                      {profileData.profilePhoto ? (
                        <img src={profileData.profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        profileData.fullName.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                    <button className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                  </div>
                  
                  {/* Basic Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                      <h1 className="text-3xl font-black text-gray-900">{profileData.fullName}</h1>
                      {profileData.isVerified && (
                        <div className="bg-green-100 p-1 rounded-full">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      )}
                    </div>
                    <p className="text-xl text-blue-600 font-semibold mb-4">{profileData.specialization}</p>
                    
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">{profileData.experience} Years Experience</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-lg">
                        <Star className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">4.9 Rating</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">500+ Patients</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditableField label="Full Name" value={profileData.fullName} field="fullName" />
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-700">Gender</label>
                      <button
                        onClick={() => toggleEdit('gender')}
                        className="text-blue-500 hover:text-blue-600 transition-colors p-1"
                      >
                        {editMode.gender ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </button>
                    </div>
                    {editMode.gender ? (
                      <select
                        value={profileData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{profileData.gender}</div>
                    )}
                  </div>
                  <EditableField label="Contact Number" value={profileData.contactNumber} field="contactNumber" type="tel" />
                  <EditableField label="Email" value={profileData.email} field="email" type="email" />
                  <EditableField label="City" value={profileData.city} field="city" />
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>
                </div>
                
                <div className="space-y-6">
                  <EditableField label="Educational Qualifications" value={profileData.education} field="education" />
                  
                  {/* Specializations */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-700">Specializations</label>
                      <div className="flex space-x-2">
                        <button
                          onClick={addSpecialization}
                          className="text-green-500 hover:text-green-600 transition-colors p-1"
                        >
                          <span className="text-lg">+</span>
                        </button>
                        <button
                          onClick={() => toggleEdit('specializations')}
                          className="text-blue-500 hover:text-blue-600 transition-colors p-1"
                        >
                          {editMode.specializations ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {profileData.specializations.map((spec, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          {editMode.specializations ? (
                            <>
                              <input
                                type="text"
                                value={spec}
                                onChange={(e) => handleSpecializationChange(index, e.target.value)}
                                className="flex-1 p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                              />
                              <button
                                onClick={() => removeSpecialization(index)}
                                className="text-red-500 hover:text-red-600 transition-colors p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="flex-1 p-3 bg-gray-50 rounded-lg text-gray-800">{spec}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditableField label="Years of Experience" value={profileData.experience} field="experience" type="number" />
                    <EditableField label="Current Hospital/Clinic" value={profileData.affiliation} field="affiliation" />
                  </div>
                </div>
              </div>

              {/* Practice Settings */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Practice Settings</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Consultation Type */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-700">Consultation Type</label>
                        <button
                          onClick={() => toggleEdit('consultationType')}
                          className="text-blue-500 hover:text-blue-600 transition-colors p-1"
                        >
                          {editMode.consultationType ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        </button>
                      </div>
                      {editMode.consultationType ? (
                        <select
                          value={profileData.consultationType}
                          onChange={(e) => handleInputChange('consultationType', e.target.value)}
                          className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        >
                          <option value="Online">Online Only</option>
                          <option value="In-person">In-person Only</option>
                          <option value="Hybrid">Both Online & In-person</option>
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{profileData.consultationType}</div>
                      )}
                    </div>
                    
                    <EditableField label="Consultation Fee (₹)" value={profileData.consultationFee} field="consultationFee" type="number" />
                  </div>
                  
                  {/* Availability */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-semibold text-gray-700">Weekly Availability</label>
                      <button
                        onClick={() => toggleEdit('availability')}
                        className="text-blue-500 hover:text-blue-600 transition-colors p-1"
                      >
                        {editMode.availability ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(profileData.availability).map(([day, settings]) => (
                        <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-24 capitalize font-medium text-gray-700">{day}</div>
                          
                          {editMode.availability ? (
                            <>
                              <input
                                type="checkbox"
                                checked={settings.available}
                                onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              {settings.available && (
                                <>
                                  <input
                                    type="time"
                                    value={settings.start}
                                    onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                  />
                                  <span>to</span>
                                  <input
                                    type="time"
                                    value={settings.end}
                                    onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                  />
                                </>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center space-x-2">
                              {settings.available ? (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <span className="text-gray-700">{settings.start} - {settings.end}</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-5 h-5 text-red-500" />
                                  <span className="text-gray-500">Unavailable</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* About Me */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
                </div>
                
                <EditableField 
                  label="Professional Bio" 
                  value={profileData.bio} 
                  field="bio" 
                  multiline={true}
                />
              </div>
            </div>
          )}

          {/* Other sections can be implemented similarly */}
          {/* Appointments Section */}
          {activeSection === 'appointments' && <AppointmentsSection />}

          {/* Other sections */}
          {activeSection !== 'profile' && activeSection !== 'appointments' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 capitalize">{activeSection}</h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
  </div>
)}
        </main>
      </div>
      <Footer/>
    </div>
  );
}