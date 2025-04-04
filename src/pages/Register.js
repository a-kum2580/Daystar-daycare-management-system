import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "babysitter", // Default role
    nin: "", // National Identification Number
    dateOfBirth: "", // For age validation
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinRelationship: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
    
    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Role-specific validation
    if (formData.role === "babysitter") {
      if (!formData.nin.trim()) newErrors.nin = "National ID is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      else {
        // Age validation (21-35 years)
        const today = new Date();
        const birthDate = new Date(formData.dateOfBirth);
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        
        if (calculatedAge < 21 || calculatedAge > 35) {
          newErrors.dateOfBirth = "Babysitters must be between 21 and 35 years old";
        }
      }
      
      if (!formData.nextOfKinName.trim()) newErrors.nextOfKinName = "Next of kin name is required";
      if (!formData.nextOfKinPhone.trim()) newErrors.nextOfKinPhone = "Next of kin phone is required";
      if (!formData.nextOfKinRelationship.trim()) newErrors.nextOfKinRelationship = "Next of kin relationship is required";
    }
    
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
      // TODO: Implement actual registration logic
      console.log("Registering user:", formData);
      
      // Simulate successful registration
      setTimeout(() => {
        setIsLoading(false);
        navigate("/login", { state: { message: "Registration successful! Please log in." } });
      }, 1000);
    } catch (error) {
      console.error("Registration failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            <span className="text-blue-500">DayStar</span>
            <span className="text-yellow-400">Connect</span>
          </h2>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">I am registering as a:</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="babysitter"
                    checked={formData.role === "babysitter"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Babysitter</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="manager"
                    checked={formData.role === "manager"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Manager</span>
                </label>
              </div>
            </div>

            {/* Basic Information */}
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

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Babysitter-specific fields */}
            {formData.role === "babysitter" && (
              <>
                <div className="space-y-2">
                  <label htmlFor="nin" className="block text-sm font-medium text-gray-700">National ID Number</label>
                  <input
                    id="nin"
                    name="nin"
                    type="text"
                    value={formData.nin}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.nin ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.nin && <p className="text-xs text-red-500">{errors.nin}</p>}
                </div>

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

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Next of Kin Information</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="nextOfKinName" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      id="nextOfKinName"
                      name="nextOfKinName"
                      type="text"
                      value={formData.nextOfKinName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.nextOfKinName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.nextOfKinName && <p className="text-xs text-red-500">{errors.nextOfKinName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="nextOfKinPhone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      id="nextOfKinPhone"
                      name="nextOfKinPhone"
                      type="tel"
                      value={formData.nextOfKinPhone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.nextOfKinPhone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.nextOfKinPhone && <p className="text-xs text-red-500">{errors.nextOfKinPhone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="nextOfKinRelationship" className="block text-sm font-medium text-gray-700">Relationship</label>
                    <input
                      id="nextOfKinRelationship"
                      name="nextOfKinRelationship"
                      type="text"
                      value={formData.nextOfKinRelationship}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.nextOfKinRelationship ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.nextOfKinRelationship && <p className="text-xs text-red-500">{errors.nextOfKinRelationship}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Password fields */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register; 