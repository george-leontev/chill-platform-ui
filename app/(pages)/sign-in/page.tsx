"use client";

import { Input, Form, Checkbox } from "antd";
import type { FormProps } from "antd";
import { useRouter } from "next/navigation";
import { Mail, Lock, Moon, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { SideArea } from "@/app/components/sign-in/side-area";
import { AuthProvider, useAuth } from "@/app/contexts/app-auth-context";
import { SignInModel } from "@/app/models/signin-model";
import { proclaim } from "@/app/utils/proclaim";

type FieldType = {
    email?: string;
    password?: string;
    remember?: boolean;
};

const SignInPageInternal = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsLoading(true);

        try {
            const signInData: SignInModel = {
                email: values.email ?? null,
                password: values.password ?? null,
            };

            if (signInData) {
                debugger;
                await signIn(signInData);
            }

            proclaim({
                type: "success",
                title: "Вход выполнен успешно.",
            });

            router.push("/home");
        } catch (error) {
            const errorMessage = "Не удалось войти в систему.";
            proclaim({
                type: "error",
                title: errorMessage,
            });

            console.error(`Error occurred in process of sign-in: ${error}`);
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
                        <h2 className='text-3xl font-bold text-gray-900 mb-2'>Вход в систему</h2>
                        <p className='text-gray-500'>
                            Нет аккаунта?{" "}
                            <Link href='/signup' className='text-purple-600 hover:text-purple-700 font-medium'>
                                Зарегистрироваться
                            </Link>
                        </p>
                    </div>

                    <Form
                        form={form}
                        name='signin'
                        layout='vertical'
                        onFinish={onFinish}
                        autoComplete='off'
                        requiredMark={false}
                        className='w-full'
                    >
                        <Form.Item<FieldType>
                            name='email'
                            rules={[
                                { required: true, message: "Пожалуйста, введите email" },
                                { type: "email", message: "Пожалуйста, введите корректный email" },
                            ]}
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                                <Input
                                    size='large'
                                    placeholder='Введите ваш email'
                                    prefix={<Mail className='w-4 h-4 text-gray-400' />}
                                    className='rounded-lg h-12 hover:border-purple-400 focus:border-purple-600'
                                    disabled={isLoading}
                                />
                            </div>
                        </Form.Item>

                        <Form.Item<FieldType>
                            name='password'
                            rules={[{ required: true, message: "Пожалуйста, введите пароль" }]}
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Пароль</label>
                                <Input.Password
                                    size='large'
                                    placeholder='Введите ваш пароль'
                                    prefix={<Lock className='w-4 h-4 text-gray-400' />}
                                    className='rounded-lg h-12 hover:border-purple-400 focus:border-purple-600'
                                    disabled={isLoading}
                                />
                            </div>
                        </Form.Item>

                        <div className='flex items-center justify-between mb-6'>
                            <Form.Item<FieldType> name='remember' valuePropName='checked' noStyle>
                                <Checkbox className='text-gray-600'>
                                    <span className='text-sm'>Запомнить меня</span>
                                </Checkbox>
                            </Form.Item>
                            <a href='/forgot-password' className='text-sm text-purple-600 hover:text-purple-700'>
                                Забыли пароль?
                            </a>
                        </div>

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
                                '
                            >
                                {isLoading ? (
                                    <div className='flex items-center justify-center gap-2'>
                                        <Loader2 className='w-5 h-5 animate-spin' />
                                        <span>Вход...</span>
                                    </div>
                                ) : (
                                    "Войти"
                                )}
                            </button>
                        </Form.Item>
                    </Form>

                    <p className='text-center text-xs text-gray-400 mt-8'>
                        Продолжая, вы соглашаетесь с нашими{" "}
                        <a href='/terms' className='text-purple-600 hover:text-purple-700'>
                            Условиями использования
                        </a>{" "}
                        и{" "}
                        <a href='/privacy' className='text-purple-600 hover:text-purple-700'>
                            Политикой конфиденциальности
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function SignInPage() {
    return (
        <AuthProvider>
            <SignInPageInternal />
        </AuthProvider>
    );
}
