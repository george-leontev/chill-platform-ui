"use client";

import { useState } from "react";
import { Input } from "antd";
import { Search, MessageCircle, Book, Mail, Phone, ChevronRight } from "lucide-react";

const faqs = [
    {
        id: 1,
        question: "How do I create a new post?",
        answer: "Click on the text area at the top of your feed, type your message, and click the 'Post' button.",
    },
    {
        id: 2,
        question: "How can I delete my post?",
        answer: "Go to your post, click the three dots menu, and select 'Delete'. This action cannot be undone.",
    },
    {
        id: 3,
        question: "How do I change my profile picture?",
        answer: "Go to your Profile page, click on the camera icon on your avatar, and upload a new image.",
    },
    {
        id: 4,
        question: "Can I edit my posts after publishing?",
        answer: "Yes, click the three dots menu on your post and select 'Edit'. You can edit posts within 24 hours of posting.",
    },
    {
        id: 5,
        question: "How do I report inappropriate content?",
        answer: "Click the three dots menu on any post and select 'Report'. Our team will review it within 24 hours.",
    },
];

const contactMethods = [
    {
        icon: MessageCircle,
        title: "Live Chat",
        description: "Chat with our support team",
        availability: "Available 24/7",
    },
    {
        icon: Mail,
        title: "Email Support",
        description: "support@chillplatform.com",
        availability: "Response within 24h",
    },
    {
        icon: Phone,
        title: "Phone Support",
        description: "+1 (555) 123-4567",
        availability: "Mon-Fri, 9AM-6PM",
    },
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const filteredFaqs = faqs.filter((faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-3xl'>
                <div className='flex flex-col items-center mb-8 w-full'>
                    <h1 className='text-2xl font-semibold text-gray-800'>Help & Support</h1>
                    <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                </div>

                {/* Search */}
                <div className='mb-8'>
                    <Input
                        prefix={<Search size={18} className='text-gray-400' />}
                        placeholder='Search for help...'
                        className='w-full'
                        size='large'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Contact Methods */}
                <div className='mb-8'>
                    <h2 className='text-lg font-semibold text-gray-800 mb-4'>Contact Us</h2>
                    <div className='grid gap-3'>
                        {contactMethods.map((method, index) => {
                            const Icon = method.icon;
                            return (
                                <div
                                    key={index}
                                    className='flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition'
                                >
                                    <div className='p-3 bg-violet-50 rounded-xl'>
                                        <Icon size={20} className='text-violet-600' />
                                    </div>
                                    <div className='flex-1'>
                                        <p className='font-medium text-gray-800'>{method.title}</p>
                                        <p className='text-sm text-gray-500'>{method.description}</p>
                                    </div>
                                    <span className='text-xs text-gray-400'>{method.availability}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* FAQs */}
                <div>
                    <h2 className='text-lg font-semibold text-gray-800 mb-4'>Frequently Asked Questions</h2>
                    <div className='space-y-2'>
                        {filteredFaqs.length === 0 ? (
                            <div className='text-center py-12'>
                                <Book size={48} className='mx-auto text-gray-300 mb-4' />
                                <p className='text-gray-500'>No results found</p>
                            </div>
                        ) : (
                            filteredFaqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className='bg-white border border-gray-100 rounded-2xl overflow-hidden'
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                        className='w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition'
                                    >
                                        <span className='font-medium text-gray-800'>{faq.question}</span>
                                        <ChevronRight
                                            size={20}
                                            className={`text-gray-400 transition-transform ${
                                                expandedFaq === faq.id ? "rotate-90" : ""
                                            }`}
                                        />
                                    </button>
                                    {expandedFaq === faq.id && (
                                        <div className='px-4 pb-4 text-gray-600 border-t border-gray-100 pt-3'>
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
