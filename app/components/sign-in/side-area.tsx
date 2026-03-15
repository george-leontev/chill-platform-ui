import { Moon, Sparkles } from "lucide-react";

export const SideArea = () => {
    return (
        <div className='hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-purple-900 via-purple-800 to-purple-600 overflow-hidden'>
            <div className='absolute inset-0 opacity-10'>
                <div className='absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl'></div>
                <div className='absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl'></div>
            </div>

            <div
                className='absolute inset-0 opacity-5'
                style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "40px 40px",
                }}
            ></div>

            <div className='relative w-full flex flex-col justify-between p-12 text-white'>
                <div className='flex items-center gap-2'>
                    <div className='p-2 bg-white/10 rounded-xl backdrop-blur-sm'>
                        <Moon className='w-6 h-6' />
                    </div>
                    <span className='text-xl font-light tracking-wider'>
                        CHILL<span className='font-bold'>ZONE</span>
                    </span>
                </div>

                <div className='flex-1 flex flex-col justify-center'>
                    <h1 className='text-7xl font-bold leading-tight mb-6'>
                        ДОБРО
                        <br />
                        <span className='text-purple-200'>ПОЖАЛОВАТЬ</span>
                    </h1>

                    <p className='text-purple-200 text-lg max-w-md leading-relaxed'>
                        Общайтесь с другими любителями отдыха, делитесь впечатлениями и наслаждайтесь искусством
                        ничегонеделания в компании.
                    </p>
                </div>

                <div className='flex items-center gap-2 text-purple-200 text-sm'>
                    <Sparkles className='w-4 h-4' />
                    <span>Наконец-то место, где не надо притворяться занятым. Просто настоящий, чистый чилл.</span>
                </div>
            </div>
        </div>
    );
};
