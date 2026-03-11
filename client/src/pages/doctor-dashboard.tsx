import { Layout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { usePrescriptions, useCreatePrescription } from "@/hooks/use-doctor";
import { SectionHeading } from "@/components/ui-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DoctorDashboard() {
  const { data: user } = useAuth();
  const { data: prescriptions, isLoading } = usePrescriptions();
  const createPrescription = useCreatePrescription();
  const { toast } = useToast();

  const [form, setForm] = useState({
    patientName: "",
    patientAge: "",
    symptoms: "",
    prescriptionText: "",
    validUntil: "",
    emergencyLevel: "LOW"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPrescription.mutate({
      ...form,
      patientAge: parseInt(form.patientAge),
      validUntil: new Date(form.validUntil).toISOString()
    }, {
      onSuccess: () => {
        toast({ title: "Prescription Recorded Successfully" });
        setForm({ patientName: "", patientAge: "", symptoms: "", prescriptionText: "", validUntil: "", emergencyLevel: "LOW" });
      },
      onError: (err) => {
        toast({ title: "Failed to record", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10 min-h-[80vh] grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 seal-bg opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-serif font-bold mb-1">Dr. {user?.fullName}</h2>
              <p className="text-primary-foreground/80 text-sm mb-6">Verified Practitioner Portal</p>
              
              <div className="space-y-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="flex justify-between items-center text-sm">
                  <span>Status</span>
                  <span className="flex items-center text-emerald-300 font-bold tracking-wider">
                    <CheckCircle className="w-4 h-4 mr-1" /> ACTIVE
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>ID Ref</span>
                  <span className="font-mono">{user?.id.toString().padStart(6, '0')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
             <h3 className="font-bold text-lg mb-4 flex items-center">
               <AlertCircle className="w-5 h-5 mr-2 text-primary" /> Issue E-Prescription
             </h3>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <Label className="text-xs">Patient Name</Label>
                 <Input required value={form.patientName} onChange={e=>setForm({...form, patientName: e.target.value})} className="mt-1 bg-slate-50"/>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label className="text-xs">Age</Label>
                   <Input required type="number" value={form.patientAge} onChange={e=>setForm({...form, patientAge: e.target.value})} className="mt-1 bg-slate-50"/>
                 </div>
                 <div>
                   <Label className="text-xs">Emergency Level</Label>
                   <Select value={form.emergencyLevel} onValueChange={(v)=>setForm({...form, emergencyLevel: v})}>
                     <SelectTrigger className="mt-1 bg-slate-50"><SelectValue /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="LOW">Low</SelectItem>
                       <SelectItem value="MEDIUM">Medium</SelectItem>
                       <SelectItem value="HIGH">High</SelectItem>
                       <SelectItem value="CRITICAL">Critical</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               <div>
                 <Label className="text-xs">Symptoms / Diagnosis</Label>
                 <Input required value={form.symptoms} onChange={e=>setForm({...form, symptoms: e.target.value})} className="mt-1 bg-slate-50"/>
               </div>
               <div>
                 <Label className="text-xs">Rx (Medication & Dosage)</Label>
                 <Textarea required value={form.prescriptionText} onChange={e=>setForm({...form, prescriptionText: e.target.value})} className="mt-1 bg-slate-50 h-24"/>
               </div>
               <div>
                 <Label className="text-xs">Valid Until</Label>
                 <Input required type="date" value={form.validUntil} onChange={e=>setForm({...form, validUntil: e.target.value})} className="mt-1 bg-slate-50"/>
               </div>
               <Button type="submit" className="w-full bg-primary" disabled={createPrescription.isPending}>
                 {createPrescription.isPending ? "Recording..." : "Record Official Prescription"}
               </Button>
             </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SectionHeading title="Prescription History" subtitle="Immutable ledger of issued emergency prescriptions." />
          
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-muted-foreground p-8 text-center border rounded-xl border-dashed">Loading records...</p>
            ) : prescriptions?.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-muted-foreground">No prescriptions issued yet.</p>
              </div>
            ) : prescriptions?.map((rx: any) => (
              <div key={rx.id} className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4 border-b pb-4">
                  <div>
                    <h4 className="font-bold text-lg text-primary">{rx.patientName}, {rx.patientAge}y</h4>
                    <p className="text-sm text-slate-500 font-medium">Issued: {rx.issuedAt ? format(new Date(rx.issuedAt), "PPP") : "N/A"}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded uppercase tracking-wider border ${
                    rx.emergencyLevel === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-200' :
                    rx.emergencyLevel === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                    rx.emergencyLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    {rx.emergencyLevel} Priority
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Diagnosis</p>
                    <p className="text-sm font-medium">{rx.symptoms}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Prescription</p>
                    <p className="text-sm font-mono bg-slate-50 p-2 rounded border border-slate-100">{rx.prescriptionText}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-slate-500">
                  <span>Valid until: {rx.validUntil ? format(new Date(rx.validUntil), "PPP") : "N/A"}</span>
                  <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded">Ref ID: {rx.id.toString().padStart(8, '0')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
