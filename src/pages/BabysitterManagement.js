import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BabysitterForm from "../components/BabysitterForm";

// Sample data - would be replaced with API calls
const sampleBabysitters = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "+260 97 123 4567",
    nin: "123456789",
    dateOfBirth: "1995-05-15",
    age: 28,
    status: "active",
    nextOfKinName: "Michael Johnson",
    nextOfKinPhone: "+260 97 765 4321",
    nextOfKinRelationship: "Brother",
    childrenAssigned: 3,
    paymentRate: 5000,
    lastPaymentDate: "2023-06-15",
  },
  {
    id: 2,
    firstName: "David",
    lastName: "Banda",
    email: "david.banda@example.com",
    phone: "+260 96 234 5678",
    nin: "234567890",
    dateOfBirth: "1992-08-22",
    age: 31,
    status: "active",
    nextOfKinName: "Grace Banda",
    nextOfKinPhone: "+260 97 876 5432",
    nextOfKinRelationship: "Mother",
    childrenAssigned: 4,
    paymentRate: 5000,
    lastPaymentDate: "2023-06-15",
  },
  {
    id: 3,
    firstName: "Mary",
    lastName: "Phiri",
    email: "mary.phiri@example.com",
    phone: "+260 95 345 6789",
    nin: "345678901",
    dateOfBirth: "1998-03-10",
    age: 25,
    status: "inactive",
    nextOfKinName: "John Phiri",
    nextOfKinPhone: "+260 97 987 6543",
    nextOfKinRelationship: "Father",
    childrenAssigned: 0,
    paymentRate: 5000,
    lastPaymentDate: "2023-05-20",
  },
  {
    id: 4,
    firstName: "James",
    lastName: "Mwanza",
    email: "james.mwanza@example.com",
    phone: "+260 97 456 7890",
    nin: "456789012",
    dateOfBirth: "1993-11-05",
    age: 30,
    status: "active",
    nextOfKinName: "Elizabeth Mwanza",
    nextOfKinPhone: "+260 96 098 7654",
    nextOfKinRelationship: "Sister",
    childrenAssigned: 2,
    paymentRate: 5000,
    lastPaymentDate: "2023-06-15",
  },
];

export function BabysitterManagement() {
  const [babysitters, setBabysitters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedBabysitter, setSelectedBabysitter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch babysitters
    const fetchBabysitters = () => {
      setTimeout(() => {
        setBabysitters(sampleBabysitters);
        setIsLoading(false);
      }, 1000);
    };

    fetchBabysitters();
  }, []);

  const handleAddBabysitter = () => {
    setShowAddForm(true);
  };

  const handleEditBabysitter = (babysitter) => {
    setSelectedBabysitter(babysitter);
    setShowEditForm(true);
  };

  const handleViewDetails = (babysitter) => {
    setSelectedBabysitter(babysitter);
    // In a real app, this would navigate to a detailed view
    // navigate(`/babysitters/${babysitter.id}`);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleFormSubmit = (formData) => {
    if (showEditForm) {
      // Update existing babysitter
      const updatedBabysitters = babysitters.map(babysitter => 
        babysitter.id === selectedBabysitter.id 
          ? { ...formData, id: babysitter.id } 
          : babysitter
      );
      setBabysitters(updatedBabysitters);
      setShowEditForm(false);
      setSelectedBabysitter(null);
    } else {
      // Add new babysitter
      const newBabysitter = {
        ...formData,
        id: babysitters.length > 0 ? Math.max(...babysitters.map(b => b.id)) + 1 : 1,
      };
      setBabysitters([...babysitters, newBabysitter]);
      setShowAddForm(false);
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedBabysitter(null);
  };

  const filteredBabysitters = babysitters.filter((babysitter) => {
    const matchesSearch = 
      babysitter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      babysitter.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      babysitter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      babysitter.phone.includes(searchTerm);
    
    const matchesStatus = 
      filterStatus === "all" || 
      babysitter.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading babysitters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Babysitter Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and track all babysitters at DayStar Daycare Centre
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleAddBabysitter}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Babysitter
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by name, email, or phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Babysitters Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Children
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBabysitters.length > 0 ? (
                  filteredBabysitters.map((babysitter) => (
                    <tr key={babysitter.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {babysitter.firstName.charAt(0)}{babysitter.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {babysitter.firstName} {babysitter.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {babysitter.nin}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{babysitter.email}</div>
                        <div className="text-sm text-gray-500">{babysitter.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {babysitter.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          babysitter.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {babysitter.status.charAt(0).toUpperCase() + babysitter.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {babysitter.childrenAssigned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(babysitter.lastPaymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(babysitter)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditBabysitter(babysitter)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No babysitters found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Babysitters</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{babysitters.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Babysitters</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {babysitters.filter(b => b.status === 'active').length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Children Assigned</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {babysitters.reduce((total, b) => total + b.childrenAssigned, 0)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Children per Babysitter</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {(babysitters.reduce((total, b) => total + b.childrenAssigned, 0) / 
                          babysitters.filter(b => b.status === 'active').length || 0).toFixed(1)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Babysitter Form Modal */}
      {(showAddForm || showEditForm) && (
        <BabysitterForm
          babysitter={selectedBabysitter}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          isEditing={showEditForm}
        />
      )}
    </div>
  );
}

export default BabysitterManagement; 