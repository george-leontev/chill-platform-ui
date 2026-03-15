"use client";

import { Input, Form } from "antd";
import type { FormProps } from "antd";
import { useRouter } from "next/navigation";
import { Mail, Lock, Moon, Loader2, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { SideArea } from "@/app/components/sign-in/side-area";

type FieldType = {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agree?: boolean;
};

export default function SignUpPage() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log("Registration attempt with:", values);
            router.push("/home");
        } catch (error) {
            form.setFields([
                {
                    name: "email",
                    errors: ["This email is already registered"],
                },
            ]);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex min-h-screen w-full bg-white'>
            <SideArea />

            <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
                <div className='w-full max-w-md'>
                    <div className='lg:hidden flex items-center gap-2 mb-8'>
                        <div className='p-2 bg-purple-600 rounded-xl'>
                            <Moon className='w-5 h-5 text-white' />
                        </div>
                        <span className='text-xl font-light'>
                            CHILL<span className='font-bold text-purple-600'>ZONE</span>
                        </span>
                    </div>

                    <div className='mb-8'>
                        <h2 className='text-3xl font-bold text-gray-900 mb-2'>Create account</h2>
                        <p className='text-gray-500'>
                            Already have an account?{" "}
                            <Link href='/signin' className='text-purple-600 hover:text-purple-700 font-medium'>
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <Form
                        form={form}
                        name='signup'
                        layout='vertical'
                        onFinish={onFinish}
                        autoComplete='off'
                        requiredMark={false}
                        className='w-full'
                    >
                        <Form.Item<FieldType>
                            name='name'
                            rules={[
                                { required: true, message: "Please enter your name" },
                                { min: 2, message: "Name must be at least 2 characters" },
                            ]}
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Full name</label>
                                <Input
                                    size='large'
                                    placeholder='Enter your full name'
                                    prefix={<User className='w-4 h-4 text-gray-400' />}
                                    className='rounded-lg h-12 hover:border-purple-400 focus:border-purple-600'
                                    disabled={isLoading}
                                />
                            </div>
                        </Form.Item>

                        <Form.Item<FieldType>
                            name='email'
                            rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Email address</label>
                                <Input
                                    size='large'
                                    placeholder='Enter your email'
                                    prefix={<Mail className='w-4 h-4 text-gray-400' />}
                                    className='rounded-lg h-12 hover:border-purple-400 focus:border-purple-600'
                                    disabled={isLoading}
                                />
                            </div>
                        </Form.Item>

                        <Form.Item<FieldType>
                            name='password'
                            rules={[
                                { required: true, message: "Please enter your password" },
                                { min: 6, message: "Password must be at least 6 characters" }
                            ]}
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                                <Input.Password
                                    size='large'
                                    placeholder='Create a password'
                                    prefix={<Lock className='w-4 h-4 text-gray-400' />}
                                    className='rounded-lg h-12 hover:border-purple-400 focus:border-purple-600'
                                    disabled={isLoading}
                                />
                            </div>
                        </Form.Item>

                        <Form.Item<FieldType>
                            name='confirmPassword'
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Please confirm your password" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Passwords do not match"));
                                    },
                                }),
                            ]}
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm password</label>
                                <Input.Password
                                    size='large'
                                    placeholder='Confirm your password'
                                    prefix={<Lock className='w-4 h-4 text-gray-400' />}
                                    className='rounded-lg h-12 hover:border-purple-400 focus:border-purple-600'
                                    disabled={isLoading}
                                />
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <button
                                type='submit'
                                disabled={isLoading}
                                className='
                                    w-full
                                    bg-purple-600
                                    hover:bg-purple-700
                                    text-white
                                    h-12
                                    rounded-lg
                                    font-medium
                                    transition-all
                                    duration-200
                                    transform
                                    hover:scale-[1.02]
                                    active:scale-[0.98]
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    disabled:hover:scale-100
                                    shadow-lg
                                    shadow-purple-200
                                    cursor-pointer
                                    mt-4
                                '
                            >
                                {isLoading ? (
                                    <div className='flex items-center justify-center gap-2'>
                                        <Loader2 className='w-5 h-5 animate-spin' />
                                        <span>Creating account...</span>
                                    </div>
                                ) : (
                                    "Create account"
                                )}
                            </button>
                        </Form.Item>
                    </Form>

                    <p className='text-center text-xs text-gray-400 mt-8'>
                        By creating an account, you agree to our{" "}
                        <a href='/terms' className='text-purple-600 hover:text-purple-700'>
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href='/privacy' className='text-purple-600 hover:text-purple-700'>
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
