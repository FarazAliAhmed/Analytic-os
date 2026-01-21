"use client";

import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="border-b border-[#262626] bg-[#0A0A0A] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4459FF]/10 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#4459FF]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
                <p className="text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="prose prose-invert max-w-none">
          <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[#4459FF]" />
              <h2 className="text-xl font-semibold text-white m-0">Your Privacy Matters</h2>
            </div>
            <p className="text-gray-300 m-0">
              This Privacy Policy describes how we collect, use, and protect your personal information 
              when you use our financial technology platform. We are committed to maintaining the 
              highest standards of data protection and transparency.
            </p>
          </div>

          <div className="space-y-8">
            {/* Information We Collect */}
            <section className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#4459FF]" />
                Information We Collect
              </h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-white font-medium mb-2">Personal Information</h3>
                  <p>
                    We collect information you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Name, email address, and phone number</li>
                    <li>Government-issued identification documents</li>
                    <li>Financial information and bank account details</li>
                    <li>Transaction history and investment preferences</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Automatically Collected Information</h3>
                  <p>
                    When you use our platform, we automatically collect:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Device information and IP address</li>
                    <li>Browser type and operating system</li>
                    <li>Usage patterns and interaction data</li>
                    <li>Location information (with your consent)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-gray-300">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide, maintain, and improve our financial services</li>
                  <li>Process transactions and manage your account</li>
                  <li>Verify your identity and prevent fraud</li>
                  <li>Send you important notices and updates</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Provide customer support and respond to inquiries</li>
                </ul>
              </div>
            </section>

            {/* Information Sharing */}
            <section className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Information Sharing and Disclosure</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our platform</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> We may share information with your explicit consent for specific purposes</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#4459FF]" />
                Data Security
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>End-to-end encryption for sensitive data transmission</li>
                  <li>Secure data storage with regular backups</li>
                  <li>Multi-factor authentication for account access</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Employee training on data protection best practices</li>
                  <li>Compliance with financial industry security standards</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Your Privacy Rights</h2>
              <div className="space-y-4 text-gray-300">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                  <li><strong>Objection:</strong> Object to certain types of data processing</li>
                  <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                </ul>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Cookies and Tracking Technologies</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We use cookies and similar technologies to enhance your experience on our platform:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Security Cookies:</strong> Protect against fraud and unauthorized access</li>
                </ul>
                <p>
                  You can control cookie settings through your browser preferences, though disabling 
                  certain cookies may affect platform functionality.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> privacy@yourplatform.com</li>
                    <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                    <li><strong>Address:</strong> 123 Financial District, Suite 100, City, State 12345</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-400">
                  We will respond to your inquiry within 30 days of receipt.
                </p>
              </div>
            </section>

            {/* Updates */}
            <section className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Policy Updates</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our 
                  practices or legal requirements. When we make significant changes, we will:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Notify you via email or platform notification</li>
                  <li>Update the "Last updated" date at the top of this policy</li>
                  <li>Provide a summary of key changes</li>
                  <li>Give you time to review before changes take effect</li>
                </ul>
                <p>
                  Your continued use of our platform after policy updates constitutes acceptance 
                  of the revised terms.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}