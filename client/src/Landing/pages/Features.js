import React from "react";
import FeatureCard from "../components/FeatureCard";
import "./Features.css";
const features = [
  {
    icon: "forum",
    title: "Statutory Community",
    description:
      "A collaborative platform for legal professionals to post articles, questions, and updates.",
  },
  {
    icon: "local_library",
    title: "General Community",
    description:
      "A place for advice and recommendations shared by legal professionals.",
  },
  {
    icon: "travel_explore",
    title: "Find a Lawyer",
    description:
      "Post job opportunities and hire qualified lawyers for your needs.",
  },
  {
    icon: "gavel",
    title: "Online Courts",
    description:
      "Comprehensive management of court schedules with live audio and video.",
  },
  {
    icon: "paid",
    title: "Online Payment",
    description:
      "Pay for driving tickets online, eliminating the need to visit the court in person.",
  },
  {
    icon: "recommend",
    title: "Recommend Lawyer",
    description:
      "Receive personalized lawyer recommendations based on your requirements.",
  },
];

const Features = () => {
  return (
    <section className="features-section">
      <h2>Services</h2>
      <div className="features-container">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
