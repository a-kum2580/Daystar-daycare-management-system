import React from "react";
import { Link } from "react-router-dom";

export function BenefitsSection() {
  const benefits = [
    {
      title: "Professional Staff",
      description: "Our experienced and certified teachers provide personalized attention to each child.",
      icon: "👩‍🏫"
    },
    {
      title: "Safe Environment",
      description: "State-of-the-art facilities with secure access and constant supervision.",
      icon: "🔒"
    },
    {
      title: "Learning Through Play",
      description: "Engaging activities that promote cognitive, social, and physical development.",
      icon: "🎮"
    },
    {
      title: "Healthy Meals",
      description: "Nutritious meals and snacks prepared fresh daily by our kitchen staff.",
      icon: "🍎"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose Daystar Daycare?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            We provide a nurturing environment where children can learn, grow, and thrive.
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-500">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/enroll-child"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Enroll Your Child
          </Link>
        </div>
      </div>
    </section>
  );
} 