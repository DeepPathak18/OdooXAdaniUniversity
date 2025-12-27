import React, { useEffect, useState } from 'react';
import { Wrench, Settings, Shield, TrendingUp, Clock, Users, CheckCircle, BarChart3, AlertCircle, FileText, Zap, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GearGuardLanding = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse-slow">
              <Wrench className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              GearGuard
            </span>
          </div>
          
          <div className="flex gap-3">
            <button onClick={handleSignIn} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all duration-300 hover:scale-105">
              Sign In
            </button>
            <button onClick={handleGetStarted} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg font-medium shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`container mx-auto px-6 py-20 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-6 py-2 mb-8 animate-fade-in">
            <Shield className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 font-medium">Smart Equipment Maintenance</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Track, Maintain, <br />
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Optimize Your Assets
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            GearGuard is your comprehensive maintenance tracking solution. Monitor equipment health, schedule maintenance, and maximize uptime with intelligent analytics.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-3xl mx-auto">
            {[
              { number: '99.9%', label: 'Uptime', icon: TrendingUp },
              { number: '500+', label: 'Companies', icon: Users },
              { number: '50K+', label: 'Equipment', icon: Settings },
              { number: '24/7', label: 'Support', icon: Clock }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-orange-400 mb-1">{stat.number}</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleGetStarted} className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl font-semibold text-lg shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50">
              Sign Up Now
              <Zap className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`container mx-auto px-6 py-20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">GearGuard?</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Powerful features designed to streamline your maintenance operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Settings,
              title: 'Equipment Tracking',
              description: 'Comprehensive database of all your equipment with detailed specifications, locations, and usage history.',
              gradient: 'from-orange-500 to-orange-600'
            },
            {
              icon: Clock,
              title: 'Scheduled Maintenance',
              description: 'Automated maintenance scheduling with reminders and notifications to prevent downtime.',
              gradient: 'from-blue-500 to-blue-600'
            },
            {
              icon: BarChart3,
              title: 'Analytics Dashboard',
              description: 'Real-time insights and reports on equipment performance, costs, and maintenance trends.',
              gradient: 'from-purple-500 to-purple-600'
            },
            {
              icon: Users,
              title: 'Team Management',
              description: 'Assign technicians, track work orders, and manage your maintenance team efficiently.',
              gradient: 'from-green-500 to-green-600'
            },
            {
              icon: AlertCircle,
              title: 'Predictive Alerts',
              description: 'AI-powered predictions for potential equipment failures before they happen.',
              gradient: 'from-red-500 to-red-600'
            },
            {
              icon: FileText,
              title: 'Complete Documentation',
              description: 'Store manuals, warranties, service history, and compliance documents in one place.',
              gradient: 'from-cyan-500 to-cyan-600'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`container mx-auto px-6 py-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Started in <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">3 Easy Steps</span>
          </h2>
          <p className="text-xl text-slate-400">Simple setup process to get your team up and running</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              title: 'Add Equipment',
              description: 'Import or manually add your equipment inventory with all relevant details and documentation.',
              icon: Database
            },
            {
              step: '02',
              title: 'Schedule Maintenance',
              description: 'Set up maintenance schedules, assign technicians, and configure automated reminders.',
              icon: Calendar
            },
            {
              step: '03',
              title: 'Monitor & Optimize',
              description: 'Track maintenance activities, analyze performance data, and continuously improve operations.',
              icon: TrendingUp
            }
          ].map((step, index) => (
            <div key={index} className="relative">
              {index < 2 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
              )}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-300">
                <div className="text-6xl font-black text-orange-500/20 mb-4">{step.step}</div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={`container mx-auto px-6 py-20 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl shadow-orange-500/30">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Revolutionize Your Maintenance?
          </h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of companies already optimizing their equipment maintenance with GearGuard
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-orange-600 hover:bg-orange-50 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105">
              Start Free 30-Day Trial
            </button>
            <button className="px-8 py-4 bg-orange-700 hover:bg-orange-800 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105">
              Schedule Demo
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-orange-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">GearGuard</span>
            </div>
            <div className="text-slate-400 text-center md:text-left">
              © 2025 GearGuard. All rights reserved. | Smart Maintenance Tracking Solution
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-float { animation: float 8s infinite ease-in-out; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

// Calendar icon component (since it's not in lucide-react by that exact name)
const Calendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default GearGuardLanding;