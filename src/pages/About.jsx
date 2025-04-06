import React from "react";

export default function About() {
  return (
    <div className="py-20 px-6 max-w-5xl mx-auto text-center">
      <h1 className="text-4xl font-extrabold text-gray-500 mb-6">
        Welcome to <span className="text-gray-700">WohnGlück</span>
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed">
        At <span className="font-semibold text-gray-800">WohnGlück</span>, we
        believe that finding your perfect home should be a seamless and exciting
        journey. Whether you're looking to buy, sell, or rent, our team is
        dedicated to guiding you every step of the way.
      </p>
      <div className="mt-10 space-y-6 text-gray-700 text-lg">
        <p>
          With years of experience in the real estate industry, we have built a
          reputation for trust, reliability, and unmatched customer service. Our
          deep knowledge of the market allows us to provide tailored solutions
          that fit your unique needs.
        </p>
        <p>
          Whether you're searching for your dream home, an investment property,
          or the perfect rental, our dedicated professionals are here to support
          you. At <span className="font-semibold text-gray-800">WohnGlück</span>
          , your happiness is our priority.
        </p>
        <p>
          Let us help you find the perfect place to call home—where memories are
          made and dreams come true. Your journey starts here.
        </p>
      </div>
    </div>
  );
}
