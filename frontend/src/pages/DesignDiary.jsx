import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  // Navigation
  Home,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  
  // Theme
  Sun,
  Moon,
  
  // Actions
  Plus,
  Upload,
  Download,
  Edit,
  Delete,
  Save,
  Share2,
  Filter,
  Search,
  List,
  Grid,
  
  // Communication
  Mic,
  MessageCircle,
  MessageSquare,
  Video,
  Phone,
  Mail,
  
  // Status
  Wifi,
  WifiOff,
  Cloud,
  Lock,
  Bell,
  AlertCircle,
  CheckCircle,
  PauseCircle,
  
  // User
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Users,
  UserCircle,
  
  // Files
  File,
  FileText,
  FileImage,
  FileSpreadsheet,
  Folder,
  
  // Tools
  Calculator,
  Ruler,
  DollarSign,
  BarChart,
  BarChart2,
  PieChart,
  LineChart,
  Calendar,
  Clock,
  Tag,
  Wrench,
  Activity,
  Leaf,
  Package,
  
  // Project
  Layers,
  ClipboardList,
  Star,
  Heart,
  Bookmark,
  Flag,
  Archive,
  
  // AI & Analysis
  Brain,
  Sparkles,
  Zap,
  Lightbulb,
  Target,
  Award,
  Trophy,
  Medal,
  Crown,
  Shield,
  Key,
  
  // Settings
  Settings,
  HelpCircle,
  MoreVertical,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from 'lucide-react';

