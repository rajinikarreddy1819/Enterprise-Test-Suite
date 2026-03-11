import { Layout } from "@/components/layout";
import { useApplications, useUpdateApplicationStatus, useAdminDoctors, useUpdateDoctorStatus, useAdminScans } from "@/hooks/use-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeading, StatusBadge } from "@/components/ui-elements";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
  const { data: apps, isLoading: loadingApps } = useApplications();
  const { data: doctors, isLoading: loadingDocs } = useAdminDoctors();
  const { data: scans, isLoading: loadingScans } = useAdminScans();
  
  const updateApp = useUpdateApplicationStatus();
  const updateDoc = useUpdateDoctorStatus();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10 min-h-[80vh]">
        <SectionHeading 
          title="Central Administration" 
          subtitle="Manage applications, verified practitioners, and system audits."
        />

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="mb-8 p-1 bg-slate-100/80 border border-slate-200 rounded-xl">
            <TabsTrigger value="applications" className="rounded-lg px-6 py-2.5 text-sm font-semibold">Pending Applications</TabsTrigger>
            <TabsTrigger value="doctors" className="rounded-lg px-6 py-2.5 text-sm font-semibold">Practitioner Registry</TabsTrigger>
            <TabsTrigger value="scans" className="rounded-lg px-6 py-2.5 text-sm font-semibold">Security Audit Logs</TabsTrigger>
          </TabsList>

          {/* APPLICATIONS TAB */}
          <TabsContent value="applications">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-border text-slate-500 uppercase font-semibold text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Applicant</th>
                      <th className="px-6 py-4">Specialization</th>
                      <th className="px-6 py-4">License No.</th>
                      <th className="px-6 py-4">Submitted</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loadingApps ? (
                      <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Loading applications...</td></tr>
                    ) : apps?.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No pending applications found.</td></tr>
                    ) : apps?.map((app: any) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">Dr. {app.doctorName}</td>
                        <td className="px-6 py-4 text-slate-600">{app.specialization}</td>
                        <td className="px-6 py-4 font-mono text-xs">{app.licenseNumber}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {app.submittedDate ? format(new Date(app.submittedDate), "MMM dd, yyyy") : "N/A"}
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <ApproveRejectDialog 
                            app={app} 
                            onUpdate={(status, notes) => updateApp.mutate({ id: app.id, status, reviewNotes: notes })}
                            isPending={updateApp.isPending}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* DOCTORS TAB */}
          <TabsContent value="doctors">
             <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-border text-slate-500 uppercase font-semibold text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Doctor Name</th>
                      <th className="px-6 py-4">License No.</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Expiry Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loadingDocs ? (
                      <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Loading registry...</td></tr>
                    ) : doctors?.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No verified doctors in registry.</td></tr>
                    ) : doctors?.map((doc: any) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">Dr. {doc.fullName}</td>
                        <td className="px-6 py-4 font-mono text-xs">{doc.licenseNumber}</td>
                        <td className="px-6 py-4 text-slate-600 text-xs">{doc.contactEmail}<br/>{doc.contactPhone}</td>
                        <td className="px-6 py-4 text-slate-500">
                           {doc.licenseExpiryDate ? format(new Date(doc.licenseExpiryDate), "MMM dd, yyyy") : "N/A"}
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={doc.verificationStatus} /></td>
                        <td className="px-6 py-4 text-right">
                          {doc.verificationStatus === 'VERIFIED' ? (
                            <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                              onClick={() => updateDoc.mutate({ id: doc.id, verificationStatus: "REVOKED" })}
                              disabled={updateDoc.isPending}
                            >Revoke</Button>
                          ) : (
                            <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-500 hover:bg-emerald-600 hover:text-white"
                              onClick={() => updateDoc.mutate({ id: doc.id, verificationStatus: "VERIFIED" })}
                              disabled={updateDoc.isPending}
                            >Re-Verify</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* SCANS TAB */}
          <TabsContent value="scans">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-border text-slate-500 uppercase font-semibold text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">License Scanned</th>
                      <th className="px-6 py-4">IP Address / Device</th>
                      <th className="px-6 py-4">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loadingScans ? (
                      <tr><td colSpan={4} className="text-center py-10 text-muted-foreground">Loading audit logs...</td></tr>
                    ) : scans?.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-10 text-muted-foreground">No QR scans recorded yet.</td></tr>
                    ) : scans?.map((scan: any) => (
                      <tr key={scan.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {scan.scanTime ? format(new Date(scan.scanTime), "yyyy-MM-dd HH:mm:ss") : "N/A"}
                        </td>
                        <td className="px-6 py-4 font-mono font-medium">{scan.licenseNumber}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate" title={scan.deviceType}>
                          {scan.scannedByIp} <br/> {scan.deviceType}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{scan.scannerLocation || "Unknown"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </Layout>
  );
}

function ApproveRejectDialog({ app, onUpdate, isPending }: { app: any, onUpdate: (s: string, n: string) => void, isPending: boolean }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const handleAction = (status: string) => {
    onUpdate(status, notes);
    setOpen(false);
  };

  if (app.status === 'APPROVED' || app.status === 'REJECTED') {
    return <Button variant="outline" size="sm" disabled>Processed</Button>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary">Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Application: Dr. {app.doctorName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-slate-50 p-4 rounded text-sm space-y-2 font-mono">
            <p><strong>License:</strong> {app.licenseNumber}</p>
            <p><strong>Specialty:</strong> {app.specialization}</p>
            <p><strong>Hospital:</strong> {app.hospitalName}</p>
            <p><strong>Qualifications:</strong> {app.qualifications}</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Review Notes (Required for Rejection)</label>
            <Textarea 
              placeholder="Enter official notes regarding this decision..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none h-24"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" className="text-destructive border-destructive" onClick={() => handleAction('REJECTED')} disabled={isPending}>
            Reject Application
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction('APPROVED')} disabled={isPending}>
            Approve & Verify
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
