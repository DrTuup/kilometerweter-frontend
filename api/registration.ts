import { Registration } from "@/types/registration";
import { env } from "next-runtime-env";

const API_URL = env("NEXT_PUBLIC_API_URL");

export async function appendRegistration() {
  const description = document.getElementById("text") as HTMLInputElement;
  const kilometers = document.getElementById("kilometers") as HTMLInputElement;
  const date = document.getElementById("date") as HTMLInputElement;

  // check if all fields are filled in
  if (!description.value || !kilometers.value || !date.value) {
    alert("Please fill in all fields");
    return;
  }

  const newRegistration: Registration = {
    id: 0,
    description: description.value,
    kilometers: Number(kilometers.value),
    date: new Date(date.value),
  };

  fetch(API_URL + "/registrations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRegistration),
  });

  window.location.reload();
}

export async function deleteRegistration(id: number) {
  fetch(API_URL + "/registrations/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getRegistrations() {
  let registrations: Registration[] = [];
  return fetch(env("NEXT_PUBLIC_API_URL") + "/registrations");
}
