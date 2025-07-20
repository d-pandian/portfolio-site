"use client";
import Container from "@/components/Container";
import Input, { Label } from "@/components/Input";
import { CheckCircle, Loader, MoveUpRight } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { motion } from "motion/react";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
    budget: "",
    message: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    const currentDateTime = new Date().toLocaleString();
    form.append("Name", formData.name);
    form.append("Email", formData.email);
    form.append("Interest", formData.interest);
    form.append("Budget", formData.budget);
    form.append("Message", formData.message);
    form.append("DateTime", currentDateTime);
    setLoading(true);
    setSuccess(false);

    try {
      // const response = await fetch('', {
      //   method: "POST",
      //   body: form,
      // });

      // if (response?.ok) {
      //   setFormData({
      //     name: "",
      //     email: "",
      //     interest: "",
      //     budget: "",
      //     message: "",
      //   });
      // }
      setFormData({
        name: "",
        email: "",
        interest: "",
        budget: "",
        message: "",
      });
    } catch (error) {
      console.log("Form submitting Error", error);
    } finally {
      setLoading(false);
      setSuccess(true);
    }
  };
  return (
    <div>
      <Container className="flex gap-10 items-center md:gap-20 py-20">
        <div>
          <div className="w-[2px] h-28 bg-primary/30">
            <div className="w-full h-[80%] bg-primary" />
          </div>
        </div>

        <div className="flex-1 max-w-4xl">
          <h2 className="font-bold text-2xl md:text-4xl md:leading-[50px] mb-2">
            Love to hear from you, <br />
            Get in touch 👋
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-1 flex-col md:flex-row items-center gap-3 md:gap-10 lg:gap-20">
              <div className="flex flex-col w-full">
                <Label htmlFor="name">Your name</Label>
                <Input
                  disabled={loading}
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col w-full">
                <Label htmlFor="email">Your email</Label>
                <Input
                  disabled={loading}
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col md:flex-row items-center gap-3 md:gap-10 lg:gap-20">
              <div className="flex flex-col w-full">
                <Label htmlFor="interest">What you are interested</Label>
                <Input
                  disabled={loading}
                  type="text"
                  name="interest"
                  placeholder="ex: Design & Branding"
                  value={formData.interest}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col w-full">
                <Label htmlFor="budget">Project Budget</Label>
                <Input
                  disabled={loading}
                  type="text"
                  name="budget"
                  placeholder="ex: $2500"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                disabled={loading}
                placeholder="Let us know your thought"
                className="w-full bg-primary/5 text-base px-4 py-2 outline-none border rounded-md focus-within:border-primary resize-none disabled:bg-primary/20 focus-within:bg-primaryWhite"
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center bg-primary text-primaryWhite w-full md:w-1/2 py-2.5 gap-1"
            >
              {loading ? "Sending..." : "Just Send"}{" "}
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <MoveUpRight className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  }}
                >
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                </motion.div>
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Success!
                </h2>
                <p className="mt-2 text-base font-medium text-gray-600">
                  Your message has been sent successfully. We&apos;ll get back
                  to you soon!
                </p>
              </div>
              <div className="mt-5 bg-primary/80 text-primaryWhite py-2 rounded-lg font-semibold tracking-wide hover:bg-primary hoverEffect">
                <button onClick={() => setSuccess(false)} className="w-full">
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default ContactPage;
