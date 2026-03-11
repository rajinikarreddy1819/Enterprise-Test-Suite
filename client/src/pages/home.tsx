import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Search, Shield, Award, Users, ChevronRight, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchDoctors } from "@/hooks/use-public";
import { StatusBadge } from "@/components/ui-elements";
import { Link } from "wouter";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  
  const { data: doctors, isLoading, error } = useSearchDoctors(submittedQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://pixabay.com/get/g9343fe93e7457c4b4078fe64ff45c86db980e5a149cd217f51b05a04b8ab4545fb2472460102acc596c159b1e91458978053f0c754954711ca6ffabecd398db6_1280.png')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Shield className="w-16 h-16 text-accent mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-serif mb-6 leading-tight text-balance">
              National Medical <span className="text-accent">Verification Registry</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto font-light">
              Securely verify the credentials, licensing, and active status of medical practitioners nationwide.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2"
          >
            <form onSubmit={handleSearch} className="w-full flex relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input 
                type="text"
                placeholder="Enter Doctor Name or License Number..."
                className="w-full pl-12 py-6 text-lg border-0 focus-visible:ring-0 text-foreground bg-transparent placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="lg" 
                className="absolute right-2 top-2 bottom-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-semibold shadow-md"
              >
                Verify Now
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[400px]">
        {isLoading && submittedQuery ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-medium animate-pulse">Searching national database...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-xl text-center shadow-sm">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
            <p className="font-semibold text-lg">Error accessing registry.</p>
            <p className="text-sm mt-1 opacity-80">Please try again later or contact support.</p>
          </div>
        ) : doctors && doctors.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-serif font-bold text-foreground">
                Found {doctors.length} Result{doctors.length !== 1 ? 's' : ''}
              </h3>
              <span className="text-sm text-muted-foreground bg-slate-100 px-3 py-1 rounded-full font-medium">Official Records</span>
            </div>
            
            <div className="grid gap-4">
              {doctors.map((doc: any, index: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={doc.id}
                >
                  <Link 
                    href={`/doctor/${doc.licenseNumber}`}
                    className="block group bg-card hover:bg-slate-50 border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            Dr. {doc.fullName || 'Registered Practitioner'}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span className="font-medium text-slate-700">{doc.specialization}</span>
                            <span>•</span>
                            <span>Lic: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{doc.licenseNumber}</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                        <StatusBadge status={doc.verificationStatus} />
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : submittedQuery ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No records found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any medical practitioner matching "{submittedQuery}". Please verify the spelling or license number and try again.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 opacity-80">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-foreground">Authoritative Data</h4>
              <p className="text-sm text-muted-foreground text-balance">Directly linked to the national registry for real-time verification.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-foreground">Anti-Fraud Protection</h4>
              <p className="text-sm text-muted-foreground text-balance">Digital QR signatures prevent forging of credentials and documents.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-foreground">Public Safety First</h4>
              <p className="text-sm text-muted-foreground text-balance">Empowering patients to make informed decisions about their healthcare providers.</p>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
