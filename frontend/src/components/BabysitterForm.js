import React, { useState, useEffect } from "react";

export function BabysitterForm({ babysitter, onSubmit, onCancel, isEditing }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nin: "",
    dateOfBirth: "",
    status: "active",
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinRelationship: "",
    paymentRate: 5000,
    childrenAssigned: 0,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (babysitter) {
      setFormData({
        firstName: babysitter.firstName || "",
        lastName: babysitter.lastName || "",
        email: babysitter.email || "",
        phone: babysitter.phone || "",
        nin: babysitter.nin || "",
        dateOfBirth: babysitter.dateOfBirth || "",
        status: babysitter.status || "active",
        nextOfKinName: babysitter.nextOfKinName || "",
        nextOfKinPhone: babysitter.nextOfKinPhone || "",
        nextOfKinRelationship: babysitter.nextOfKinRelationship || "",
        paymentRate: babysitter.paymentRate || 5000,
        childrenAssigned: babysitter.childrenAssigned || 0,
      });
    }
  }, [babysitter]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
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
    
    if (formData.paymentRate < 0) newErrors.paymentRate = "Payment rate cannot be negative";
    if (formData.childrenAssigned < 0) newErrors.childrenAssigned = "Children assigned cannot be negative";
    
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
      // Calculate age for display purposes
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      // Add age to form data
      const dataToSubmit = {
        ...formData,
        age: calculatedAge,
        lastPaymentDate: isEditing ? babysitter.lastPaymentDate : new Date().toISOString().split('T')[0],
      };
      
      await onSubmit(dataToSubmit);
      setIsLoading(false);
    } catch (error) {
      console.error("Form submission failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Babysitter" : "Add New Babysitter"}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
              <div>
                <label htmlFor="nin" className="block text-sm font-medium text-gray-700">National ID Number</label>
                <input
                  type="text"
                  name="nin"
                  id="nin"
                  value={formData.nin}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.nin ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.nin && <p className="mt-1 text-sm text-red-600">{errors.nin}</p>}
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Next of Kin Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Next of Kin Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nextOfKinName" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="nextOfKinName"
                  id="nextOfKinName"
                  value={formData.nextOfKinName}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.nextOfKinName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.nextOfKinName && <p className="mt-1 text-sm text-red-600">{errors.nextOfKinName}</p>}
              </div>
              <div>
                <label htmlFor="nextOfKinPhone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="nextOfKinPhone"
                  id="nextOfKinPhone"
                  value={formData.nextOfKinPhone}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.nextOfKinPhone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.nextOfKinPhone && <p className="mt-1 text-sm text-red-600">{errors.nextOfKinPhone}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="nextOfKinRelationship" className="block text-sm font-medium text-gray-700">Relationship</label>
              <input
                type="text"
                name="nextOfKinRelationship"
                id="nextOfKinRelationship"
                value={formData.nextOfKinRelationship}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.nextOfKinRelationship ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.nextOfKinRelationship && <p className="mt-1 text-sm text-red-600">{errors.nextOfKinRelationship}</p>}
            </div>
          </div>

          {/* Employment Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="paymentRate" className="block text-sm font-medium text-gray-700">Payment Rate (K)</label>
                <input
                  type="number"
                  name="paymentRate"
                  id="paymentRate"
                  value={formData.paymentRate}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.paymentRate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.paymentRate && <p className="mt-1 text-sm text-red-600">{errors.paymentRate}</p>}
              </div>
              <div>
                <label htmlFor="childrenAssigned" className="block text-sm font-medium text-gray-700">Children Assigned</label>
                <input
                  type="number"
                  name="childrenAssigned"
                  id="childrenAssigned"
                  value={formData.childrenAssigned}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.childrenAssigned ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.childrenAssigned && <p className="mt-1 text-sm text-red-600">{errors.childrenAssigned}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? "Saving..." : isEditing ? "Update Babysitter" : "Add Babysitter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BabysitterForm; 