import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { childService } from "../services";
import { toast } from "sonner";

export function Children() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await childService.getAllChildren();
      setChildren(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching children:", err);
      setError("Failed to load children data");
      toast.error("Failed to load children data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Child Management</h1>
        <Button>Add New Child</Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Children Records</CardTitle>
          <CardDescription>View and manage children records</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Loading children data...</p>
            </div>
          ) : error ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : children.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed border-gray-300 bg-gray-50">
              <p className="text-gray-500">No children records found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Parent/Guardian</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {children.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell>{child.first_name} {child.last_name}</TableCell>
                    <TableCell>{child.age}</TableCell>
                    <TableCell>{child.parent_name}</TableCell>
                    <TableCell>{child.contact_number}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default Children; 