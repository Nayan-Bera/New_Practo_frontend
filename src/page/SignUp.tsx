import { 
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSignUpMutation } from "@/redux/services/api/auth/signUp/signUpApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ArrowRight,
  Shield,
  Sparkles,
  GraduationCap,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [signUp, { isLoading }] = useSignUpMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    try {
      const { confirmPassword, ...signUpData } = values;
      // Automatically set role to candidate
      const finalSignUpData = { ...signUpData, type: "candidate" as const };
      await signUp(finalSignUpData).unwrap();
      toast.success("Account created successfully!");
      navigate("/signin");
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-2 sm:p-4">
      <div className="w-full max-w-6xl">
        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] sm:min-h-[600px]">
            {/* Left Side - Branding */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-white relative overflow-hidden order-2 lg:order-1">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl mb-4 sm:mb-6 backdrop-blur-sm">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                  Welcome to Our Platform
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-indigo-100 mb-4 sm:mb-6 max-w-sm">
                  Join thousands of candidates taking secure online exams with our advanced proctoring system.
                </p>
                <div className="flex items-center justify-center gap-2 text-indigo-100">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Secure • Reliable • Professional</span>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center order-1 lg:order-2">
              <div className="max-w-md mx-auto w-full">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                    {/* Role Display */}
                    <div className="flex items-center justify-center p-2 sm:p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 mb-4 sm:mb-6">
                      <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 mr-2" />
                      <span className="text-xs sm:text-sm font-medium text-indigo-700">Signing up as Candidate</span>
                      <CheckCircle className="w-3 h-3 text-green-500 ml-2" />
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Enter your full name" 
                                className="h-10 sm:h-11 pl-8 sm:pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 text-sm sm:text-base"
                                {...field} 
                              />
                              <User className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Enter your email" 
                                type="email" 
                                className="h-10 sm:h-11 pl-8 sm:pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 text-sm sm:text-base"
                                {...field} 
                              />
                              <Mail className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Create a strong password" 
                                type={showPassword ? "text" : "password"} 
                                className="h-10 sm:h-11 pl-8 sm:pl-10 pr-8 sm:pr-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 text-sm sm:text-base"
                                {...field} 
                              />
                              <Lock className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                                ) : (
                                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Confirm your password" 
                                type={showConfirmPassword ? "text" : "password"} 
                                className="h-10 sm:h-11 pl-8 sm:pl-10 pr-8 sm:pr-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 text-sm sm:text-base"
                                {...field} 
                              />
                              <Lock className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                                ) : (
                                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full h-10 sm:h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6 text-sm sm:text-base" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          Create Account
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-4 sm:mt-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="px-2 sm:px-4 bg-white text-gray-500">Already have an account?</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-2 sm:mt-3 w-full h-10 sm:h-11 border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 font-medium transition-all duration-200 text-sm sm:text-base"
                    onClick={() => navigate("/signin")}
                  >
                    Sign in to your account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp; 