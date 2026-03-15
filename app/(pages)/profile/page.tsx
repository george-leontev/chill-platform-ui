"use client";

import { Avatar, Button, Input } from "antd";
import { Mail, MapPin, Link as LinkIcon, Calendar, Edit3, Camera } from "lucide-react";
import { useState } from "react";

const { TextArea } = Input;

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState("Tech enthusiast | Coffee lover | Always learning something new");
    const [location, setLocation] = useState("San Francisco, CA");
    const [website, setWebsite] = useState("johndoe.com");

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-3xl'>
                <div className='flex flex-col items-center mb-8 w-full'>
                    <h1 className='text-2xl font-semibold text-gray-800'>Profile</h1>
                    <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                </div>

                {/* Cover & Avatar */}
                <div className='relative mb-16'>
                    <div className='h-48 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl' />
                    <div className='absolute -bottom-16 left-8 flex items-end gap-4'>
                        <Avatar
                            size={128}
                            src='https://i.pravatar.cc/150?img=12'
                            className='ring-4 ring-white'
                        />
                        <button className='mb-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition'>
                            <Camera size={18} className='text-gray-600' />
                        </button>
                    </div>
                </div>

                {/* Info Section */}
                <div className='ml-8 mb-6'>
                    <div className='flex items-start justify-between'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-800'>John Doe</h2>
                            <p className='text-gray-500'>@johndoe</p>
                        </div>
                        <Button
                            icon={<Edit3 size={16} />}
                            onClick={() => setIsEditing(!isEditing)}
                            className='bg-violet-600 text-white border-none hover:bg-violet-700'
                        >
                            {isEditing ? "Done" : "Edit Profile"}
                        </Button>
                    </div>

                    {isEditing ? (
                        <div className='mt-4 space-y-3'>
                            <TextArea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder='Write something about yourself...'
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                            <Input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder='Location'
                                prefix={<MapPin size={16} className='text-gray-400' />}
                            />
                            <Input
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder='Website'
                                prefix={<LinkIcon size={16} className='text-gray-400' />}
                            />
                        </div>
                    ) : (
                        <div className='mt-4'>
                            <p className='text-gray-700'>{bio}</p>
                            <div className='flex items-center gap-4 mt-3 text-sm text-gray-500'>
                                <span className='flex items-center gap-1'>
                                    <MapPin size={14} />
                                    {location}
                                </span>
                                <span className='flex items-center gap-1'>
                                    <LinkIcon size={14} />
                                    {website}
                                </span>
                                <span className='flex items-center gap-1'>
                                    <Calendar size={14} />
                                    Joined March 2024
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className='mx-8 grid grid-cols-3 gap-4 mb-6'>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>42</p>
                        <p className='text-sm text-gray-500'>Posts</p>
                    </div>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>1.2K</p>
                        <p className='text-sm text-gray-500'>Followers</p>
                    </div>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>385</p>
                        <p className='text-sm text-gray-500'>Following</p>
                    </div>
                </div>

                {/* Contact Info */}
                <div className='mx-8 bg-white border border-gray-100 rounded-2xl p-5'>
                    <h3 className='font-semibold text-gray-800 mb-4'>Contact Information</h3>
                    <div className='space-y-3'>
                        <div className='flex items-center gap-3 text-gray-600'>
                            <Mail size={18} className='text-gray-400' />
                            <span>john.doe@example.com</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
