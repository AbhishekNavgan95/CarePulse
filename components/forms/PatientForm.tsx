"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CostomFormField from "../CostomFormField";
import { Form } from "@/components/ui/form";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { userFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
  
export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  PHONE_INPUT = "phoneInput",
  TEXTAREA = "textarea",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof userFormValidation>>({
    resolver: zodResolver(userFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof userFormValidation>) {
    setIsLoading(true);

    try {

      const userData = { name, email, phone };
      const user = await createUser(userData);

      if (user) {
        router.push(`/patients/${user.$id}/register`);
      }
    } catch (error) {

      console.log("error: ", error);
    }
    
    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi There 👋, </h1>
          <p className="text-dark-700">Schedule your first Appointment.</p>
        </section>

        <CostomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CostomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="Enter your Email"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CostomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone Number"
          placeholder="123-456-7890"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
