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
    childName: '',
    dateOfBirth: '',
    gender: '',
    allergies: '',
    medicalConditions: '',
    emergencyContact: '',
    emergencyPhone: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    preferredDays: [],
    sessionType: '',
    additionalNotes: ''
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
    if (!formData.childName.trim()) newErrors.childName = "Child's name is required";
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
      childName: '',
      dateOfBirth: '',
      gender: '',
      allergies: '',
      medicalConditions: '',
      emergencyContact: '',
      emergencyPhone: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      preferredDays: [],
      sessionType: '',
      additionalNotes: ''
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
              {formData.childName} has been successfully registered.
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
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>Enter your child's information below</CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Child Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Child Information</h3>
                  
                <div className="space-y-2">
                    <Label htmlFor="childName">Child's Full Name</Label>
                    <Input
                      id="childName"
                      name="childName"
                      value={formData.childName}
                    onChange={handleChange}
                      required
                    />
              </div>

                <div className="space-y-2">
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

                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
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
                </div>

                {/* Health Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Health Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="List any allergies (if none, write 'None')"
                    />
            </div>

                <div className="space-y-2">
                    <Label htmlFor="medicalConditions">Medical Conditions</Label>
                    <Input
                      id="medicalConditions"
                      name="medicalConditions"
                      value={formData.medicalConditions}
                    onChange={handleChange}
                      placeholder="List any medical conditions (if none, write 'None')"
                  />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Emergency Contact</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      required
                    />
                  </div>

                <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone Number</Label>
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

                {/* Parent Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Parent/Guardian Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent/Guardian Name</Label>
                    <Input
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      required
                    />
              </div>

                <div className="space-y-2">
                    <Label htmlFor="parentPhone">Phone Number</Label>
                    <Input
                    id="parentPhone"
                    name="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={handleChange}
                      required
                  />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="parentEmail">Email</Label>
                    <Input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
            </div>
                </div>

                {/* Enrollment Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Enrollment Details</h3>

                <div className="space-y-2">
                    <Label htmlFor="sessionType">Preferred Session Type</Label>
                    <Select
                      onValueChange={(value) => setFormData(prev => ({ ...prev, sessionType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="half-day">Half Day (Morning)</SelectItem>
                        <SelectItem value="full-day">Full Day</SelectItem>
                      </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                      placeholder="Any additional information we should know"
                  />
                </div>
              </div>
            </div>

              <div className="flex justify-end">
                <Button type="submit" size="lg">Submit Registration</Button>
            </div>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ChildRegistration; 