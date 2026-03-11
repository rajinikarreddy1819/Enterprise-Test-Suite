import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApply } from "@/hooks/use-public";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/ui-elements";
import { FileText, CheckCircle2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const applicationSchema = z.object({
  doctorName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number required"),
  specialization: z.string().min(2, "Specialization is required"),
  qualifications: z.string().min(2, "Qualifications are required"),
  licenseNumber: z.string().min(4, "License number is required"),
  hospitalName: z.string().min(2, "Hospital name is required"),
  clinicAddress: z.string().min(5, "Complete address is required"),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function Apply() {
  const [successId, setSuccessId] = useState<string | null>(null);
  const applyMutation = useApply();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema)
  });

  const onSubmit = (data: ApplicationForm) => {
    applyMutation.mutate(data, {
      onSuccess: (res) => {
        setSuccessId(res.applicationId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (err) => {
        toast({
          title: "Submission Failed",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  const copyId = () => {
    if (successId) {
      navigator.clipboard.writeText(successId);
      toast({ title: "Copied to clipboard!", description: "Save this tracking ID safely." });
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          
          {successId ? (
            <div className="bg-card rounded-2xl shadow-xl border border-emerald-200 overflow-hidden text-center p-10">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-4">Application Submitted Successfully</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Your verification request has been securely logged with the National Medical Council.
              </p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 max-w-lg mx-auto">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Your Tracking ID</p>
                <div className="flex items-center justify-center space-x-3">
                  <code className="text-xl font-mono text-primary bg-white px-4 py-2 border rounded-md shadow-inner">
                    {successId}
                  </code>
                  <Button variant="outline" size="icon" onClick={copyId} title="Copy ID">
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-amber-600 mt-4 font-medium flex items-center justify-center">
                  Please save this ID. You will need it to track your application status.
                </p>
              </div>
              
              <Button asChild className="bg-primary px-8">
                <a href="/track">Track Application Now</a>
              </Button>
            </div>
          ) : (
            <div className="bg-card rounded-2xl shadow-xl border border-border p-8 sm:p-12">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-serif font-bold text-primary">Practitioner Verification Application</h1>
                  <p className="text-muted-foreground mt-1">Official form for joining the national registry.</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md mb-8 text-sm text-blue-800">
                All information submitted is subject to review under the Medical Council Act. Falsifying credentials is a punishable offense.
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="doctorName">Full Legal Name <span className="text-red-500">*</span></Label>
                    <Input id="doctorName" {...register("doctorName")} className="bg-slate-50" placeholder="Dr. Jane Doe" />
                    {errors.doctorName && <p className="text-xs text-destructive">{errors.doctorName.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">State Medical License Number <span className="text-red-500">*</span></Label>
                    <Input id="licenseNumber" {...register("licenseNumber")} className="bg-slate-50 font-mono" placeholder="e.g. MED-2023-8891" />
                    {errors.licenseNumber && <p className="text-xs text-destructive">{errors.licenseNumber.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Official Contact Email <span className="text-red-500">*</span></Label>
                    <Input id="email" type="email" {...register("email")} className="bg-slate-50" placeholder="doctor@hospital.com" />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone <span className="text-red-500">*</span></Label>
                    <Input id="phone" {...register("phone")} className="bg-slate-50" placeholder="+1 (555) 000-0000" />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Primary Specialization <span className="text-red-500">*</span></Label>
                    <Input id="specialization" {...register("specialization")} className="bg-slate-50" placeholder="Cardiology, General Practice..." />
                    {errors.specialization && <p className="text-xs text-destructive">{errors.specialization.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualifications">Highest Qualifications <span className="text-red-500">*</span></Label>
                    <Input id="qualifications" {...register("qualifications")} className="bg-slate-50" placeholder="MD, DO, MBBS..." />
                    {errors.qualifications && <p className="text-xs text-destructive">{errors.qualifications.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Primary Affiliated Hospital/Clinic <span className="text-red-500">*</span></Label>
                  <Input id="hospitalName" {...register("hospitalName")} className="bg-slate-50" placeholder="General City Hospital" />
                  {errors.hospitalName && <p className="text-xs text-destructive">{errors.hospitalName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicAddress">Complete Practice Address <span className="text-red-500">*</span></Label>
                  <Input id="clinicAddress" {...register("clinicAddress")} className="bg-slate-50" placeholder="123 Medical Way, Suite 100, City, State, ZIP" />
                  {errors.clinicAddress && <p className="text-xs text-destructive">{errors.clinicAddress.message}</p>}
                </div>

                <div className="pt-6 border-t border-border">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-primary"
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending ? "Submitting securely..." : "Submit Formal Application"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
