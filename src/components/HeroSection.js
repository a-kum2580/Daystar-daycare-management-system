import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function HeroSection() {
  const imagePath = "/images/3.jpg";

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Welcome to</span>
                <span className="block text-blue-500">Daystar Daycare Center</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                A premier facility dedicated to providing a secure, nurturing, and stimulating environment for young children. Our professional staff ensures your child's safety, well-being, and development.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/enroll-child">
                    <Button size="lg">
                      Enroll Your Child
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2" style={{ height: '100vh' }}>
        <div className="relative h-full w-full">
          <img
            src={imagePath}
            alt="Daystar Daycare Center"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              minHeight: '100vh',
              width: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              imageRendering: 'crisp-edges'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>
      </div>
    </div>
  );
} 