"use client";

import { ReactNode, useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, Transition } from '@headlessui/react'
import {
  LayoutDashboard,
  Tent,
  GraduationCap,
  Users,
  Settings,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

// Final attempt: Using Headless UI for transition to ensure no hydration mismatch.
// This is the most robust industry-standard pattern.

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Кэмпы", href: "/admin/camps", icon: Tent },
    { name: "Курсы", href: "/admin/courses", icon: GraduationCap },
    { name: "Пользователи", href: "/admin/users", icon: Users },
    { name: "Настройки", href: "/admin/settings", icon: Settings },
  ];

  const sidebarContent = (
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#1C1C1C] px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
             <Link href="/admin" className="text-2xl font-black italic text-v-accent tracking-tighter leading-none">
                VOLLEYDZEN
            </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navItems.map((item) => {
                   const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                   return (
                    <li key={item.name}>
                        <Link
                        href={item.href}
                        className={classNames(
                            isActive
                            ? 'bg-v-accent text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/10',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                        >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                        </Link>
                    </li>
                   )
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <Link
                href="/"
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-6 w-6 shrink-0" />
                Вернуться на сайт
              </Link>
            </li>
          </ul>
        </nav>
      </div>
  );

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <X className="h-6 w-6 text-white" />
                      </button>
                    </div>
                  </Transition.Child>
                  {sidebarContent}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {sidebarContent}
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-v-dark px-4 shadow-sm sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
                {/* This div handles the table overflow issue globally */}
                <div className="overflow-x-auto">
                    {children}
                </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
