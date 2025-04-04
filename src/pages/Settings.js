import React from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export function Settings() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Daycare Settings</CardTitle>
          <CardDescription>Configure system preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-500">Settings interface will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default Settings; 