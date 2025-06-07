"use server";

import { cookies } from "next/headers";
import { createPost } from "@/app/clientService";

export async function generatePosts(formData: {
  brandName: string;
  location: string;
  industry: string;
  websiteUrl: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { message: "No access token found" };
  }

  const { data, error } = await createPost({
    headers: {
      Authorization: `Bearer ${token}`,
    },  
    body: {
      brandName: formData.brandName,
      location: formData.location,
      industry: formData.industry,
      websiteURL: formData.websiteUrl,
    },
  });

  if (error) {
    return { message: error };
  }

  return data;
}