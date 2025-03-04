"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, UserPlus, UserCheck } from "lucide-react"

export default function UserPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.97 },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
      <motion.div className="w-full max-w-md" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div
          className="relative bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-xl overflow-hidden"
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full bg-gradient-to-tl from-indigo-100 to-transparent opacity-50"></div>
          <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full bg-gradient-to-bl from-purple-100 to-transparent opacity-50"></div>

          <div className="relative p-8">
            <motion.div className="text-center space-y-6" variants={staggerChildren}>
              <motion.div variants={childVariants}>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome!
                </h1>
                <p className="mt-2 text-gray-600">Please select an option to continue</p>
              </motion.div>

              <motion.div className="space-y-4 pt-4" variants={childVariants}>
                <Link href="/user/new" passHref>
                  <motion.button
                    className="w-full group relative flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-xl font-medium shadow-md m-5"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <div className="flex items-center">
                      <UserPlus className="h-5 w-5 mr-3" />
                      <span>I am a New User</span>
                    </div>
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="h-5 w-5 opacity-70 group-hover:opacity-100" />
                    </motion.div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </motion.button>
                </Link>

                <Link href="/user/existing" passHref>
                  <motion.button
                    className="w-full group relative flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-xl font-medium shadow-md"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <div className="flex items-center">
                      <UserCheck className="h-5 w-5 mr-3" />
                      <span>I am an Existing User</span>
                    </div>
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="h-5 w-5 opacity-70 group-hover:opacity-100" />
                    </motion.div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                className="pt-4 text-sm text-gray-500"
                variants={childVariants}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <p>Choose the option that best describes you</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating shapes for background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200 opacity-20 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 15,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-200 opacity-20 blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 20,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

