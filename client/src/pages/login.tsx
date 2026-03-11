import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { useLogin } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password }, {
      onSuccess: (user) => {
        toast({ title: "Login Successful", description: `Welcome back, ${user.fullName}` });
        if (user.userType === 'ADMIN') {
          setLocation("/admin/dashboard");
        } else {
          setLocation("/doctor/dashboard");
        }
      },
      onError: (err) => {
        toast({ title: "Authentication Failed", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden"
        >
          <div className="bg-primary p-8 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 seal-bg opacity-20 pointer-events-none"></div>
            <Shield className="w-12 h-12 text-accent mx-auto mb-4 relative z-10" />
            <h2 className="text-2xl font-serif font-bold relative z-10">Secure Provider Portal</h2>
            <p className="text-primary-foreground/80 mt-2 text-sm relative z-10">Authorized personnel only</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username / Official Email</Label>
                <Input 
                  id="username"
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-50 py-6"
                  placeholder="admin@nmc.gov or doctor@clinic.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-xs text-primary cursor-pointer hover:underline">Forgot password?</span>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 py-6"
                  placeholder="••••••••"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 text-lg bg-primary mt-4"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Authenticating..." : (
                  <><Lock className="w-5 h-5 mr-2" /> Login to Portal</>
                )}
              </Button>
            </form>
          </div>
          
          <div className="bg-slate-50 p-4 text-xs text-center text-slate-500 border-t border-border">
            By logging in, you agree to the government acceptable use policy and consent to monitoring.
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
