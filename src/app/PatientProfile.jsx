import React, { useState } from 'react';
import {
  Heart,
  Shield,
  MapPin,
  Phone,
  Mail,
  Users,
  Menu,
  X,
  User,
  Edit2,
  Save,
  CheckCircle,
  Sparkles,
  Brain,
  Activity,
  Droplet,
  AlertTriangle,
  CreditCard,
  Calendar,
  Weight,
  Ruler,
  Pill,
  FileText,
  UserCheck,
  Home,
  LogOut
} from "lucide-react";
import Footer from '../components/ui/footer';

const VedsevaPatientProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    // Basic Information
    fullName: 'Rajesh Kumar Sharma',
    age: 34,
    gender: 'Male',
    phone: '+91 9876543210',
    email: 'rajesh.sharma@email.com',
    aadhaar: '1234 5678 9012',
    
    // Medical Information
    bloodGroup: 'B+',
    allergies: ['Penicillin', 'Shellfish'],
    chronicConditions: ['Hypertension'],
    currentMedications: 'Amlodipine 5mg (once daily), Vitamin D3 (weekly)',
    
    // Vitals
    height: 175,
    weight: 78,
    
    // Emergency Contact
    emergencyName: 'Priya Sharma',
    emergencyRelation: 'Spouse',
    emergencyPhone: '+91 9876543211'
  });

  const [tempProfile, setTempProfile] = useState(profile);

  // Calculate BMI
  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const heightInM = height / 100;
      return (weight / (heightInM * heightInM)).toFixed(1);
    }
    return '0.0';
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600', bgColor: 'bg-green-500' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-orange-600', bgColor: 'bg-orange-500' };
    return { text: 'Obese', color: 'text-red-600', bgColor: 'bg-red-500' };
  };

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setTempProfile(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const chronicConditionsOptions = [
    'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 
    'Arthritis', 'High Cholesterol', 'Thyroid Disorder', 'Kidney Disease'
  ];

  const bmi = calculateBMI(isEditing ? tempProfile.height : profile.height, 
                          isEditing ? tempProfile.weight : profile.weight);
  const bmiCategory = getBMICategory(parseFloat(bmi));

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">VedSeva</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </a>
              <a href="#appointments" className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Appointments</span>
              </a>
              <a href="#reports" className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Reports</span>
              </a>
              <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <a href="#dashboard" className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>
                <a href="#appointments" className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Appointments</span>
                </a>
                <a href="#reports" className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Reports</span>
                </a>
                <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium w-fit hover:shadow-lg transition-shadow flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Profile Header Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 text-blue-600 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider">Patient Portal</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
              My Health
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">
                Profile
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Manage your personal health information, track your vitals, and stay connected with your healthcare team.
            </p>

            {/* Action Button */}
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg"
              >
                <Edit2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleSave}
                  className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-black text-blue-600 mb-1">{profile.bloodGroup}</div>
              <div className="text-sm text-gray-500 font-medium">Blood Group</div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${bmiCategory.bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Weight className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className={`text-2xl font-black ${bmiCategory.color} mb-1`}>{bmi}</div>
              <div className="text-sm text-gray-500 font-medium">BMI - {bmiCategory.text}</div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-black text-orange-600 mb-1">{profile.allergies.length}</div>
              <div className="text-sm text-gray-500 font-medium">Known Allergies</div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-black text-purple-600 mb-1">{profile.chronicConditions.length}</div>
              <div className="text-sm text-gray-500 font-medium">Conditions</div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Basic Information */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-8 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Basic Information</h2>
                  <p className="text-gray-600">Personal details and contact information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  ) : (
                    <p className="text-xl font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempProfile.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  ) : (
                    <p className="text-xl font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.age} years</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Gender</label>
                  {isEditing ? (
                    <select
                      value={tempProfile.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-xl font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile.gender}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Blood Group</label>
                  {isEditing ? (
                    <select
                      value={tempProfile.bloodGroup}
                      onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl">
                      <Droplet className="w-5 h-5 text-red-500" />
                      <p className="text-xl font-bold text-gray-900">{profile.bloodGroup}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl">
                      <Phone className="w-5 h-5 text-blue-500" />
                      <p className="text-xl font-bold text-gray-900">{profile.phone}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <p className="text-xl font-bold text-gray-900">{profile.email}</p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Aadhaar Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.aadhaar}
                      onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="1234 5678 9012"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      <p className="text-xl font-bold text-gray-900">{profile.aadhaar}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vitals Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-8 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Vitals</h2>
                  <p className="text-gray-600">Health measurements</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Height (cm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempProfile.height}
                      onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-4 rounded-xl">
                      <Ruler className="w-6 h-6 text-blue-600" />
                      <p className="text-3xl font-black text-gray-900">{profile.height} cm</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Weight (kg)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempProfile.weight}
                      onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-4 rounded-xl">
                      <Weight className="w-6 h-6 text-green-600" />
                      <p className="text-3xl font-black text-gray-900">{profile.weight} kg</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t-2 border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">BMI</label>
                  <div className={`bg-gradient-to-r from-${bmiCategory.bgColor.split('-')[1]}-50 to-${bmiCategory.bgColor.split('-')[1]}-100 px-6 py-6 rounded-2xl text-center`}>
                    <p className="text-4xl font-black text-gray-900 mb-2">{bmi}</p>
                    <p className={`text-lg font-bold ${bmiCategory.color}`}>{bmiCategory.text}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="lg:col-span-3 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-8 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Medical Information</h2>
                  <p className="text-gray-600">Health conditions and medications</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Allergies</label>
                  {isEditing ? (
                    <textarea
                      value={tempProfile.allergies.join(', ')}
                      onChange={(e) => handleArrayChange('allergies', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm h-24"
                      placeholder="Separate multiple allergies with commas"
                    />
                  ) : (
                    <div className="space-y-3">
                      {profile.allergies.length > 0 ? profile.allergies.map((allergy, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-3 rounded-xl">
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                          <span className="text-lg font-semibold text-gray-900">{allergy}</span>
                        </div>
                      )) : (
                        <p className="text-gray-500 italic bg-gray-50 px-4 py-3 rounded-xl">No known allergies</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Chronic Conditions</label>
                  {isEditing ? (
                    <div className="space-y-3 max-h-32 overflow-y-auto bg-gray-50 p-4 rounded-xl">
                      {chronicConditionsOptions.map(condition => (
                        <label key={condition} className="flex items-center space-x-3 cursor-pointer hover:bg-white px-3 py-2 rounded-lg transition-colors">
                          <input
                            type="checkbox"
                            checked={tempProfile.chronicConditions.includes(condition)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTempProfile(prev => ({
                                  ...prev,
                                  chronicConditions: [...prev.chronicConditions, condition]
                                }));
                              } else {
                                setTempProfile(prev => ({
                                  ...prev,
                                  chronicConditions: prev.chronicConditions.filter(c => c !== condition)
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                          <span className="text-sm font-medium">{condition}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {profile.chronicConditions.length > 0 ? profile.chronicConditions.map((condition, index) => (
                        <div key={index} className="inline-block">
                          <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold mr-2 mb-2 inline-block shadow-lg transform hover:scale-105 transition-transform">
                            {condition}
                          </span>
                        </div>
                      )) : (
                        <p className="text-gray-500 italic bg-gray-50 px-4 py-3 rounded-xl">No chronic conditions</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Current Medications</label>
                  {isEditing ? (
                    <textarea
                      value={tempProfile.currentMedications}
                      onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm h-32"
                      placeholder="List current medications and dosages"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-100">
                      <div className="flex items-start space-x-3">
                        <Pill className="w-6 h-6 text-purple-600 mt-1" />
                        <p className="text-lg text-gray-900 font-medium leading-relaxed">{profile.currentMedications || 'No current medications'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="lg:col-span-3 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-8 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Emergency Contact</h2>
                  <p className="text-gray-600">Important contact in case of emergency</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.emergencyName}
                      onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-3 rounded-xl">
                      <UserCheck className="w-5 h-5 text-orange-600" />
                      <p className="text-xl font-bold text-gray-900">{profile.emergencyName}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Relation</label>
                  {isEditing ? (
                    <select
                      value={tempProfile.emergencyRelation}
                      onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 rounded-xl">
                      <Heart className="w-5 h-5 text-purple-600" />
                      <p className="text-xl font-bold text-gray-900">{profile.emergencyRelation}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempProfile.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-xl">
                      <Phone className="w-5 h-5 text-green-600" />
                      <p className="text-xl font-bold text-gray-900">{profile.emergencyPhone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-lg px-6 py-3 rounded-2xl shadow-lg border border-gray-100">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-700">Your data is protected with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 -right-8 w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-15 animate-pulse" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default VedsevaPatientProfile;