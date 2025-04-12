import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { enrollmentService } from '../services/enrollmentService';

export function ChildEnrollment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    childFirstName: '',
    childLastName: '',
    dateOfBirth: '',
    gender: '',
    programType: '',
    startDate: '',
    parentFirstName: '',
    parentLastName: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalInfo: '',
    allergies: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});

  const validateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 && age <= 5; // Assuming daycare is for children 0-5 years old
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Validate age when date of birth changes
    if (name === 'dateOfBirth' && value) {
      if (!validateAge(value)) {
        setErrors(prev => ({
          ...prev,
          dateOfBirth: 'Child must be between 0 and 5 years old'
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const newErrors = {};
    if (!formData.childFirstName) newErrors.childFirstName = 'Child\'s first name is required';
    if (!formData.childLastName) newErrors.childLastName = 'Child\'s last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.programType) newErrors.programType = 'Program type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.parentFirstName) newErrors.parentFirstName = 'Parent\'s first name is required';
    if (!formData.parentLastName) newErrors.parentLastName = 'Parent\'s last name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.emergencyContact) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.emergencyPhone) newErrors.emergencyPhone = 'Emergency phone is required';

    // Validate age
    if (formData.dateOfBirth && !validateAge(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Child must be between 0 and 5 years old';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      setIsLoading(true);
      
      // Submit enrollment using the service
      await enrollmentService.submitEnrollment(formData);
      
      toast.success('Child enrollment submitted successfully');
      
      // Reset form
      setFormData({
        childFirstName: '',
        childLastName: '',
        dateOfBirth: '',
        gender: '',
        programType: '',
        startDate: '',
        parentFirstName: '',
        parentLastName: '',
        phone: '',
        email: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        medicalInfo: '',
        allergies: '',
        additionalNotes: ''
      });
      
      // Navigate back to enrollment page
      navigate('/enrollment');
      
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      toast.error('Failed to submit enrollment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Child Enrollment Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="childFirstName">Child's First Name</Label>
                <Input
                  id="childFirstName"
                  name="childFirstName"
                  value={formData.childFirstName}
                  onChange={handleChange}
                  required
                  className={errors.childFirstName ? 'border-red-500' : ''}
                />
                {errors.childFirstName && <p className="text-sm text-red-500 mt-1">{errors.childFirstName}</p>}
              </div>
              <div>
                <Label htmlFor="childLastName">Child's Last Name</Label>
                <Input
                  id="childLastName"
                  name="childLastName"
                  value={formData.childLastName}
                  onChange={handleChange}
                  required
                  className={errors.childLastName ? 'border-red-500' : ''}
                />
                {errors.childLastName && <p className="text-sm text-red-500 mt-1">{errors.childLastName}</p>}
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
                  className={errors.dateOfBirth ? 'border-red-500' : ''}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender}</p>}
              </div>
              <div>
                <Label htmlFor="programType">Program Type</Label>
                <Select
                  name="programType"
                  value={formData.programType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, programType: value }))}
                >
                  <SelectTrigger className={errors.programType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="after-school">After School</SelectItem>
                  </SelectContent>
                </Select>
                {errors.programType && <p className="text-sm text-red-500 mt-1">{errors.programType}</p>}
              </div>
              <div>
                <Label htmlFor="startDate">Desired Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <Label htmlFor="parentFirstName">Parent's First Name</Label>
                <Input
                  id="parentFirstName"
                  name="parentFirstName"
                  value={formData.parentFirstName}
                  onChange={handleChange}
                  required
                  className={errors.parentFirstName ? 'border-red-500' : ''}
                />
                {errors.parentFirstName && <p className="text-sm text-red-500 mt-1">{errors.parentFirstName}</p>}
              </div>
              <div>
                <Label htmlFor="parentLastName">Parent's Last Name</Label>
                <Input
                  id="parentLastName"
                  name="parentLastName"
                  value={formData.parentLastName}
                  onChange={handleChange}
                  required
                  className={errors.parentLastName ? 'border-red-500' : ''}
                />
                {errors.parentLastName && <p className="text-sm text-red-500 mt-1">{errors.parentLastName}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
              </div>
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
                  className={errors.emergencyContact ? 'border-red-500' : ''}
                />
                {errors.emergencyContact && <p className="text-sm text-red-500 mt-1">{errors.emergencyContact}</p>}
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
                  className={errors.emergencyPhone ? 'border-red-500' : ''}
                />
                {errors.emergencyPhone && <p className="text-sm text-red-500 mt-1">{errors.emergencyPhone}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="medicalInfo">Medical Information</Label>
              <Textarea
                id="medicalInfo"
                name="medicalInfo"
                value={formData.medicalInfo}
                onChange={handleChange}
                placeholder="Please provide any relevant medical information"
              />
            </div>
            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Please list any allergies or write 'None'"
              />
            </div>
            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Any additional information you'd like us to know"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>Submit Enrollment</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 