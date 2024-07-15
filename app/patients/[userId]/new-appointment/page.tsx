"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AppointmentForm from "../../../../components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

interface Patient {
  $id: string;
}

export default function NewAppointment({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const patientData = await getPatient(userId);
      setPatient(patientData);
    };

    fetchPatient();
  }, [userId]);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient?.$id!}
          />

          <p className="copyright mt-10 my-12">© 2024 CatePulse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        alt="appointment"
        height={1000}
        width={1000}
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
