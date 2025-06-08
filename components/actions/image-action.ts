"use server";

import { cookies } from "next/headers";
import { generateImage as generateImageService } from "@/app/clientService";

export async function generateImage(imagePrompt: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { message: "No access token found" };
  }

  const { data, error } = await generateImageService({
    headers: {
      Authorization: `Bearer ${token}`,
    },  
    body: {
      imagePrompt,
    },
  });

  if (error) {
    return { message: error };
  }

  return data;
}