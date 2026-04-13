"use client";

import { useState } from "react";
import { Input } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Book, Mail, Phone, ChevronDown } from "lucide-react";
import SupportChat from "./components/support-chat";

const faqs = [
    {
        id: 1,
        question: "How do I create a new post?",
        answer: "Click on the text area at the top of your feed, type your message, and click the 'Post' button. You can also attach up to 8 images to your post.",
    },
    {
        id: 2,
        question: "How can I delete my post?",
        answer: "Go to 'My Posts' page, hover over the post you want to delete, and click the trash icon. This action cannot be undone.",
    },
    {
        id: 3,
        question: "How do I change my profile picture?",
        answer: "Go to your Profile page, click 'Edit Profile', then click 'Upload Avatar' to choose a new image from your device.",
    },
    {
        id: 4,
        question: "Can I edit my posts after publishing?",
        answer: "Yes! Go to 'My Posts' page, hover over the post, click the pencil icon, edit your content, and click 'Save Changes'.",
    },
    {
        id: 5,
        question: "How do I send a direct message?",
        answer: "Navigate to the 'Chats' page from the sidebar. Select an existing conversation or start a new one. Messages are delivered in real-time.",
    },
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
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
                        {/* Email Support */}
                        <div className='flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition'>
                            <div className='p-3 bg-violet-50 rounded-xl'>
                                <Mail size={20} className='text-violet-600' />
                            </div>
                            <div className='flex-1'>
                                <p className='font-medium text-gray-800'>Email Support</p>
                                <p className='text-sm text-gray-500'>support@chillplatform.com</p>
                            </div>
                            <span className='text-xs text-gray-400'>Response within 24h</span>
                        </div>

                        {/* Phone Support */}
                        <div className='flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition'>
                            <div className='p-3 bg-violet-50 rounded-xl'>
                                <Phone size={20} className='text-violet-600' />
                            </div>
                            <div className='flex-1'>
                                <p className='font-medium text-gray-800'>Phone Support</p>
                                <p className='text-sm text-gray-500'>+1 (555) 123-4567</p>
                            </div>
                            <span className='text-xs text-gray-400'>Mon-Fri, 9AM-6PM</span>
                        </div>

                        {/* Live Chat — Component */}
                        <SupportChat />
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
                                <motion.div
                                    key={faq.id}
                                    className='bg-white border border-gray-100 rounded-2xl overflow-hidden'
                                    initial={false}
                                >
                                    <button
                                        onClick={() =>
                                            setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                                        }
                                        className='w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition'
                                    >
                                        <span className='font-medium text-gray-800 pr-4'>{faq.question}</span>
                                        <motion.div
                                            animate={{ rotate: expandedFaq === faq.id ? 90 : 0 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                        >
                                            <ChevronDown size={20} className='text-gray-400 shrink-0' />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {expandedFaq === faq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                            >
                                                <div className='px-4 pb-4 text-gray-600 border-t border-gray-100'>
                                                    <motion.p
                                                        initial={{ y: -8, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ duration: 0.2, delay: 0.05 }}
                                                        className='pt-3 leading-relaxed'
                                                    >
                                                        {faq.answer}
                                                    </motion.p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
