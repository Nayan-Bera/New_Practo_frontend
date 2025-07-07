import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  Globe,
  GraduationCap,
  Lock,
  Monitor,
  Shield,
  Smartphone,
  Star,
  Tablet,
  Users,
  Video,
  Zap
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-slate-600" />,
      title: "Secure Exam Environment",
      description: "Advanced anti-cheating measures with AI-powered monitoring and secure browser lockdown."
    },
    {
      icon: <Video className="w-8 h-8 text-gray-600" />,
      title: "Live Video Proctoring",
      description: "Real-time video monitoring with face detection and suspicious activity alerts."
    },
    {
      icon: <Clock className="w-8 h-8 text-slate-600" />,
      title: "Flexible Scheduling",
      description: "Schedule exams at your convenience with automated reminders and time management."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-gray-600" />,
      title: "Instant Results",
      description: "Get detailed analytics and performance insights immediately after exam completion."
    },
    {
      icon: <Users className="w-8 h-8 text-slate-600" />,
      title: "Multi-User Support",
      description: "Support for both exam hosts and candidates with role-based access control."
    },
    {
      icon: <Globe className="w-8 h-8 text-gray-600" />,
      title: "Global Accessibility",
      description: "Access your exams from anywhere with our cloud-based platform."
    }
  ];

  const benefits = [
    "AI-powered anti-cheating detection",
    "Real-time video monitoring",
    "Instant result generation",
    "Secure browser environment",
    "Multi-device compatibility",
    "24/7 technical support"
  ];

  const stats = [
    { number: "10K+", label: "Exams Conducted" },
    { number: "50K+", label: "Students Served" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center">
            {/* Logo and Brand */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-8 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Secure Online
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Exam Platform</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Conduct secure, AI-powered online examinations with real-time monitoring and instant results. 
              Trusted by educators and institutions worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto h-16 px-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 rounded-xl"
              >
                <Zap className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={() => navigate("/signin")}
                variant="outline"
                className="w-full sm:w-auto h-16 px-10 border-2 border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold text-lg transition-all duration-300 rounded-xl"
              >
                Sign In
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Powerful Features for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Modern Education</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to conduct secure, reliable, and efficient online examinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl overflow-hidden hover:scale-105">
                <CardHeader className="pb-6 pt-8">
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 text-center">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <CardDescription className="text-slate-600 text-base leading-relaxed text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Simple steps to get started with secure online examinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Create Account</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Sign up as a host or candidate and set up your profile in minutes.</p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Schedule Exam</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Hosts can create and schedule exams with custom settings and time limits.</p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Take & Monitor</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Candidates take exams while AI monitors for security and integrity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Why Choose Our Platform?
            </h2>
              <p className="text-xl text-gray-600 mb-8">
                Experience the future of online examinations with cutting-edge technology and unparalleled security.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => navigate("/signup")}
                  className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  Start Your Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="w-6 h-6 text-yellow-300" />
                  <h3 className="text-2xl font-bold">Trusted by Educators</h3>
                </div>
                <p className="text-indigo-100 mb-6">
                  Join thousands of educational institutions that trust our platform for secure online examinations.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <span className="text-sm">ISO 27001 Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-300" />
                    <span className="text-sm">GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                      <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Works on All Devices
            </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Access your exams seamlessly across desktop, tablet, and mobile devices
          </p>

          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-md border border-gray-100">
              <Monitor className="w-6 h-6 text-indigo-600" />
              <span className="font-medium text-slate-700">Desktop</span>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-md border border-gray-100">
              <Tablet className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-slate-700">Tablet</span>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-md border border-gray-100">
              <Smartphone className="w-6 h-6 text-indigo-600" />
              <span className="font-medium text-slate-700">Mobile</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Exam Experience?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of educators and students who trust our platform for secure online examinations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/signup")}
              className="h-14 px-8 bg-white text-indigo-600 hover:bg-gray-100 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={() => navigate("/signin")}
              variant="outline"
              className="h-14 px-8 border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold text-lg transition-all duration-200"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing; 