/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./script.js"],
  safelist: [
    'bg-sky-50','bg-sky-100','bg-sky-200','bg-sky-300','bg-sky-500','bg-sky-600','bg-sky-700',
    'text-sky-600','text-sky-700','border-sky-200','border-sky-300','border-sky-400','border-sky-500',
    'text-slate-300','text-slate-400','text-slate-500','text-slate-700','text-slate-900',
    'border-slate-100','border-slate-200','line-through','opacity-0','opacity-100',
    'fixed','md:static','inset-y-0','left-0','z-40','z-50','-translate-x-full','md:translate-x-0','translate-x-0','shadow-2xl','hidden','md:hidden',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
