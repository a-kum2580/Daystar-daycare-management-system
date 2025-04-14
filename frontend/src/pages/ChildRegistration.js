import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

export function ChildRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    medicalNotes: '',
    allergies: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    if (!formData.parentName.trim()) newErrors.parentName = "Parent's name is required";
    if (!formData.parentPhone.trim()) newErrors.parentPhone = "Parent phone number is required";
    if (!formData.parentEmail.trim()) newErrors.parentEmail = "Parent email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.parentEmail)) newErrors.parentEmail = "Email is invalid";
    
    // Emergency contact validation
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact name is required";
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency contact phone is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // TODO: Implement actual child registration logic
      console.log("Registering child:", formData);
      
      // Simulate successful registration
      setTimeout(() => {
        setIsSuccess(true);
      }, 1000);
    } catch (error) {
      console.error("Child registration failed:", error);
    }
  };

  const handleAddAnother = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      medicalNotes: '',
      allergies: '',
      emergencyContact: '',
      emergencyPhone: ''
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Child Registration</h1>
          <p className="text-gray-600">Please fill out the form below to register your child at Daystar Daycare Center.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Child Registration Form</CardTitle>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                    <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                      required
                    />
              </div>
                <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                      required
                  />
                </div>
                <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                    name="gender"
                    value={formData.gender}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                <div>
                    <Label htmlFor="parentName">Parent/Guardian Name</Label>
                    <Input
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      required
                    />
              </div>
                <div>
                  <Label htmlFor="parentPhone">Parent Phone</Label>
                    <Input
                    id="parentPhone"
                    name="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={handleChange}
                      required
                  />
                </div>
                <div>
                  <Label htmlFor="parentEmail">Parent Email</Label>
                    <Input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleChange}
                      required
                    />
                  </div>
                <div>
                    <Label htmlFor="address">Address</Label>
                  <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
            </div>
                </div>
              <div>
                <Label htmlFor="medicalNotes">Medical Notes</Label>
                <Textarea
                  id="medicalNotes"
                  name="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Register Child</Button>
            </div>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ChildRegistration; 