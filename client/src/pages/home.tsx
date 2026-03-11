import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Search, Shield, Award, Users, ChevronRight, User, AlertTriangle, Pill, MapPin, Hospital, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchDoctors } from "@/hooks/use-public";
import { StatusBadge } from "@/components/ui-elements";
import { Link } from "wouter";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"search" | "premedication">("search");
  const [premedChecklist, setPremedChecklist] = useState({
    insuranceDoc: false,
    medicalHistory: false,
    medications: false,
    reports: false,
    bloodType: false,
    allergies: false,
  });
  
  const { data: doctors, isLoading, error } = useSearchDoctors(searchQuery.length >= 2 ? searchQuery : "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
    setShowAutocomplete(false);
  };

  const handleSelectDoctor = (license: string) => {
    setShowAutocomplete(false);
    // Navigate to doctor details
    window.location.href = `/doctor/${license}`;
  };

  const togglePremedItem = (key: keyof typeof premedChecklist) => {
    setPremedChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const nearbyHospitals = [
    { name: "Metro Central Hospital", distance: "2.3 km", beds: 500, rating: 4.8 },
    { name: "Heart Care Clinic", distance: "1.5 km", beds: 150, rating: 4.9 },
    { name: "Emergency Medical Center", distance: "3.1 km", beds: 300, rating: 4.6 },
  ];

  const medicalStores = [
    { name: "HealthCare Plus Pharmacy", distance: "0.8 km", hours: "24/7", rating: 4.7 },
    { name: "MedEasy Drugstore", distance: "1.2 km", hours: "7am - 10pm", rating: 4.5 },
    { name: "Life Medicine Centre", distance: "2.0 km", hours: "8am - 9pm", rating: 4.6 },
  ];

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

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            <button onClick={() => setSelectedTab("search")} className={`px-6 py-2 rounded-full font-semibold transition-all ${selectedTab === "search" ? "bg-accent text-primary-foreground" : "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"}`}>
              <Search className="w-4 h-4 inline mr-2" /> Find Doctor
            </button>
            <button onClick={() => setSelectedTab("premedication")} className={`px-6 py-2 rounded-full font-semibold transition-all ${selectedTab === "premedication" ? "bg-accent text-primary-foreground" : "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"}`}>
              <Pill className="w-4 h-4 inline mr-2" /> Pre-Visit Checklist
            </button>
          </div>

          {/* Search Box / Premedication */}
          {selectedTab === "search" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl"
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
                onChange={(e) => { setSearchQuery(e.target.value); setShowAutocomplete(true); }}
                onFocus={() => setShowAutocomplete(true)}
                data-testid="doctor-search-input"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="absolute right-2 top-2 bottom-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-semibold shadow-md"
                data-testid="search-submit"
              >
                Verify Now
              </Button>
            </form>
            
            {/* Autocomplete Dropdown */}
            {showAutocomplete && searchQuery.length >= 2 && doctors && doctors.length > 0 && (
              <div className="absolute left-2 right-2 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                <div className="p-2 text-xs text-slate-500 font-semibold px-4 py-2 border-b">Found {doctors.length} Doctor{doctors.length !== 1 ? 's' : ''}</div>
                {doctors.map((doc: any) => (
                  <button
                    key={doc.id}
                    onClick={() => handleSelectDoctor(doc.licenseNumber)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b last:border-0 transition-colors"
                    data-testid={`doctor-autocomplete-${doc.licenseNumber}`}
                  >
                    <div className="font-semibold text-foreground">Dr. {doc.fullName}</div>
                    <div className="text-sm text-muted-foreground">{doc.specialization} • {doc.licenseNumber}</div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
          ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <Pill className="w-6 h-6 mr-3 text-primary" /> Pre-Hospital Checklist
            </h3>
            
            <div className="space-y-4">
              {Object.entries(premedChecklist).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <Checkbox 
                    checked={value} 
                    onCheckedChange={() => togglePremedItem(key as keyof typeof premedChecklist)}
                    data-testid={`premedication-${key}`}
                  />
                  <span className={`text-lg font-medium ${value ? "text-primary line-through opacity-50" : "text-foreground"}`}>
                    {key === "insuranceDoc" && "Insurance Documents & ID"}
                    {key === "medicalHistory" && "Medical History Record"}
                    {key === "medications" && "List of Current Medications"}
                    {key === "reports" && "Recent Medical Reports"}
                    {key === "bloodType" && "Blood Type & Allergies Info"}
                    {key === "allergies" && "Emergency Contact Details"}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="font-semibold text-emerald-900 text-sm flex items-center">
                <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs mr-2">✓</span>
                Checklist {Object.values(premedChecklist).filter(Boolean).length}/{Object.keys(premedChecklist).length} Complete
              </div>
            </div>
          </motion.div>
          )}
        </div>
      </section>

      {/* Nearby Hospitals & Medical Stores */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Hospitals */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <Hospital className="w-6 h-6 mr-3 text-primary" /> Nearby Hospitals
            </h2>
            <div className="space-y-4">
              {nearbyHospitals.map((hosp, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-all cursor-pointer" data-testid={`hospital-${idx}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-foreground">{hosp.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-1 rounded">⭐ {hosp.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center"><MapPin className="w-3 h-3 mr-2" /> {hosp.distance}</p>
                  <p className="text-sm text-muted-foreground">{hosp.beds} beds available</p>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Stores */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <Package className="w-6 h-6 mr-3 text-primary" /> Medical Pharmacies
            </h2>
            <div className="space-y-4">
              {medicalStores.map((store, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-all cursor-pointer" data-testid={`pharmacy-${idx}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-foreground">{store.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-1 rounded">⭐ {store.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center"><MapPin className="w-3 h-3 mr-2" /> {store.distance}</p>
                  <p className="text-sm text-muted-foreground">Hours: {store.hours}</p>
                </div>
              ))}
            </div>
          </div>
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
