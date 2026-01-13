"use client";

import {
  ArrowRight,
  Building2,
  CheckCircle,
  CreditCard,
  Shield,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { HeroBackground } from "./AnimatedSVG";
import { FeatureCard, GlassCard, GlowingCard, StatCard } from "./GlassCard";

interface HeroSectionProps {
  onOpenSignUp?: () => void;
  onOpenSignIn?: () => void;
}

export function HeroSection({ onOpenSignUp, onOpenSignIn }: HeroSectionProps) {
  const [email, setEmail] = useState("");

  const features = [
    {
      icon: <Wallet size={24} />,
      title: "Virtual NGN Account",
      description:
        "Get your own dedicated Naira account number. Share it and receive transfers from any Nigerian bank instantly.",
    },
    {
      icon: <Building2 size={24} />,
      title: "Instant Bank Transfers",
      description:
        "Powered by Monnify. Transfer from any Nigerian bank and your wallet is credited automatically.",
    },
    {
      icon: <Shield size={24} />,
      title: "Secure & Protected",
      description:
        "Bank-grade security with Monnify integration. Your money is always safe and protected.",
    },
  ];

  const stats = [
    {
      value: "Instant",
      label: "Account Created",
      change: "In seconds",
      positive: true,
    },
    {
      value: "Zero",
      label: "Setup Fees",
      change: "Free to start",
      positive: true,
    },
    {
      value: "24/7",
      label: "Account Access",
      change: "Anytime, anywhere",
      positive: true,
    },
  ];

  const benefits = [
    { text: "No minimum balance required" },
    { text: "Instant notification on payment" },
    { text: "View all transactions history" },
    { text: "Secure Monnify integration" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0A0A0A]">
      {/* Background Animations */}
      <HeroBackground />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4459FF] to-[#7C3AED] flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Analyti</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={onOpenSignIn}
            className="px-5 py-2 text-gray-300 hover:text-white transition-colors font-medium"
          >
            Sign In
          </button>
          <button
            onClick={onOpenSignUp}
            className="px-5 py-2 bg-[#4459FF] hover:bg-[#3448EE] text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#4459FF]/25"
          >
            Join Us
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 lg:px-12 pt-16 pb-32">
        {/* Badge */}
        <div className="animate-fadeInUp mb-8">
          <GlassCard padding="sm" hover={false}>
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
              </span>
              <span className="text-sm text-gray-300">Powered by Monnify</span>
            </div>
          </GlassCard>
        </div>

        {/* Main Heading */}
        <h1 className="animate-fadeInUp stagger-1 text-center max-w-4xl mx-auto">
          <span className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Your NGN Wallet
            <br />
            <span className="bg-gradient-to-r from-[#4459FF] via-[#7C3AED] to-[#4459FF] bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
              Reimagined
            </span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="animate-fadeInUp stagger-2 text-center max-w-2xl mx-auto mt-6 text-gray-400 text-lg md:text-xl leading-relaxed">
          Get a dedicated virtual bank account. Receive payments instantly.
          Manage your Naira with confidence — all in one modern app.
        </p>

        {/* CTA Section */}
        <div className="animate-fadeInUp stagger-3 flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-lg">
          <button
            onClick={onOpenSignUp}
            className="group relative px-8 py-4 bg-[#4459FF] hover:bg-[#3448EE] text-white rounded-xl text-lg font-semibold flex-1 transition-all duration-300 hover:shadow-lg hover:shadow-[#4459FF]/25 hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </button>
          <button
            onClick={onOpenSignIn}
            className="px-8 py-4 bg-[#23262F] hover:bg-[#2D3139] text-white rounded-xl text-lg font-semibold flex-1 transition-all duration-300 hover:-translate-y-0.5"
          >
            Sign In
          </button>
        </div>

        {/* Trust indicators */}
        <div className="animate-fadeInUp stagger-4 mt-8">
          <GlassCard padding="sm" className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm text-gray-400">No crypto</span>
            </div>
            <div className="w-px h-4 bg-[#858B9A33]" />
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm text-gray-400">100% NGN</span>
            </div>
            <div className="w-px h-4 bg-[#858B9A33]" />
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm text-gray-400">Monnify Secured</span>
            </div>
          </GlassCard>
        </div>

        {/* Stats */}
        <div className="animate-fadeInUp stagger-5 grid grid-cols-3 gap-4 mt-16 w-full max-w-3xl">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              change={stat.change}
              positive={stat.positive}
            />
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 bg-gradient-to-b from-transparent to-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Get your NGN wallet in three simple steps. No paperwork, no
              waiting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up with your email and basic details",
              },
              {
                step: "02",
                title: "Get Virtual Account",
                desc: "We create your dedicated NGN bank account",
              },
              {
                step: "03",
                title: "Start Receiving",
                desc: "Share your account number and receive payments",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="animate-fadeInUp relative"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <GlassCard padding="lg" className="h-full">
                  <span className="text-5xl font-bold text-[#4459FF]/20 mb-4 block">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.desc}</p>
                </GlassCard>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#4459FF]">
                    <ArrowRight size={24} className="opacity-50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need for your Naira
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Modern fintech tools designed for Nigerians. Simple, fast, and
              secure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 bg-gradient-to-b from-[#0A0A0A] to-[#0D0D0D]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why choose Analyti?
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                We&apos;ve built a wallet that puts Nigerians first. No
                cryptocurrency, no DeFi complexity — just a simple, reliable way
                to manage your Naira.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                      <CheckCircle size={14} className="text-green-400" />
                    </div>
                    <span className="text-gray-300">{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <GlassCard padding="lg" glow>
                {/* Visual representation of a wallet card */}
                <div className="bg-gradient-to-br from-[#23262F] to-[#181A20] rounded-xl p-6 border border-[#858B9A33]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#4459FF]/20 flex items-center justify-center">
                        <Wallet size={20} className="text-[#4459FF]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Analyti Wallet</p>
                        <p className="text-xs text-gray-500">NGN Account</p>
                      </div>
                    </div>
                    <CreditCard size={24} className="text-gray-500" />
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-1">Account Number</p>
                    <p className="text-xl font-mono text-white tracking-wider">
                      809 876 5432
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Bank</p>
                      <p className="text-white font-medium">
                        {" "}
                        Guaranty Trust Bank
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-green-400 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <GlowingCard className="text-center py-16 px-8">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#4459FF]/20 flex items-center justify-center mx-auto mb-4">
                <Wallet size={32} className="text-[#4459FF]" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of Nigerians managing their money with Analyti.
              Create your free NGN wallet account today.
            </p>
            <button
              onClick={onOpenSignUp}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#4459FF] hover:bg-[#3448EE] text-white rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#4459FF]/25 hover:-translate-y-0.5"
            >
              Create Your Account
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
            <p className="mt-4 text-sm text-gray-500">
              No hidden fees. No minimum balance. Cancel anytime.
            </p>
          </GlowingCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-[#23262F]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4459FF] to-[#7C3AED] flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium">Analyti</span>
          </div>
          <p className="text-sm text-gray-500">
            Powered by Monnify. Licensed payment service provider.
          </p>
        </div>
      </footer>
    </section>
  );
}

export default HeroSection;
