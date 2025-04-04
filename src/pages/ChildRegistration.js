import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ChildRegistration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    parentEmail: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    sessionType: "full-day", // Default to full-day
    specialNeeds: "",
    allergies: "",
    medicalConditions: "",
    dietaryRestrictions: "",
    additionalNotes: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Child information validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    
    // Parent information validation
    if (!formData.parentFirstName.trim()) newErrors.parentFirstName = "Parent first name is required";
    if (!formData.parentLastName.trim()) newErrors.parentLastName = "Parent last name is required";
    if (!formData.parentPhone.trim()) newErrors.parentPhone = "Parent phone number is required";
    if (!formData.parentEmail.trim()) newErrors.parentEmail = "Parent email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.parentEmail)) newErrors.parentEmail = "Email is invalid";
    
    // Emergency contact validation
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = "Emergency contact name is required";
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = "Emergency contact phone is required";
    if (!formData.emergencyContactRelationship.trim()) newErrors.emergencyContactRelationship = "Emergency contact relationship is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // TODO: Implement actual child registration logic
      console.log("Registering child:", formData);
      
      // Simulate successful registration
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1000);
    } catch (error) {
      console.error("Child registration failed:", error);
      setIsLoading(false);
    }
  };

  const handleAddAnother = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      parentFirstName: "",
      parentLastName: "",
      parentPhone: "",
      parentEmail: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      sessionType: "full-day",
      specialNeeds: "",
      allergies: "",
      medicalConditions: "",
      dietaryRestrictions: "",
      additionalNotes: "",
    });
    setErrors({});
    setIsSuccess(false);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Registration Successful!</h2>
            <p className="mt-2 text-sm text-gray-600">
              {formData.firstName} {formData.lastName} has been successfully registered.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="space-y-4">
              <button
                onClick={handleAddAnother}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register Another Child
              </button>
              <button
                onClick={handleBackToDashboard}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Child Registration</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please fill out the form below to register a new child at DayStar Daycare Centre.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Child Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Child Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
                </div>
              </div>
            </div>

            {/* Parent Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="parentFirstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    id="parentFirstName"
                    name="parentFirstName"
                    type="text"
                    value={formData.parentFirstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.parentFirstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.parentFirstName && <p className="text-xs text-red-500">{errors.parentFirstName}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="parentLastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    id="parentLastName"
                    name="parentLastName"
                    type="text"
                    value={formData.parentLastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.parentLastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.parentLastName && <p className="text-xs text-red-500">{errors.parentLastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    id="parentPhone"
                    name="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.parentPhone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.parentPhone && <p className="text-xs text-red-500">{errors.parentPhone}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.parentEmail ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.parentEmail && <p className="text-xs text-red-500">{errors.parentEmail}</p>}
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.emergencyContactName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.emergencyContactName && <p className="text-xs text-red-500">{errors.emergencyContactName}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.emergencyContactPhone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.emergencyContactPhone && <p className="text-xs text-red-500">{errors.emergencyContactPhone}</p>}
                </div>
              </div>

              <div className="mt-4">
                <div className="space-y-2">
                  <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-gray-700">Relationship to Child</label>
                  <input
                    id="emergencyContactRelationship"
                    name="emergencyContactRelationship"
                    type="text"
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.emergencyContactRelationship ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.emergencyContactRelationship && <p className="text-xs text-red-500">{errors.emergencyContactRelationship}</p>}
                </div>
              </div>
            </div>

            {/* Session Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Session Information</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Session Type</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sessionType"
                      value="half-day"
                      checked={formData.sessionType === "half-day"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Half-Day (2,000K)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="sessionType"
                      value="full-day"
                      checked={formData.sessionType === "full-day"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Full-Day (5,000K)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Special Needs Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Special Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies</label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    rows="2"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="List any allergies or leave blank if none"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                  <textarea
                    id="medicalConditions"
                    name="medicalConditions"
                    rows="2"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    placeholder="List any medical conditions or leave blank if none"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700">Dietary Restrictions</label>
                  <textarea
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    rows="2"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    placeholder="List any dietary restrictions or leave blank if none"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    rows="3"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="Any additional information about the child"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleBackToDashboard}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register Child"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChildRegistration; 