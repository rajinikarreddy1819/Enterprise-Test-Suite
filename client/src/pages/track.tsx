import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { useTrackApplication } from "@/hooks/use-public";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Activity, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/ui-elements";
import { format } from "date-fns";

export default function Track() {
  const [trackId, setTrackId] = useState("");
  const [submittedId, setSubmittedId] = useState("");
  
  const { data: application, isLoading, error } = useTrackApplication(submittedId);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedId(trackId);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16 min-h-[70vh]">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-4">Track Application Status</h1>
          <p className="text-muted-foreground">Enter the unique Tracking ID provided upon submission.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleTrack} className="flex space-x-2">
            <Input 
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000" 
              className="py-6 text-lg font-mono text-center shadow-sm"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              required
            />
            <Button type="submit" size="lg" className="py-6 px-8 bg-primary">
              <Search className="w-5 h-5 mr-2" /> Track
            </Button>
          </form>
        </motion.div>

        {isLoading && submittedId && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-destructive/10 text-destructive p-6 rounded-xl text-center max-w-2xl mx-auto border border-destructive/20">
            <h3 className="font-bold text-lg mb-1">Application Not Found</h3>
            <p>Please verify the Tracking UUID and try again. It must match exactly.</p>
          </motion.div>
        )}

        {application && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-border bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Application For</p>
                <h2 className="text-2xl font-bold text-primary">Dr. {application.doctorName}</h2>
                <p className="text-slate-600 mt-1">Lic: {application.licenseNumber}</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Current Status</p>
                <StatusBadge status={application.status} className="text-base px-4 py-2" />
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-10 py-2">
                
                {/* Step 1: Submission */}
                <div className="relative pl-8">
                  <div className="absolute left-[-21px] bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">Application Received</h3>
                  <p className="text-muted-foreground mt-1">
                    {application.submittedDate ? format(new Date(application.submittedDate), "PPP 'at' p") : "Timestamp unknown"}
                  </p>
                </div>

                {/* Step 2: Review (Active if status is UNDER_REVIEW or higher) */}
                <div className="relative pl-8">
                  <div className={`absolute left-[-21px] w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                    ['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(application.status) ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <h3 className={`font-bold text-lg ${['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(application.status) ? 'text-foreground' : 'text-slate-400'}`}>
                    Under Review
                  </h3>
                  {application.assignedOfficer ? (
                    <p className="text-slate-600 mt-1">Assigned to Officer: {application.assignedOfficer}</p>
                  ) : (
                    <p className="text-slate-400 mt-1">Pending assignment to a verification officer.</p>
                  )}
                </div>

                {/* Step 3: Decision */}
                <div className="relative pl-8">
                  <div className={`absolute left-[-21px] w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                    application.status === 'APPROVED' ? 'bg-emerald-500 text-white' : 
                    application.status === 'REJECTED' ? 'bg-red-500 text-white' : 
                    'bg-slate-200 text-slate-400'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className={`font-bold text-lg ${
                    application.status === 'APPROVED' ? 'text-emerald-700' : 
                    application.status === 'REJECTED' ? 'text-red-700' : 
                    'text-slate-400'
                  }`}>
                    Final Decision
                  </h3>
                  
                  {application.verificationDate && (
                    <p className="text-slate-600 mt-1 mb-3 font-medium">
                      Resolved on: {format(new Date(application.verificationDate), "PPP")}
                    </p>
                  )}
                  
                  {application.reviewNotes && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-2 text-sm text-slate-700 italic">
                      " {application.reviewNotes} "
                    </div>
                  )}
                  
                  {application.status === 'PENDING' || application.status === 'SUBMITTED' || application.status === 'UNDER_REVIEW' ? (
                    <p className="text-slate-400 mt-1">Awaiting final council decision.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
