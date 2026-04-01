"use client";

import { Avatar, Button, Input } from "antd";
import { Mail, MapPin, Calendar, Edit3, Upload as UploadIcon, User } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useProfile } from "@/app/contexts/profile-context";
import { useAuth } from "@/app/contexts/app-auth-context";
import { ProfileModel } from "@/app/models/profile-model";
import type { UploadFile } from "antd/es/upload/interface";
import { formatBirthDate, parseDateForInput } from "@/app/utils/time-format";
import { PostsModel } from "@/app/models/posts-model";
import { usePosts } from "@/app/contexts/posts-data-context";

const { TextArea } = Input;

// Helper function to calculate age from birth date
const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

export default function ProfilePage() {
    const { profile, isLoading, createProfileAsync, updateProfileAsync } = useProfile();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { getMyPostsAsync } = usePosts();
    const [myPosts, setMyPosts] = useState<PostsModel[]>([]);
    // formData is only used when editing; otherwise use profile data directly for display
    const [formData, setFormData] = useState({
        bio: "",
        location: "",
        phone: "",
        avatarUrl: "",
        birthDate: "",
        gender: "",
        username: "",
        firstName: "",
        lastName: "",
        age: 0,
    });

    useEffect(() => {
        const fetchMyPosts = async () => {
            const posts = await getMyPostsAsync();
            if (posts) {
                setMyPosts(posts);
            }
        };
        fetchMyPosts();
    }, [getMyPostsAsync]);

    const totalLikes = useMemo(() => {
        return myPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
    }, [myPosts]);

    const initializeFormData = () => {
        if (profile) {
            setFormData({
                bio: profile.bio || "",
                location: profile.location || "",
                phone: profile.phone || "",
                avatarUrl: profile.avatarUrl || "",
                birthDate: parseDateForInput(profile.birthDate),
                gender: profile.gender || "",
                username: profile.user?.username || "",
                firstName: profile.user?.firstName || "",
                lastName: profile.user?.lastName || "",
                age: profile.age || 0,
            });
        }
    };

    const handleEditClick = () => {
        initializeFormData();
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const finalData: Partial<ProfileModel> = {
                bio: formData.bio,
                location: formData.location,
                phone: formData.phone,
                avatarUrl: formData.avatarUrl,
                gender: formData.gender,
                age: formData.age,
                user: {
                    id: profile?.user?.id || 0,
                    username: formData.username,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    age: formData.age,
                    email: profile?.user?.email || "",
                },
            };

            if (selectedFile && selectedFile.originFileObj) {
                const base64 = await convertFileToBase64(selectedFile.originFileObj);
                finalData.avatarUrl = base64;
            }

            if (formData.birthDate) {
                finalData.birthDate = new Date(formData.birthDate);
            }

            if (profile?.id) {
                await updateProfileAsync(finalData);
            } else {
                await createProfileAsync(finalData as Omit<ProfileModel, "id">);
            }
            setSelectedFile(null);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    const handleCancel = () => {
        initializeFormData();
        setSelectedFile(null);
        setIsEditing(false);
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    if (isLoading && !profile) {
        return (
            <div className='w-full flex justify-center'>
                <div className='w-full max-w-3xl'>
                    <div className='flex flex-col items-center mb-8 w-full'>
                        <h1 className='text-2xl font-semibold text-gray-800'>Profile</h1>
                        <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                    </div>
                    <div className='animate-pulse space-y-8'>
                        <div className='h-48 bg-gray-200 rounded-2xl' />
                        <div className='ml-8 space-y-4'>
                            <div className='h-8 bg-gray-200 rounded w-48' />
                            <div className='h-4 bg-gray-200 rounded w-32' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const displayName = profile?.user
        ? `${profile.user.firstName} ${profile.user.lastName}`
        : user?.email?.split("@")[0] || "User";
    const username = profile?.user?.username || user?.email || "user";
    const displayBirthDate = formatBirthDate(profile?.birthDate);
    // Use profile data directly for display, formData only when editing
    const displayAvatar =
        selectedFile && selectedFile.originFileObj
            ? URL.createObjectURL(selectedFile.originFileObj)
            : isEditing
              ? formData.avatarUrl
              : profile?.avatarUrl;

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-3xl'>
                <div className='flex flex-col items-center mb-8 w-full'>
                    <h1 className='text-2xl font-semibold text-gray-800'>Profile</h1>
                    <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                </div>

                {/* Cover & Avatar */}
                <div className='relative mb-16'>
                    <div className='h-48 bg-linear-to-r from-violet-500 to-purple-600 rounded-2xl' />
                    <div className='absolute -bottom-16 left-8 flex items-end gap-4'>
                        <Avatar size={128} src={displayAvatar} className='ring-4 ring-white' />
                        {isEditing && (
                            <div className='mb-2'>
                                <input
                                    ref={fileInputRef}
                                    type='file'
                                    accept='image/*'
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setSelectedFile({
                                                uid: Date.now().toString(),
                                                name: file.name,
                                                originFileObj: file,
                                            } as UploadFile);
                                        }
                                    }}
                                />
                                <Button
                                    icon={<UploadIcon size={16} />}
                                    onClick={() => fileInputRef.current?.click()}
                                    size='small'
                                >
                                    {selectedFile ? "Change" : "Upload"} Avatar
                                </Button>
                                {selectedFile && (
                                    <p className='text-xs text-gray-500 mt-1 max-w-32 truncate'>{selectedFile.name}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className='ml-8 mb-6'>
                    <div className='flex items-start justify-between'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-800'>{displayName}</h2>
                            <p className='text-gray-500'>@{username}</p>
                        </div>
                        {isEditing ? (
                            <div className='flex gap-2'>
                                <Button
                                    onClick={handleSave}
                                    className='bg-violet-600 text-white border-none hover:bg-violet-700'
                                >
                                    Save
                                </Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                            </div>
                        ) : (
                            <Button
                                icon={<Edit3 size={16} />}
                                onClick={handleEditClick}
                                className='bg-violet-600 text-white border-none hover:bg-violet-700'
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className='mt-4 space-y-3'>
                            <div className='flex gap-2'>
                                <Input
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder='First Name'
                                    addonBefore='First Name'
                                />
                                <Input
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder='Last Name'
                                    addonBefore='Last Name'
                                />
                            </div>
                            <Input
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder='Username'
                                addonBefore='Username'
                            />
                            <TextArea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder='Write something about yourself...'
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder='Location'
                                prefix={<MapPin size={16} className='text-gray-400' />}
                            />
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder='Phone'
                                prefix={<Mail size={16} className='text-gray-400' />}
                            />
                            <div className='flex gap-2'>
                                <Input
                                    type='date'
                                    value={formData.birthDate}
                                    onChange={(e) => {
                                        const newBirthDate = e.target.value;
                                        const newAge = calculateAge(newBirthDate);
                                        setFormData({ ...formData, birthDate: newBirthDate, age: newAge });
                                    }}
                                    placeholder='Birth Date'
                                    prefix={<Calendar size={16} className='text-gray-400' />}
                                />
                                <Input
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    placeholder='Gender'
                                />
                            </div>
                            <Input
                                value={formData.age}
                                disabled
                                placeholder='Age'
                                addonBefore='Age'
                                suffix={<User size={16} className='text-gray-400' />}
                            />
                        </div>
                    ) : (
                        <div className='mt-4'>
                            <p className='text-gray-700'>{profile?.bio || "No bio yet"}</p>
                            <div className='flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap'>
                                {profile?.location && (
                                    <span className='flex items-center gap-1'>
                                        <MapPin size={14} />
                                        {profile.location}
                                    </span>
                                )}
                                {profile?.phone && (
                                    <span className='flex items-center gap-1'>
                                        <Mail size={14} />
                                        {profile.phone}
                                    </span>
                                )}
                                <span className='flex items-center gap-1'>
                                    <Calendar size={14} />
                                    Birth date: {displayBirthDate}
                                </span>
                                {profile?.age && (
                                    <span className='flex items-center gap-1'>
                                        <User size={14} />
                                        {profile.age} years old
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className='grid grid-cols-2 gap-4 mb-6'>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>{myPosts.length}</p>
                        <p className='text-sm text-gray-500'>Total Posts</p>
                    </div>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>{totalLikes}</p>
                        <p className='text-sm text-gray-500'>Total Likes</p>
                    </div>
                </div>

                {/* Contact Info */}
                <div className=' bg-white border border-gray-100 rounded-2xl p-5'>
                    <h3 className='font-semibold text-gray-800 mb-4'>Contact Information</h3>
                    <div className='space-y-3'>
                        <div className='flex items-center gap-3 text-gray-600'>
                            <Mail size={18} className='text-gray-400' />
                            <span>{user?.email}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
