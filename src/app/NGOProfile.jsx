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
  Bell,
  Search,
  Settings,
  LogOut,
  Activity,
  TrendingUp,
  AlertTriangle,
  Building,
  Globe,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ChevronDown,
  Eye,
  Plus,
  FileText,
  Target,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Home,
  Database,
  Stethoscope,
  Clipboard
} from "lucide-react";

export default function NGODashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [selectedRegion, setSelectedRegion] = useState('delhi');
  const [notifications, setNotifications] = useState(5);
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');

  // Sample data - replace with your ML model data
  const dashboardStats = {
    totalCases: 1245,
    activeAreas: 8,
    criticalAlerts: 3,
    healthcarePartners: 12
  };

  const diseaseData = [
    { 
      name: 'Malaria', 
      cases: 145, 
      trend: 'up', 
      color: 'bg-red-500',
      description: 'Primary vector: Female Anopheles mosquito. Most prevalent in northern districts. Symptoms include high fever, chills, and fatigue.',
      percentage: '+12%'
    },
    { 
      name: 'Dengue', 
      cases: 78, 
      trend: 'down', 
      color: 'bg-orange-500',
      description: 'Transmitted by Aedes mosquitoes. Recent spike in urban areas following monsoon season. Symptoms include high fever, severe headache.',
      percentage: '-8%'
    },
    { 
      name: 'Tuberculosis', 
      cases: 56, 
      trend: 'up', 
      color: 'bg-yellow-500',
      description: 'Airborne bacterial infection affecting primarily lungs. Higher prevalence in densely populated areas.',
      percentage: '+5%'
    },
    { 
      name: 'Cholera', 
      cases: 29, 
      trend: 'stable', 
      color: 'bg-blue-500',
      description: 'Caused by contaminated water or food. Recent outbreak after flooding in coastal regions.',
      percentage: '0%'
    }
  ];

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'active-areas', name: 'Active Areas', icon: MapPin },
    { id: 'critical-alerts', name: 'Critical Alerts', icon: AlertTriangle },
    { id: 'health-data', name: 'Health Data', icon: Stethoscope },
    { id: 'reports', name: 'Reports', icon: Clipboard },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50 z-0">
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-100/30 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
    </div>
      {/* Permanent Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col relative z-10">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">VedSeva</span>
              <div className="text-xs text-green-600 font-medium">NGO Portal</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSidebarItem(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSidebarItem === item.id
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-500 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* User Section */}
        
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">NGO Admin</div>
              <div className="text-xs text-gray-500">Delhi Region</div>
            </div>
          </div>
          <button className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200 w-full rounded-lg hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-sm text-gray-600">Monitor healthcare initiatives and community programs</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cases, areas..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
                />
              </div>
              
              <button className="relative p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg">
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cases Reported</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{dashboardStats.totalCases.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Areas</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{dashboardStats.activeAreas}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{dashboardStats.criticalAlerts}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Healthcare Partners</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{dashboardStats.healthcarePartners}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Disease Cases - Left Side */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Current Outbreaks</h2>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {diseaseData.map((disease, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${disease.color}`}></div>
                          <h3 className="font-semibold text-gray-900">{disease.name}</h3>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          disease.trend === 'up' ? 'text-red-700 bg-red-100' :
                          disease.trend === 'down' ? 'text-green-700 bg-green-100' :
                          'text-gray-700 bg-gray-100'
                        }`}>
                          {disease.percentage}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{disease.cases} cases</p>
                      <p className="text-xs text-gray-600">{disease.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map - Center */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Geographic Distribution</h2>
                  <div className="flex items-center space-x-2">
                    <select 
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      <option value="delhi">Delhi</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="all">All Regions</option>
                    </select>
                    <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Map Placeholder */}
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium text-lg">Interactive Disease Distribution Map</p>
                    <p className="text-sm text-gray-400 mt-2">ML Model Geographic Data will be displayed here</p>
                    <p className="text-xs text-gray-400 mt-1">Real-time case tracking and hotspot identification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Charts - 4 Analytics Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Disease Trends Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Disease Trends </h3>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-green-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-medium">Disease Trends</p>
                  <p className="text-xs text-gray-400">ML Analytics</p>
                </div>
              </div>
            </div>

            {/* Age Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Age Distribution of Cases</h3>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-medium">Age Distribution</p>
                  <p className="text-xs text-gray-400">Demographics</p>
                </div>
              </div>
            </div>

            {/* Treatment Response */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Treatment Response Rates</h3>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-medium">Treatment Response</p>
                  <p className="text-xs text-gray-400">Success Rates</p>
                </div>
              </div>
            </div>

            {/* Resource Allocation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Resource Allocation</h3>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <PieChart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-medium">Resource Distribution</p>
                  <p className="text-xs text-gray-400">Budget Allocation</p>
                </div>
              </div>
            </div>
          </div>
        </div>   
      </div>
    </div>
  );
}