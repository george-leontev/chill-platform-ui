"use client";

import { Input, Form } from "antd";
import type { FormProps } from "antd";
import { useRouter } from "next/navigation";
import { Mail, Lock, Moon, Loader2, User, AtSign, Calendar } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { SideArea } from "@/app/components/sign-in/side-area";
import { CursorAnimation } from "@/app/components/cursor-animation";

type FieldType = {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agree?: boolean;
    firstName?: string;
    lastName?: string;
    username?: string;
    age?: number;
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
                        <h2 className='text-3xl font-bold text-gray-900 mb-2'>Создать аккаунт</h2>
                        <p className='text-gray-500'>
                            Уже есть аккаунт?{" "}
                            <Link href='/sign-in' className='text-purple-600 hover:text-purple-700 font-medium'>
                                Войти
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
                        <div className='grid grid-cols-2 gap-4'>
                            <Form.Item<FieldType>
                                name='firstName'
                                rules={[
                                    { required: true, message: "Введите имя" },
                                    { min: 2, message: "Имя должно содержать не менее 2 символов" },
                                ]}
                            >
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Имя</label>
                                    <Input
                                        size='large'
                                        placeholder='Имя'
                                        prefix={<User className='w-4 h-4 text-gray-400' />}
                                        className='rounded-lg h-12 hover:border-purple-400 focus:border-purple-600'
                                        disabled={isLoading}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item<FieldType>
                                name='lastName'
                                rules={[
                                    { required: true, message: "Введите фамилию" },
                                    { min: 2, message: "Фамилия должна содержать не менее 2 символов" },
                                ]}
                            >
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Фамилия</label>
                                    <Input
                                        size='large'
                                        placeholder='Фамилия'
                                        prefix={<User className='w-4 h-4 text-gray-400' />}
                                        className='rounded-lg h-12 hover:border-purple-400 focus:border-purple-600'
                                        disabled={isLoading}
                                    />
                                </div>
                            </Form.Item>
                        </div>

                        <Form.Item<FieldType>
                            name='username'
                            rules={[
                                { required: true, message: "Введите имя пользователя" },
                                { min: 3, message: "Имя пользователя должно содержать не менее 3 символов" },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: "Имя пользователя может содержать только буквы, цифры и подчеркивания" },
                            ]}
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Имя пользователя</label>
                                <Input
                                    size='large'
                                    placeholder='Придумайте имя пользователя'
                                    prefix={<AtSign className='w-4 h-4 text-gray-400' />}
                                    className='rounded-lg h-12 hover:border-purple-400 focus:border-purple-600'
                                    disabled={isLoading}
                                />
                            </div>
                        </Form.Item>

                        <Form.Item<FieldType>
                            name='age'
                            rules={[
                                { required: true, message: "Введите ваш возраст" },
                                { type: 'number', min: 13, message: "Вам должно быть не менее 13 лет" },
                                { type: 'number', max: 120, message: "Введите корректный возраст" },
                            ]}
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Возраст</label>
                                <Input
                                    size='large'
                                    type='number'
                                    placeholder='Ваш возраст'
                                    prefix={<Calendar className='w-4 h-4 text-gray-400' />}
                                    className='rounded-lg h-12 hover:border-purple-400 focus:border-purple-600'
                                    disabled={isLoading}
                                />
                            </div>
                        </Form.Item>

                        <Form.Item<FieldType>
                            name='email'
                            rules={[
                                { required: true, message: "Введите ваш email" },
                                { type: "email", message: "Введите корректный email" },
                            ]}
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Электронная почта</label>
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
                            rules={[
                                { required: true, message: "Введите пароль" },
                                { min: 6, message: "Пароль должен содержать не менее 6 символов" }
                            ]}
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Пароль</label>
                                <Input.Password
                                    size='large'
                                    placeholder='Придумайте пароль'
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
                                { required: true, message: "Подтвердите пароль" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Пароли не совпадают"));
                                    },
                                }),
                            ]}
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Подтверждение пароля</label>
                                <Input.Password
                                    size='large'
                                    placeholder='Подтвердите ваш пароль'
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
                                        <span>Создание аккаунта...</span>
                                    </div>
                                ) : (
                                    "Создать аккаунт"
                                )}
                            </button>
                        </Form.Item>
                    </Form>

                    <p className='text-center text-xs text-gray-400 mt-8'>
                        Создавая аккаунт, вы соглашаетесь с нашими{" "}
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
}
