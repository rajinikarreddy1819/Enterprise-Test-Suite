import { Link, useLocation } from "wouter";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { ShieldCheck, User, LogOut, Menu, X, Shield, FileText, Search, Activity } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useAuth();
  const logout = useLogout();
  const [_, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => setLocation("/")
    });
  };

  const navItems = user ? (
    user.userType === 'ADMIN' ? [
      { label: "Admin Dashboard", href: "/admin/dashboard", icon: <Shield className="w-4 h-4 mr-2" /> },
    ] : [
      { label: "Doctor Dashboard", href: "/doctor/dashboard", icon: <Activity className="w-4 h-4 mr-2" /> },
    ]
  ) : [
    { label: "Verify Doctor", href: "/", icon: <Search className="w-4 h-4 mr-2" /> },
    { label: "Apply for Verification", href: "/apply", icon: <FileText className="w-4 h-4 mr-2" /> },
    { label: "Track Application", href: "/track", icon: <Activity className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Official Government Top Bar */}
      <div className="bg-primary text-primary-foreground py-1.5 px-4 text-xs font-medium tracking-wide flex justify-between items-center">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>Official Verification Portal of the National Medical Council</span>
        </div>
      </div>

      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-none text-primary">NMC Verification</span>
                <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase mt-1">Public Registry</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="px-4 py-2 rounded-md text-sm font-medium text-foreground/80 hover:bg-slate-100 hover:text-primary transition-colors flex items-center"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              
              <div className="w-px h-6 bg-border mx-2" />
              
              {!isLoading && (
                user ? (
                  <div className="flex items-center pl-2 space-x-4">
                    <div className="flex items-center text-sm text-primary font-medium">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 border border-primary/20">
                        <User className="w-4 h-4" />
                      </div>
                      {user.fullName}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLogout}
                      disabled={logout.isPending}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {logout.isPending ? "Logging out..." : "Logout"}
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" className="pl-2">
                    <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                      <User className="w-4 h-4 mr-2" />
                      Provider Login
                    </Button>
                  </Link>
                )
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground hover:text-primary p-2 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white border-t border-border"
            >
              <div className="px-4 pt-2 pb-6 space-y-1 shadow-lg">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                
                <div className="my-4 border-t border-border pt-4">
                  {!isLoading && (
                    user ? (
                      <div className="space-y-4">
                        <div className="flex items-center px-3 text-sm text-primary font-medium">
                          <User className="w-5 h-5 mr-3 text-muted-foreground" />
                          {user.fullName} ({user.userType})
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-destructive"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Link 
                        href="/login" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full"
                      >
                        <Button className="w-full justify-center bg-primary">
                          <User className="w-4 h-4 mr-2" />
                          Provider Login
                        </Button>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow w-full flex flex-col relative z-0">
        <div className="absolute inset-0 seal-bg -z-10 opacity-40 pointer-events-none" />
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6 opacity-80">
              <Shield className="w-8 h-8 text-slate-500" />
              <span className="font-serif font-bold text-xl text-slate-300">NMC Registry</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              The official registry for verified medical practitioners. Protecting public health through strict credential verification and monitoring.
            </p>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 uppercase tracking-wider text-sm">Public Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Verify a Doctor</Link></li>
              <li><Link href="/apply" className="hover:text-white transition-colors">Submit Application</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">Track Status</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 uppercase tracking-wider text-sm">Secure Access</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Provider Login</Link></li>
              <li><span className="cursor-not-allowed opacity-50">Report an Issue</span></li>
              <li><span className="cursor-not-allowed opacity-50">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} National Medical Council. All rights reserved.</p>
          <p className="mt-2 md:mt-0 text-slate-500">Unrestricted access strictly prohibited.</p>
        </div>
      </footer>
    </div>
  );
}
