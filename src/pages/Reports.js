import React from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export function Reports() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Reports & Analytics</CardTitle>
          <CardDescription>Generate and view daycare reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-500">Reporting interface will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default Reports; 