import Image from "next/image";
import React from "react";
import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen remove-scrollbar">
      <section className="remove-scrollbar container ">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <p className="justify-items-end text-dark-600 xl:text-left py-10">
            © 2024 CatePulse
          </p>
         
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        alt="patient"
        height={1000}
        width={1000}
        className="side-img max-w-[380px] h-screen max-h-screen"
      />
    </div>
  );
};

export default Register;
