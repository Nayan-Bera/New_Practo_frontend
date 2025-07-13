import { Button } from "@/components/ui/button";
import {
  Card
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignInMutation, type SignInResponse } from "@/redux/services/api/auth/signIn/signInApi";
import type { IUser } from "@/types";
import { addUser } from "@/utils/localStorage";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

// ---------------- Schema ----------------
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

// ---------------- Component ----------------
const SignIn = () => {
  const [signIn, { isLoading }] = useSignInMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInValues) => {
    try {
      const response: SignInResponse = await signIn(values).unwrap();

      if (
        !response.user._id ||
        !response.user.name ||
        !response.user.email ||
        !response.user.type
      ) {
        throw new Error("Invalid user data received");
      }

      const userData: IUser = {
        _id: response.user._id,
        name: response.user.name,
        email: response.user.email,
        type: response.user.type,
        upcomingExams: [],
        pastExams: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addUser({ token: response.token, user: userData });
      toast.success("Successfully signed in!");
      if (userData.type === "admin") {
        // handle admin logic here
      } else if (userData.type === "candidate") {
        navigate("/joinexam");
      } else {
        navigate("/"); // fallback
      }
    } catch (error) {
      toast.error("Failed to sign in. Please check your credentials.");
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
                  Welcome Back
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-indigo-100 mb-4 sm:mb-6 max-w-sm">
                  Sign in to access your secure account and continue with your exams.
                </p>
                <div className="flex items-center justify-center gap-2 text-indigo-100">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Secure • Fast • Reliable</span>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center order-1 lg:order-2">
              <div className="max-w-md mx-auto w-full">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                className="h-10 sm:h-11 pl-8 sm:pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 text-sm sm:text-base"
                                {...field}
                              />
                              <Mail className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
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
                            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="h-10 sm:h-11 pl-8 sm:pl-10 pr-8 sm:pr-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 text-sm sm:text-base"
                                {...field}
                              />
                              <Lock className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
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
                    
                    <Button 
                      type="submit" 
                      className="w-full h-10 sm:h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6 text-sm sm:text-base" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Signing in...
                        </>
                      ) : (
                        <>                      
                          Sign In
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
                      <span className="px-2 sm:px-4 bg-white text-gray-500">New to our platform?</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-2 sm:mt-3 w-full h-10 sm:h-11 border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 font-medium transition-all duration-200 text-sm sm:text-base"
                    onClick={() => navigate("/signup")}
                  >
                    Create your account
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

export default SignIn;
