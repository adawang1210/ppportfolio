"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

const contactEndpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [hackText, setHackText] = useState("Chen Kai")
  const [isHacking, setIsHacking] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isInContactSection, setIsInContactSection] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const contactRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    startHackEffect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setShowScrollTop(currentScrollY > 500)

      const contactTop = contactRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
      setIsInContactSection(contactTop <= 100)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const startHackEffect = () => {
    if (isHacking) return
    setIsHacking(true)

    const originalText = "Chen Kai"
    const chars = "01!@#$%^&*(){}[]<>?/\\|~`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let iterations = 0

    const interval = setInterval(() => {
      setHackText(
        originalText
          .split("")
          .map((char, index) => {
            if (char === " ") return " "
            if (index < iterations) {
              return originalText[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join(""),
      )

      iterations += 0.15

      if (iterations >= originalText.length) {
        clearInterval(interval)
        setHackText(originalText)
        setIsHacking(false)
      }
    }, 60)
  }

  const resetText = () => {
    setHackText("Chen Kai")
    setIsHacking(false)
  }

  const heroHeight = typeof window !== "undefined" ? window.innerHeight : 800
  const scrollProgress = Math.min(scrollY / heroHeight, 1)

  const imageScale = Math.max(0.65, 1 - scrollProgress * 0.35)

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768
  const imageTranslateY = 0
  const imageTranslateX = isMobile ? -scrollProgress * 30 : 0

  const aboutMeProgress = Math.max(0, Math.min(1, (scrollY - heroHeight * 0.5) / (heroHeight * 0.3)))

  const navOpacity = scrollY > 100 ? 0.4 : 1

  const navTextColor = isInContactSection ? "text-white" : "text-foreground"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contactEndpoint) {
      const fallbackMailto = `mailto:adawang12101210@gmail.com?subject=${encodeURIComponent(
        `New inquiry from ${formData.name || "portfolio visitor"}`,
      )}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`

      window.location.href = fallbackMailto
      toast.info("Opening your email client to finish sending the message.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to send message.")
      }

      toast.success("Message sent! I'll get back to you soon.")
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      console.error(error)
      toast.error("Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const heroContentOpacity = Math.max(0, 1 - scrollProgress * 2)

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    scrollToSection(sectionId)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="min-h-screen bg-white">
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9999] bg-black text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      {/* Hero Section with sticky container */}
      <div id="home" className="relative" style={{ height: "150vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="grid lg:grid-cols-2 h-full">
            <div className="flex items-center justify-center p-6 md:p-8 lg:p-16 relative">
              <div
                className="relative w-full max-w-lg aspect-[3/4] transition-all duration-300 ease-out hover:scale-105 group px-4 overflow-hidden"
                style={{
                  transform: `scale(${imageScale}) translateX(${imageTranslateX}%)`,
                  transformOrigin: "center center",
                }}
              >
                <Image
                  src="/images/photo.jpg"
                  alt="Chen Chen Kai"
                  fill
                  className="object-cover transition-all duration-700 group-hover:grayscale"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 md:p-8 lg:p-16 relative">
              <nav
                className="fixed top-4 md:top-8 right-4 md:right-8 lg:right-16 flex flex-col items-end gap-1 md:gap-4 z-[9999] transition-all duration-500 pointer-events-auto"
                style={{ opacity: navOpacity }}
              >
                <Link
                  href="#home"
                  onClick={(e) => handleNavClick(e, "#home")}
                  className={`text-lg md:text-2xl font-bold ${navTextColor} hover:opacity-60 transition-all relative group/link pointer-events-auto`}
                >
                  Home
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 ${isInContactSection ? "bg-white" : "bg-foreground"} transition-all duration-300 group-hover/link:w-full`}
                  ></span>
                </Link>
                <Link
                  href="#me"
                  onClick={(e) => handleNavClick(e, "#me")}
                  className={`text-lg md:text-2xl font-bold ${navTextColor} hover:opacity-60 transition-all relative group/link pointer-events-auto`}
                >
                  Me
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 ${isInContactSection ? "bg-white" : "bg-foreground"} transition-all duration-300 group-hover/link:w-full`}
                  ></span>
                </Link>
                <Link
                  href="#portfolio"
                  onClick={(e) => handleNavClick(e, "#portfolio")}
                  className={`text-lg md:text-2xl font-bold ${navTextColor} hover:opacity-60 transition-all relative group/link pointer-events-auto`}
                >
                  Projects
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 ${isInContactSection ? "bg-white" : "bg-foreground"} transition-all duration-300 group-hover/link:w-full`}
                  ></span>
                </Link>
                <Link
                  href="#experience"
                  onClick={(e) => handleNavClick(e, "#experience")}
                  className={`text-lg md:text-2xl font-bold ${navTextColor} hover:opacity-60 transition-all relative group/link pointer-events-auto`}
                >
                  Experience
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 ${isInContactSection ? "bg-white" : "bg-foreground"} transition-all duration-300 group-hover/link:w-full`}
                  ></span>
                </Link>
                <Link
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className={`text-lg md:text-2xl font-bold ${navTextColor} hover:opacity-60 transition-all relative group/link pointer-events-auto`}
                >
                  Get in touch
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 ${isInContactSection ? "bg-white" : "bg-foreground"} transition-all duration-300 group-hover/link:w-full`}
                  ></span>
                </Link>
              </nav>

              <div
                className="flex-1 flex flex-col justify-center transition-opacity duration-300 pt-24 md:pt-40 lg:pt-48"
                style={{ opacity: heroContentOpacity }}
              >
                <h1
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-3 md:mb-6 cursor-pointer font-mono glitch-container group/name"
                  onMouseEnter={startHackEffect}
                  onMouseLeave={resetText}
                >
                  <span className="glitch-text" data-text={hackText}>
                    {hackText}
                  </span>
                </h1>

                <div className="space-y-1 md:space-y-2 mb-6 md:mb-12">
                  <p className="text-base md:text-xl text-muted-foreground">Developer & Creative</p>
                  <p className="text-sm md:text-lg text-muted-foreground">
                    Check{" "}
                    <a
                      href="/profile.pdf"
                      download="Chen_Kai_Resume.pdf"
                      className="text-foreground font-medium underline hover:text-muted-foreground transition-colors"
                    >
                      my resume
                    </a>{" "}
                    for more about me
                  </p>
                </div>

                <div className="space-y-3 md:space-y-4 group cursor-pointer" onClick={() => scrollToSection("#me")}>
                  <div className="flex items-center gap-3 md:gap-4">
                    <h2 className="text-xl md:text-3xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110 origin-left">
                      Let's start
                    </h2>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-foreground md:w-6 md:h-6 transition-all duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"
                    >
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                  <div className="h-1 w-20 md:w-32 bg-foreground transition-all duration-500 ease-out group-hover:w-32 md:group-hover:w-48"></div>
                </div>
              </div>

              <div id="me"></div>
              <div
                className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-16 transition-all duration-1000 ease-out"
                style={{
                  opacity: aboutMeProgress,
                  transform: `translateY(${(1 - aboutMeProgress) * 50}px)`,
                  pointerEvents: aboutMeProgress > 0.5 ? "auto" : "none",
                }}
              >
                <div className="space-y-2 md:space-y-6">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-black leading-tight">NCU IM</h2>
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-black tracking-wide">
                    DATA SCIENCE & VIBE CODER
                  </p>
                  <p className="text-xs md:text-base lg:text-lg text-gray-700 leading-relaxed">
                    Information Management student at National Central University with a passion for AI and full-stack
                    development. Experienced in building data-driven applications with React, Next.js, and Django, while
                    actively contributing to open-source projects. Ranked 4th in my class and committed to bridging
                    technology with real-world impact through hackathons, research, and continuous learning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="portfolio" className="min-h-screen bg-white py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div
            className="transition-all duration-700"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 600) / 200)),
              transform: `translateY(${Math.max(0, 40 - (scrollY - 600) / 10)}px)`,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 md:mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black">
                Open Source Projects
              </h2>

              <div className="flex gap-2 flex-wrap">
                <button className="px-4 py-2 rounded-full border-2 border-black bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                  ALL
                </button>
                <button className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-600 text-sm font-medium hover:border-black hover:text-black transition-colors">
                  SHIPPED
                </button>
                <button className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-600 text-sm font-medium hover:border-black hover:text-black transition-colors">
                  IN-PROGRESS
                </button>
                <button className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-600 text-sm font-medium hover:border-black hover:text-black transition-colors">
                  ARCHIVED
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">

              {/* TradeSystem IPO Simulator */}
              <div
                className="group relative border-2 border-gray-200 rounded-lg p-6 hover:border-black transition-all duration-300"
                style={{
                  opacity: Math.min(1, Math.max(0, (scrollY - 1200) / 200)),
                  transform: `translateY(${Math.max(0, 30 - (scrollY - 1200) / 8)}px)`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-500">shipped</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">2024</span>
                </div>

                <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors">
                  TradeSystem
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Spring Boot 3 IPO simulation that stress-tests high-concurrency order windows with per-investor locking,
                  in-memory data structures, and admin tooling for draws and refunds.
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="6" y1="3" x2="6" y2="15"></line>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M18 9a9 9 0 0 1-9 9"></path>
                    </svg>
                    <span>2</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">Spring Boot</span>
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">Java 17</span>
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">Concurrency</span>
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">IPO</span>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href="https://github.com/adawang1210/TradeSystem"
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    source
                  </Link>
                </div>
              </div>

              {/* RAG Consistency Platform */}
              <div
                className="group relative border-2 border-gray-200 rounded-lg p-6 hover:border-black transition-all duration-300"
                style={{
                  opacity: Math.min(1, Math.max(0, (scrollY - 1300) / 200)),
                  transform: `translateY(${Math.max(0, 30 - (scrollY - 1300) / 8)}px)`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-xs text-gray-500">in-progress</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">2025</span>
                </div>

                <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors">
                  RAG Consistency Platform
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  End-to-end Retrieval-Augmented Generation stack with FAISS retrieval, τ-scored consistency checks, and a
                  Next.js dashboard for visualizing evidence clusters and streaming answers.
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>11</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="6" y1="3" x2="6" y2="15"></line>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M18 9a9 9 0 0 1-9 9"></path>
                    </svg>
                    <span>4</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">FastAPI</span>
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">Next.js 15</span>
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">FAISS</span>
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">RAG</span>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href="https://github.com/adawang1210/RAG-Consistency"
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    source
                  </Link>
                </div>
              </div>

              {/* MindMap PDF Analyzer */}
              <div
                className="group relative border-2 border-gray-200 rounded-lg p-6 hover:border-black transition-all duration-300"
                style={{
                  opacity: Math.min(1, Math.max(0, (scrollY - 1400) / 200)),
                  transform: `translateY(${Math.max(0, 30 - (scrollY - 1400) / 8)}px)`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-500">shipped</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">2024</span>
                </div>

                <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors">
                  MindMap PDF Analyzer
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Vue + Flask tool that ingests PDFs, leverages Gemini for semantic analysis, and auto-generates interactive
                  mind maps with quiz flows and scoring.
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>6</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="6" y1="3" x2="6" y2="15"></line>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M18 9a9 9 0 0 1-9 9"></path>
                    </svg>
                    <span>3</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">Vue 3</span>
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">Flask</span>
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">Gemini API</span>
                  <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">MindElixir</span>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href="https://github.com/adawang1210/mind_map"
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    source
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="min-h-screen bg-white py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div
            className="transition-all duration-700"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 2800) / 200)),
              transform: `translateY(${Math.max(0, 40 - (scrollY - 2800) / 10)}px)`,
            }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-12 md:mb-16">
              Experience & Background
            </h2>

            {/* Education Section */}
            <div className="mb-16">
              <div className="border-l-4 border-black pl-6 md:pl-8">
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-6">Education</h3>

                <div className="space-y-6">
                  <div className="group">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <h4 className="text-xl md:text-2xl font-bold text-black group-hover:text-gray-600 transition-colors">
                        National Central University (NCU)
                      </h4>
                      <span className="text-sm md:text-base text-gray-600 font-medium">Expected June 2027</span>
                    </div>
                    <p className="text-base md:text-lg text-gray-700 font-medium mb-2">
                      Bachelor of Business Administration in Information Management
                    </p>
                    <p className="text-sm md:text-base text-gray-600 mb-3">Taoyuan, Taiwan</p>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="text-sm md:text-base text-gray-700">
                        <span className="font-semibold">AI Interdisciplinary Applications Program</span>
                      </p>
                      <p className="text-sm md:text-base text-gray-700">
                        <span className="font-semibold">Relevant Coursework:</span> Web Programming, Artificial
                        Intelligence, Data Structures, Database Systems, CV
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">
                            Class Ranking: 4th out of 49 students
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">
                            Department Ranking: 16th out of 96 students
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience Section */}
            <div className="mb-16">
              <div className="border-l-4 border-black pl-6 md:pl-8">
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-6">Work Experience</h3>

                <div className="space-y-8">
                  {/* LnB */}
                  <div className="group">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <div>
                        <h4 className="text-xl md:text-2xl font-bold text-black group-hover:text-gray-600 transition-colors">
                          QA Intern
                        </h4>
                        <p className="text-base md:text-lg text-gray-700 font-medium">LnB</p>
                      </div>
                      <span className="text-sm md:text-base text-gray-600 font-medium">Sept. 2025 – Oct. 2025</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-3">Taipei, Taiwan</p>

                    <ul className="space-y-2 text-sm md:text-base text-gray-700 leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-black mt-1.5">•</span>
                        <span>
                          Developed and executed automated test scripts using Selenium to validate new product features,
                          ensuring functional accuracy and system stability.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Chain Sea */}
                  <div className="group">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <div>
                        <h4 className="text-xl md:text-2xl font-bold text-black group-hover:text-gray-600 transition-colors">
                          AI Engineer Intern
                        </h4>
                        <p className="text-base md:text-lg text-gray-700 font-medium">
                          Chain Sea Information Integration Co., Ltd.
                        </p>
                      </div>
                      <span className="text-sm md:text-base text-gray-600 font-medium">July 2025 – Aug. 2025</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-3">Taipei, Taiwan</p>

                    <ul className="space-y-2 text-sm md:text-base text-gray-700 leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-black mt-1.5">•</span>
                        <span>
                          <span className="font-semibold">Full-Cycle Development:</span> Collaborated with PMs and
                          designers to iterate on product features using React.js and Next.js, significantly optimizing
                          UI performance and page load speeds.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-black mt-1.5">•</span>
                        <span>
                          <span className="font-semibold">API Integration & Security:</span> Integrated frontend with
                          backend services via GraphQL, utilizing ApiFox for testing and implementing JWT for secure
                          authentication and data exchange.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-black mt-1.5">•</span>
                        <span>
                          <span className="font-semibold">DevOps & Cloud Deployment:</span> Implemented CI/CD pipelines
                          using GitHub Actions and deployed applications to Google Cloud Platform (GCP) services like
                          Cloud Run/App Engine to ensure automated and stable delivery.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Experience Section */}
            <div className="mb-16">
              <div className="border-l-4 border-black pl-6 md:pl-8">
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-6">Achievements & Activities</h3>

                <div className="space-y-6">
                  {/* Programming Festival */}
                  <div className="group">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <h4 className="text-xl md:text-2xl font-bold text-black group-hover:text-gray-600 transition-colors">
                        2025 Taipei and New Taipei Programming Festival
                      </h4>
                      <span className="text-sm md:text-base text-gray-600 font-medium">2025</span>
                    </div>
                    <p className="text-base md:text-lg text-gray-700 font-medium mb-2">Finalist</p>
                    <p className="text-sm md:text-base text-gray-600">Taipei, Taiwan</p>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed mt-2">
                      Advanced to the final round of the regional programming competition.
                    </p>
                  </div>

                  {/* RWA Hackathon */}
                  <div className="group">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <h4 className="text-xl md:text-2xl font-bold text-black group-hover:text-gray-600 transition-colors">
                        RWA Hackathon (imToken Track)
                      </h4>
                      <span className="text-sm md:text-base text-gray-600 font-medium">2025</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-2">Taipei, Taiwan</p>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Recognized for a project bridging the gap between high-value on-chain Real World Assets (RWA) and
                      real-time real-world consumption.
                    </p>
                  </div>

                  {/* Research Assistant */}
                  <div className="group">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <h4 className="text-xl md:text-2xl font-bold text-black group-hover:text-gray-600 transition-colors">
                        Assistant Researcher, Prof. Hsuao Ting's Lab
                      </h4>
                      <span className="text-sm md:text-base text-gray-600 font-medium">2024 – Present</span>
                    </div>
                    <p className="text-base md:text-lg text-gray-700 font-medium mb-2">Research Assistant</p>
                    <p className="text-sm md:text-base text-gray-600 mb-2">National Central University, Taiwan</p>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Assisted in research projects under Prof. Hsuao Ting.
                    </p>
                  </div>

                  {/* Social Media Manager */}
                  <div className="group">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <h4 className="text-xl md:text-2xl font-bold text-black group-hover:text-gray-600 transition-colors">
                        Social Media Manager, Freshman Information Website
                      </h4>
                      <span className="text-sm md:text-base text-gray-600 font-medium">2024 – 2025</span>
                    </div>
                    <p className="text-base md:text-lg text-gray-700 font-medium mb-2">Instagram Editor</p>
                    <p className="text-sm md:text-base text-gray-600 mb-2">National Central University, Taiwan</p>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Managed the official Instagram account for the university's freshman information platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={contactRef} id="contact" className="min-h-screen bg-black text-white px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 md:mb-12"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 3200) / 400)),
              transform: `translateY(${Math.max(0, 40 - (scrollY - 3200) / 12)}px)`,
            }}
          >
            Get in touch
          </h2>

          <p
            className="text-lg md:text-xl text-gray-400 mb-12 md:mb-16 max-w-2xl"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 3300) / 300)),
              transform: `translateY(${Math.max(0, 30 - (scrollY - 3300) / 10)}px)`,
            }}
          >
            Have a project in mind? Let's collaborate and bring your ideas to life.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 3400) / 300)),
              transform: `translateY(${Math.max(0, 40 - (scrollY - 3400) / 10)}px)`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 group">
                <label
                  htmlFor="name"
                  className="block text-sm uppercase tracking-wider text-gray-400 group-focus-within:text-white transition-colors"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent border-b-2 border-gray-700 focus:border-white py-3 text-lg md:text-xl outline-none transition-all duration-300"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-3 group">
                <label
                  htmlFor="email"
                  className="block text-sm uppercase tracking-wider text-gray-400 group-focus-within:text-white transition-colors"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent border-b-2 border-gray-700 focus:border-white py-3 text-lg md:text-xl outline-none transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-3 group">
              <label
                htmlFor="message"
                className="block text-sm uppercase tracking-wider text-gray-400 group-focus-within:text-white transition-colors"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full bg-transparent border-b-2 border-gray-700 focus:border-white py-3 text-lg md:text-xl outline-none resize-none transition-all duration-300"
                placeholder="Tell me about your project..."
              />
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative inline-flex items-center gap-4 text-xl md:text-2xl font-bold bg-white text-black px-10 py-5 transition-all duration-300 overflow-hidden ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-200"
                }`}
              >
                <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-2 group-hover:stroke-black"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </button>
            </div>
          </form>

          <div
            className="mt-16 md:mt-20 pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 3600) / 300)),
            }}
          >
            <div className="space-y-2">
              <p className="text-gray-400 text-sm uppercase tracking-wider">Direct Contact</p>
              <Link
                href="mailto:adawang12101210@gmail.com"
                className="text-xl md:text-2xl font-bold text-white hover:text-gray-300 transition-colors"
              >
                adawang12101210@gmail.com
              </Link>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm uppercase tracking-wider">Follow</p>
              <div className="flex gap-6">
                <Link
                  href="https://leetcode.com/u/Q8w1O2slMv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl hover:text-gray-400 transition-colors"
                >
                  LeetCode
                </Link>
                <Link
                  href="https://github.com/adawang1210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl hover:text-gray-400 transition-colors"
                >
                  GitHub
                </Link>
                <Link
                  href="https://www.linkedin.com/in/%E6%A5%B7-%E9%99%B3-615763361/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl hover:text-gray-400 transition-colors"
                >
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