const DesignDiary = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('journal');
  const [isRecording, setIsRecording] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [filterTags, setFilterTags] = useState([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({});
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [costData, setCostData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [notificationsError, setNotificationsError] = useState(null);

  // Add new state variables for remaining modules
  const [projects, setProjects] = useState([
    { id: 1, name: 'Residential Project', status: 'active', progress: 75, team: ['John Doe', 'Jane Smith'] },
    { id: 2, name: 'Commercial Building', status: 'planning', progress: 30, team: ['Mike Johnson'] },
    { id: 3, name: 'Renovation Project', status: 'completed', progress: 100, team: ['Sarah Wilson'] }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review blueprints', status: 'pending', dueDate: '2024-03-20', priority: 'high' },
    { id: 2, title: 'Calculate material costs', status: 'in-progress', dueDate: '2024-03-22', priority: 'medium' },
    { id: 3, title: 'Client meeting', status: 'completed', dueDate: '2024-03-18', priority: 'high' }
  ]);

  const [reports, setReports] = useState([
    { id: 1, title: 'Monthly Progress Report', type: 'progress', date: '2024-03-15' },
    { id: 2, title: 'Cost Analysis Q1', type: 'financial', date: '2024-03-10' },
    { id: 3, title: 'Team Performance', type: 'performance', date: '2024-03-05' }
  ]);

  const [timeline, setTimeline] = useState([
    { id: 1, event: 'Project Kickoff', date: '2024-03-01', type: 'milestone' },
    { id: 2, event: 'Design Approval', date: '2024-03-15', type: 'approval' },
    { id: 3, event: 'Construction Start', date: '2024-04-01', type: 'milestone' }
  ]);

  const [favorites, setFavorites] = useState([
    { id: 1, name: 'Floor Plan A', type: 'blueprint', date: '2024-03-15' },
    { id: 2, name: 'Material List', type: 'document', date: '2024-03-10' },
    { id: 3, name: 'Cost Calculator', type: 'tool', date: '2024-03-05' }
  ]);

  // Add new state variables for calculations
  const [calculations, setCalculations] = useState({
    area: { length: 0, width: 0, result: 0 },
    volume: { length: 0, width: 0, height: 0, result: 0 },
    materialCost: { quantity: 0, unitPrice: 0, result: 0 },
    structuralLoad: { weight: 0, area: 0, result: 0 },
    energyEfficiency: { power: 0, time: 0, result: 0 },
    sustainabilityScore: { materials: 0, energy: 0, water: 0, result: 0 }
  });

  const [savedCalculations, setSavedCalculations] = useState([
    { id: 1, type: 'area', name: 'Living Room Area', values: { length: 20, width: 15 }, result: 300, date: '2024-03-15' },
    { id: 2, type: 'volume', name: 'Storage Space', values: { length: 10, width: 8, height: 6 }, result: 480, date: '2024-03-14' },
    { id: 3, type: 'materialCost', name: 'Flooring Cost', values: { quantity: 500, unitPrice: 25 }, result: 12500, date: '2024-03-13' }
  ]);

  const [activeCalculator, setActiveCalculator] = useState(null);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showFormulas, setShowFormulas] = useState(false);

  const modules = [
    { id: 'journal', name: 'Journal', icon: FileText, color: 'blue' },
    { id: 'calculations', name: 'Calculations', icon: Calculator, color: 'green' },
    { id: 'blueprints', name: 'Blueprints', icon: Ruler, color: 'purple' },
    { id: 'estimator', name: 'Cost Estimator', icon: DollarSign, color: 'yellow' },
    { id: 'analytics', name: 'Analytics', icon: BarChart, color: 'red' },
    { id: 'collaboration', name: 'Collaboration', icon: Users, color: 'indigo' },
    { id: 'feedback', name: 'AI Feedback', icon: MessageSquare, color: 'pink' },
    { id: 'projects', name: 'Projects', icon: Layers, color: 'orange' },
    { id: 'reports', name: 'Reports', icon: FileSpreadsheet, color: 'teal' },
    { id: 'tasks', name: 'Tasks', icon: ClipboardList, color: 'cyan' },
    { id: 'timeline', name: 'Timeline', icon: Clock, color: 'violet' },
    { id: 'favorites', name: 'Favorites', icon: Star, color: 'amber' }
  ];

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
  };

  const handleFilter = (tag) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter(t => t !== tag));
    } else {
      setFilterTags([...filterTags, tag]);
    }
  };

  const handleNotificationsClick = () => {
    try {
      setNotifications(mockNotifications);
      setShowNotifications(!showNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotificationsError('Failed to load notifications');
    }
  };

  // Calculation functions
  const calculateArea = (length, width) => {
    return length * width;
  };

  const calculateVolume = (length, width, height) => {
    return length * width * height;
  };

  const calculateMaterialCost = (quantity, unitPrice) => {
    return quantity * unitPrice;
  };

  const calculateStructuralLoad = (weight, area) => {
    return weight / area;
  };

  const calculateEnergyEfficiency = (power, time) => {
    return power * time;
  };

  const calculateSustainabilityScore = (materials, energy, water) => {
    return (materials + energy + water) / 3;
  };

  const handleCalculation = (type, values) => {
    let result;
    switch (type) {
      case 'area':
        result = calculateArea(values.length, values.width);
        break;
      case 'volume':
        result = calculateVolume(values.length, values.width, values.height);
        break;
      case 'materialCost':
        result = calculateMaterialCost(values.quantity, values.unitPrice);
        break;
      case 'structuralLoad':
        result = calculateStructuralLoad(values.weight, values.area);
        break;
      case 'energyEfficiency':
        result = calculateEnergyEfficiency(values.power, values.time);
        break;
      case 'sustainabilityScore':
        result = calculateSustainabilityScore(values.materials, values.energy, values.water);
        break;
      default:
        return;
    }

    setCalculations(prev => ({
      ...prev,
      [type]: { ...values, result }
    }));

    setCalculationHistory(prev => [
      { type, values, result, timestamp: new Date().toISOString() },
      ...prev
    ]);
  };

  const saveCalculation = (type, name) => {
    const newCalculation = {
      id: Date.now(),
      type,
      name,
      values: calculations[type],
      result: calculations[type].result,
      date: new Date().toISOString().split('T')[0]
    };

    setSavedCalculations(prev => [newCalculation, ...prev]);
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'journal':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <Plus className="h-5 w-5" />
                  <span>New Entry</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
                  <Upload className="h-5 w-5" />
                  <span>Import</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button onClick={toggleViewMode} className="p-2 rounded-lg border border-gray-300">
                  {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
                </button>
                <button onClick={() => setShowFilters(!showFilters)} className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-4">Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {['Design', 'Research', 'Meeting', 'Ideas', 'Progress'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleFilter(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filterTags.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {[1, 2, 3].map((entry) => (
                <div
                  key={entry}
                  className={`p-4 rounded-lg border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } hover:shadow-lg transition-shadow`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Project Update #{entry}</h3>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm mb-4">
                    Progress update on the residential project. Completed initial measurements
                    and started material calculations.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Tag className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-blue-500">#progress</span>
                    </div>
                    <span className="text-sm text-gray-500">2h ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'calculations':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <Plus className="h-5 w-5" />
                  <span>New Calculation</span>
                </button>
                <button 
                  onClick={() => setShowFormulas(!showFormulas)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300"
                >
                  <FileText className="h-5 w-5" />
                  <span>View Formulas</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button onClick={toggleViewMode} className="p-2 rounded-lg border border-gray-300">
                  {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
                </button>
                <button className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            {showFormulas && (
              <div className="p-4 rounded-lg border border-gray-200 mb-6">
                <h3 className="font-semibold mb-4">Calculation Formulas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Area</h4>
                    <p className="text-sm text-gray-600">A = length × width</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Volume</h4>
                    <p className="text-sm text-gray-600">V = length × width × height</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Material Cost</h4>
                    <p className="text-sm text-gray-600">Cost = quantity × unit price</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Structural Load</h4>
                    <p className="text-sm text-gray-600">Load = weight ÷ area</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Energy Efficiency</h4>
                    <p className="text-sm text-gray-600">Energy = power × time</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Sustainability Score</h4>
                    <p className="text-sm text-gray-600">Score = (materials + energy + water) ÷ 3</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { 
                  title: 'Area Calculator',
                  icon: Ruler,
                  color: 'blue',
                  type: 'area',
                  inputs: [
                    { name: 'length', label: 'Length', unit: 'm' },
                    { name: 'width', label: 'Width', unit: 'm' }
                  ]
                },
                { 
                  title: 'Volume Calculator',
                  icon: Calculator,
                  color: 'green',
                  type: 'volume',
                  inputs: [
                    { name: 'length', label: 'Length', unit: 'm' },
                    { name: 'width', label: 'Width', unit: 'm' },
                    { name: 'height', label: 'Height', unit: 'm' }
                  ]
                },
                { 
                  title: 'Material Cost',
                  icon: DollarSign,
                  color: 'yellow',
                  type: 'materialCost',
                  inputs: [
                    { name: 'quantity', label: 'Quantity', unit: 'units' },
                    { name: 'unitPrice', label: 'Unit Price', unit: '$' }
                  ]
                },
                { 
                  title: 'Structural Load',
                  icon: BarChart,
                  color: 'red',
                  type: 'structuralLoad',
                  inputs: [
                    { name: 'weight', label: 'Weight', unit: 'kg' },
                    { name: 'area', label: 'Area', unit: 'm²' }
                  ]
                },
                { 
                  title: 'Energy Efficiency',
                  icon: Zap,
                  color: 'purple',
                  type: 'energyEfficiency',
                  inputs: [
                    { name: 'power', label: 'Power', unit: 'kW' },
                    { name: 'time', label: 'Time', unit: 'h' }
                  ]
                },
                { 
                  title: 'Sustainability Score',
                  icon: Leaf,
                  color: 'teal',
                  type: 'sustainabilityScore',
                  inputs: [
                    { name: 'materials', label: 'Materials Score', unit: '%' },
                    { name: 'energy', label: 'Energy Score', unit: '%' },
                    { name: 'water', label: 'Water Score', unit: '%' }
                  ]
                }
              ].map((calc) => (
                <div
                  key={calc.title}
                  className={`p-6 rounded-lg border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <calc.icon className={`h-8 w-8 text-${calc.color}-500`} />
                    <h3 className="font-semibold">{calc.title}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {calc.inputs.map((input) => (
                      <div key={input.name} className="space-y-1">
                        <label className="text-sm text-gray-500">{input.label}</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={calculations[calc.type][input.name]}
                            onChange={(e) => {
                              const newValues = {
                                ...calculations[calc.type],
                                [input.name]: parseFloat(e.target.value) || 0
                              };
                              handleCalculation(calc.type, newValues);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Enter ${input.label.toLowerCase()}`}
                          />
                          <span className="text-sm text-gray-500">{input.unit}</span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Result:</span>
                        <span className="text-lg font-semibold">
                          {calculations[calc.type].result.toFixed(2)} {calc.inputs[0].unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <button
                        onClick={() => saveCalculation(calc.type, `${calc.title} ${new Date().toLocaleDateString()}`)}
                        className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setActiveCalculator(calc.type)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Saved Calculations */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Saved Calculations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCalculations.map((calc) => (
                  <div
                    key={calc.id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    } hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{calc.name}</h4>
                        <p className="text-sm text-gray-500">{calc.date}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 rounded hover:bg-gray-100">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Type:</span>
                        <span className="text-sm font-medium capitalize">{calc.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Result:</span>
                        <span className="text-sm font-medium">{calc.result}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculation History */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Recent Calculations</h3>
              <div className="space-y-4">
                {calculationHistory.slice(0, 5).map((calc, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium capitalize">{calc.type} Calculation</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(calc.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-lg font-semibold">{calc.result}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'blueprints':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <Plus className="h-5 w-5" />
                  <span>New Blueprint</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
                  <Upload className="h-5 w-5" />
                  <span>Import</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button className="p-2 rounded-lg border border-gray-300">
                  <Grid className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((blueprint) => (
                <div
                  key={blueprint}
                  className={`p-4 rounded-lg border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } hover:shadow-lg transition-shadow`}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-4">
                    <FileImage className="h-12 w-12 text-gray-400 m-auto" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Floor Plan #{blueprint}</h3>
                      <p className="text-sm text-gray-500">Last updated 2h ago</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'estimator':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <Plus className="h-5 w-5" />
                  <span>New Estimate</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
                  <Download className="h-5 w-5" />
                  <span>Export</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setShowCostBreakdown(!showCostBreakdown)} className="p-2 rounded-lg border border-gray-300">
                  <BarChart2 className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            {showCostBreakdown && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-4">Cost Breakdown</h3>
                  <div className="space-y-4">
                    {[
                      { category: 'Materials', amount: 25000, percentage: 40 },
                      { category: 'Labor', amount: 20000, percentage: 32 },
                      { category: 'Equipment', amount: 8000, percentage: 13 },
                      { category: 'Permits', amount: 5000, percentage: 8 },
                      { category: 'Miscellaneous', amount: 4000, percentage: 7 }
                    ].map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <span className="text-sm">{item.category}</span>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">${item.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-4">Cost Trends</h3>
                  <div className="h-64 flex items-center justify-center">
                    <LineChart className="h-32 w-32 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Material Costs', icon: DollarSign, color: 'green' },
                { title: 'Labor Costs', icon: Users, color: 'blue' },
                { title: 'Equipment Rental', icon: Wrench, color: 'yellow' },
                { title: 'Permits & Fees', icon: FileText, color: 'red' },
                { title: 'Contingency', icon: AlertCircle, color: 'purple' },
                { title: 'Total Estimate', icon: Calculator, color: 'indigo' }
              ].map((item) => (
                <div
                  key={item.title}
                  className={`p-6 rounded-lg border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } hover:shadow-lg transition-shadow`}
                >
                  <item.icon className={`h-8 w-8 text-${item.color}-500 mb-4`} />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-2xl font-bold mb-2">$25,000</p>
                  <p className="text-sm text-gray-500">Last updated 2h ago</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <Download className="h-5 w-5" />
                  <span>Export Report</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
                  <Calendar className="h-5 w-5" />
                  <span>Select Period</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setShowAnalytics(!showAnalytics)} className="p-2 rounded-lg border border-gray-300">
                  <BarChart2 className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Total Projects', value: '24', icon: Folder, color: 'blue' },
                { title: 'Active Projects', value: '12', icon: Activity, color: 'green' },
                { title: 'Completed', value: '8', icon: CheckCircle, color: 'purple' },
                { title: 'On Hold', value: '4', icon: PauseCircle, color: 'yellow' }
              ].map((stat) => (
                <div
                  key={stat.title}
                  className={`p-6 rounded-lg border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } hover:shadow-lg transition-shadow`}
                >
                  <stat.icon className={`h-8 w-8 text-${stat.color}-500 mb-4`} />
                  <h3 className="font-semibold mb-2">{stat.title}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-4">Project Timeline</h3>
                <div className="h-64 flex items-center justify-center">
                  <LineChart className="h-32 w-32 text-gray-400" />
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-4">Resource Allocation</h3>
                <div className="h-64 flex items-center justify-center">
                  <PieChart className="h-32 w-32 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'collaboration':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <UserPlus className="h-5 w-5" />
                  <span>Invite Team</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
                  <MessageCircle className="h-5 w-5" />
                  <span>Start Chat</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setShowCollaboration(!showCollaboration)} className="p-2 rounded-lg border border-gray-300">
                  <Users className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            {showCollaboration && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-4">Team Members</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'John Doe', role: 'Project Manager', status: 'online' },
                      { name: 'Jane Smith', role: 'Designer', status: 'offline' },
                      { name: 'Mike Johnson', role: 'Engineer', status: 'online' }
                    ].map((member) => (
                      <div key={member.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <UserCircle className="h-10 w-10 text-gray-400" />
                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${
                              member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1 rounded hover:bg-gray-100">
                            <MessageCircle className="h-5 w-5" />
                          </button>
                          <button className="p-1 rounded hover:bg-gray-100">
                            <Video className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { action: 'Updated project timeline', user: 'John Doe', time: '2h ago' },
                      { action: 'Added new blueprint', user: 'Jane Smith', time: '4h ago' },
                      { action: 'Completed cost estimate', user: 'Mike Johnson', time: '1d ago' }
                    ].map((activity) => (
                      <div key={activity.action} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <UserCircle className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-500">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Team Chat', icon: MessageCircle, color: 'blue' },
                { title: 'Video Call', icon: Video, color: 'green' },
                { title: 'File Sharing', icon: Share2, color: 'purple' },
                { title: 'Task Board', icon: ClipboardList, color: 'yellow' },
                { title: 'Calendar', icon: Calendar, color: 'red' },
                { title: 'Team Docs', icon: FileText, color: 'indigo' }
              ].map((tool) => (
                <div
                  key={tool.title}
                  className={`p-6 rounded-lg border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } hover:shadow-lg transition-shadow`}
                >
                  <tool.icon className={`h-8 w-8 text-${tool.color}-500 mb-4`} />
                  <h3 className="font-semibold mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Collaborate with your team using {tool.title.toLowerCase()}
                  </p>
                  <button className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white">
                    Open {tool.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <Upload className="h-5 w-5" />
                  <span>Upload Design</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
                  <Mic className="h-5 w-5" />
                  <span>Voice Input</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setShowAIAssistant(!showAIAssistant)} className="p-2 rounded-lg border border-gray-300">
                  <Brain className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            {showAIAssistant && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-4">AI Suggestions</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Design Optimization', description: 'Consider adjusting the layout for better space utilization' },
                      { title: 'Material Selection', description: 'Alternative materials could reduce costs by 15%' },
                      { title: 'Sustainability', description: 'Adding solar panels could improve energy efficiency' }
                    ].map((suggestion) => (
                      <div key={suggestion.title} className="p-3 rounded-lg bg-blue-50">
                        <h4 className="font-medium mb-1">{suggestion.title}</h4>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-4">AI Analysis</h3>
                  <div className="space-y-4">
                    {[
                      { metric: 'Design Score', value: '85%', icon: Award },
                      { metric: 'Cost Efficiency', value: '78%', icon: DollarSign },
                      { metric: 'Sustainability', value: '92%', icon: Leaf }
                    ].map((metric) => (
                      <div key={metric.metric} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <metric.icon className="h-6 w-6 text-blue-500" />
                          <span>{metric.metric}</span>
                        </div>
                        <span className="font-semibold">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Design Analysis', icon: Eye, color: 'blue' },
                { title: 'Cost Optimization', icon: DollarSign, color: 'green' },
                { title: 'Sustainability Check', icon: Leaf, color: 'purple' },
                { title: 'Code Compliance', icon: Shield, color: 'yellow' },
                { title: 'Material Suggestions', icon: Package, color: 'red' },
                { title: 'Energy Efficiency', icon: Zap, color: 'indigo' }
              ].map((feature) => (
                <div
                  key={feature.title}
                  className={`p-6 rounded-lg border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } hover:shadow-lg transition-shadow`}
                >
                  <feature.icon className={`h-8 w-8 text-${feature.color}-500 mb-4`} />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Get AI-powered insights for {feature.title.toLowerCase()}
                  </p>
                  <button className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white">
                    Analyze
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <Plus className="h-5 w-5" />
                  <span>New Project</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
                  <Upload className="h-5 w-5" />
                  <span>Import</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button onClick={toggleViewMode} className="p-2 rounded-lg border border-gray-300">
                  {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
                </button>
                <button className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 rounded-lg border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } hover:shadow-lg transition-shadow`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Progress</span>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {project.team.length} team members
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <Plus className="h-5 w-5" />
                  <span>New Task</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
                  <Calendar className="h-5 w-5" />
                  <span>Calendar View</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['pending', 'in-progress', 'completed'].map((status) => (
                <div
                  key={status}
                  className={`p-4 rounded-lg border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <h3 className="font-semibold mb-4 capitalize">{status}</h3>
                  <div className="space-y-4">
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task) => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{task.title}</h4>
                            <div className="flex space-x-2">
                              <button className="p-1 rounded hover:bg-gray-100">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="p-1 rounded hover:bg-gray-100">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Due: {task.dueDate}</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                task.priority === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : task.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <Plus className="h-5 w-5" />
                  <span>New Report</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
                  <Download className="h-5 w-5" />
                  <span>Export All</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 rounded-lg border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } hover:shadow-lg transition-shadow`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{report.title}</h3>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 capitalize">{report.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{report.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <Plus className="h-5 w-5" />
                  <span>Add Event</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
                  <Calendar className="h-5 w-5" />
                  <span>Calendar View</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-8">
                {timeline.map((event) => (
                  <div key={event.id} className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div
                      className={`p-4 rounded-lg border ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                      } hover:shadow-lg transition-shadow`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{event.event}</h3>
                          <p className="text-sm text-gray-500">{event.date}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            event.type === 'milestone'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white">
                  <Plus className="h-5 w-5" />
                  <span>Add to Favorites</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300">
                  <Download className="h-5 w-5" />
                  <span>Export</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <button onClick={toggleViewMode} className="p-2 rounded-lg border border-gray-300">
                  {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
                </button>
                <button className="p-2 rounded-lg border border-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } hover:shadow-lg transition-shadow`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Star className="h-4 w-4 text-yellow-500" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 capitalize">{item.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Module Under Development</h3>
            <p className="text-gray-500">
              This module is currently being developed. Please check back later.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                title="Go Back"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleGoHome}
                className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                title="Go to Homepage"
              >
                <Home className="h-6 w-6" />
              </button>
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                title="Toggle Sidebar"
              >
                {isSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
              </button>
              <div className="flex items-center space-x-2">
                <Layers className="h-8 w-8 text-blue-500" />
                <h1 className="text-xl font-bold">Design Diary</h1>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search projects, notes, or calculations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleRecording}
                className={`p-2 rounded-full ${isRecording ? 'bg-red-500 text-white' : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                title="Voice Input"
              >
                <Mic className="h-5 w-5" />
              </button>
              
              <div className="relative">
                <button
                  onClick={handleNotificationsClick}
                  className={`p-2 rounded-full ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } ring-1 ring-black ring-opacity-5`}
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                        {notificationsError ? (
                          <p className="text-sm text-red-500">{notificationsError}</p>
                        ) : (
                          <div className="space-y-2">
                            {notifications.map((notification) => (
                              <div key={notification.id} className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                                <p className="text-sm font-medium">{notification.title}</p>
                                <p className="text-xs text-gray-500">{notification.time}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="relative">
                <button
                  className={`p-2 rounded-full ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                  title="User Settings"
                >
                  <User className="h-5 w-5" />
                </button>
              </div>

              <button
                className={`p-2 rounded-full ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                title="Help & Support"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0 }}
              animate={{ width: 240 }}
              exit={{ width: 0 }}
              className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-y-auto`}
            >
              <div className="p-4">
                <div className="space-y-2">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        activeModule === module.id
                          ? isDarkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-blue-50 text-blue-600'
                          : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <module.icon className={`h-5 w-5 text-${module.color}-500`} />
                      <span>{module.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-60' : 'ml-0'
          } p-6`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Status Bar */}
            <div className={`flex items-center justify-between mb-6 p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="flex items-center space-x-4">
                {isOffline ? (
                  <WifiOff className="h-5 w-5 text-red-500" />
                ) : (
                  <Wifi className="h-5 w-5 text-green-500" />
                )}
                <span className="text-sm">
                  {isOffline ? 'Offline Mode' : 'Online'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-sm">
                  <Cloud className="h-5 w-5" />
                  <span>Cloud Sync</span>
                </button>
                <button className="flex items-center space-x-2 text-sm">
                  <Lock className="h-5 w-5" />
                  <span>Secure</span>
                </button>
              </div>
            </div>

            {/* Module Content */}
            <div className={`rounded-lg shadow-lg overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6">
                {renderModuleContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DesignDiary; 