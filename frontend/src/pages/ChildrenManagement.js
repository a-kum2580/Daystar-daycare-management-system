import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { useNavigate } from 'react-router-dom';

export function ChildrenManagement() {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedChild, setSelectedChild] = useState(null);

  // Sample data - in a real app, this would come from an API
  const [children, setChildren] = useState([
    {
      id: 1,
      name: 'John Doe',
      age: 3,
      parent: 'Jane Doe',
      status: 'active',
      allergies: 'None',
      specialNeeds: 'None',
      enrollmentDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      age: 4,
      parent: 'Michael Smith',
      status: 'active',
      allergies: 'Peanuts',
      specialNeeds: 'None',
      enrollmentDate: '2024-02-01'
    },
    {
      id: 3,
      name: 'Emma Johnson',
      age: 2,
      parent: 'David Johnson',
      status: 'inactive',
      allergies: 'None',
      specialNeeds: 'Speech therapy',
      enrollmentDate: '2023-12-10'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    parent: '',
    status: 'active',
    allergies: '',
    specialNeeds: '',
    enrollmentDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleAddChild = () => {
    navigate('/enroll-child');
  };

  const handleEdit = (child) => {
    setSelectedChild(child);
    // Format the date for the input field
    const formattedDate = child.enrollmentDate.split('T')[0];
    setFormData({
      name: child.name,
      age: child.age.toString(),
      parent: child.parent,
      status: child.status,
      allergies: child.allergies,
      specialNeeds: child.specialNeeds,
      enrollmentDate: formattedDate
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (child) => {
    setSelectedChild(child);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedChild) return;

    const updatedChild = {
      ...selectedChild,
      name: formData.name,
      age: parseInt(formData.age),
      parent: formData.parent,
      status: formData.status,
      allergies: formData.allergies,
      specialNeeds: formData.specialNeeds,
      enrollmentDate: formData.enrollmentDate
    };

    setChildren(children.map(child => 
      child.id === selectedChild.id ? updatedChild : child
    ));
    setIsEditDialogOpen(false);
    setSelectedChild(null);
    setFormData({
      name: '',
      age: '',
      parent: '',
      status: 'active',
      allergies: '',
      specialNeeds: '',
      enrollmentDate: ''
    });
  };

  const handleDeleteConfirm = () => {
    setChildren(children.filter(child => child.id !== selectedChild.id));
    setIsDeleteDialogOpen(false);
    setSelectedChild(null);
  };

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.parent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || child.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Children Management</h1>
        <Button onClick={handleAddChild}>Add Child</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name or parent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="waitlist">Waitlist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChildren.map((child) => (
                <tr key={child.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{child.name}</div>
                    <div className="text-sm text-gray-500">
                      {child.allergies && `Allergies: ${child.allergies}`}
                      {child.specialNeeds && ` | Special Needs: ${child.specialNeeds}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{child.age} years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{child.parent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      child.status === 'active' ? 'bg-green-100 text-green-800' :
                      child.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {child.status.charAt(0).toUpperCase() + child.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(child.enrollmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(child)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(child)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Child Information</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Child's Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent" className="text-sm font-medium">Parent/Guardian Name</Label>
                <Input
                  id="parent"
                  name="parent"
                  value={formData.parent}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="waitlist">Waitlist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentDate" className="text-sm font-medium">Enrollment Date</Label>
                <Input
                  id="enrollmentDate"
                  name="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-sm font-medium">Allergies</Label>
                <Input
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Enter any allergies (if none, leave blank)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialNeeds" className="text-sm font-medium">Special Needs</Label>
                <Input
                  id="specialNeeds"
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Enter any special needs (if none, leave blank)"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Child</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete {selectedChild?.name}? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChildrenManagement; 