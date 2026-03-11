import { useEffect, useRef } from "react";
import { useParams } from "wouter";
import { Layout } from "@/components/layout";
import { useDoctorDetails, useLogScan } from "@/hooks/use-public";
import { StatusBadge } from "@/components/ui-elements";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Calendar, Shield, Award, Building, Activity, ShieldCheck, Download, AlertTriangle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";

export default function DoctorDetails() {
  const params = useParams<{ license: string }>();
  const license = params.license || "";
  
  const { data: doctor, isLoading, error } = useDoctorDetails(license);
  const logScan = useLogScan();
  const scanLogged = useRef(false);

  useEffect(() => {
    if (doctor && !scanLogged.current) {
      scanLogged.current = true;
      logScan.mutate({
        licenseNumber: license,
        deviceType: navigator.userAgent.substring(0, 50),
        scannerLocation: "Public Web Portal",
      });
    }
  }, [doctor, license, logScan]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-primary font-medium tracking-wide">Retrieving official records...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-20 px-4">
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 text-center shadow-lg">
            <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Record Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The license number <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-800">{license}</span> could not be found in the national registry.
            </p>
            <div className="bg-white p-4 rounded-xl text-sm text-left border border-border shadow-inner">
              <p className="font-semibold text-destructive mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Warning: Unverified Practitioner
              </p>
              <p className="text-slate-600">
                If someone is claiming to be a doctor using this license number, please be advised they are NOT verified by the National Medical Council. Report suspicious activity immediately.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const isVerified = doctor.verificationStatus === 'VERIFIED';
  const profileUrl = typeof window !== 'undefined' ? window.location.href : `https://nmc-registry.gov/doctor/${license}`;

  return (
    <Layout>
      {/* Top Banner indicating official status */}
      <div className={`py-3 px-4 text-center font-medium text-sm sm:text-base border-b ${isVerified ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          {isVerified ? (
            <><ShieldCheck className="w-5 h-5 mr-2" /> Official verified record from the National Medical Council database.</>
          ) : (
            <><AlertTriangle className="w-5 h-5 mr-2" /> WARNING: This practitioner's license is currently {doctor.verificationStatus}.</>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
            >
              {/* Header Profile Area */}
              <div className="p-8 border-b border-border bg-slate-50/50 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-12 h-12" />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <h1 className="text-3xl font-bold font-serif text-primary">
                      Dr. {doctor.fullName || doctor.user?.fullName || "Unregistered Name"}
                    </h1>
                    <StatusBadge status={doctor.verificationStatus} className="text-sm px-3 py-1.5 shadow-sm" />
                  </div>
                  <p className="text-lg text-slate-600 font-medium flex items-center">
                    <Award className="w-5 h-5 mr-2 text-accent" />
                    {doctor.specialization}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4">Professional Details</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Shield className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-500 font-medium">License Number</p>
                        <p className="font-mono font-medium text-foreground text-lg">{doctor.licenseNumber}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Award className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Qualifications</p>
                        <p className="font-medium text-foreground">{doctor.qualifications}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-500 font-medium">License Expiry</p>
                        <p className="font-medium text-foreground">
                          {doctor.licenseExpiryDate ? format(new Date(doctor.licenseExpiryDate), "MMMM dd, yyyy") : "N/A"}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4">Contact & Practice</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Building className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Primary Practice Location</p>
                        <p className="font-medium text-foreground">{doctor.clinicAddress}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Mail className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Official Contact Email</p>
                        <p className="font-medium text-foreground">{doctor.contactEmail}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Phone className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Contact Phone</p>
                        <p className="font-medium text-foreground">{doctor.contactPhone}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* QR Code Verification Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl shadow-lg border border-border p-8 text-center"
            >
              <h3 className="font-serif font-bold text-xl text-primary mb-2">Scan to Verify</h3>
              <p className="text-sm text-muted-foreground mb-6">Scan this official QR code with any device to view this live registry page.</p>
              
              <div className="bg-white p-4 rounded-xl border-2 border-dashed border-slate-200 inline-block mx-auto mb-6 relative">
                <QRCodeSVG 
                  value={profileUrl} 
                  size={200}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/favicon.png", // Or standard cross icon if available
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
                {!isVerified && (
                  <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center backdrop-blur-[1px] rounded-lg">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg transform -rotate-12">
                      INVALID RECORD
                    </span>
                  </div>
                )}
              </div>
              
              <Button variant="outline" className="w-full font-semibold border-primary/20 text-primary hover:bg-primary/5">
                <Download className="w-4 h-4 mr-2" /> Download Digital ID
              </Button>
            </motion.div>

            {/* Verification Timeline/Status */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-50 rounded-2xl border border-border p-6"
            >
              <h3 className="font-bold text-primary mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" /> Registry Activity
              </h3>
              <div className="space-y-4">
                <div className="relative pl-6 pb-4 border-l-2 border-emerald-200">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white"></div>
                  <p className="text-sm font-semibold text-foreground">Record Accessed</p>
                  <p className="text-xs text-muted-foreground mt-1">Just now • Web Portal</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white"></div>
                  <p className="text-sm font-semibold text-foreground">Status Last Updated</p>
                  <p className="text-xs text-muted-foreground mt-1">System automated timestamp</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
