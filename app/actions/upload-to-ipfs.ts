"use server"

import { uploadToIPFS } from "@/lib/web3-storage"

export async function uploadFileToIPFS(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return {
        success: false,
        error: "No file provided",
      }
    }

    // Upload to IPFS using the server-side function
    const result = await uploadToIPFS(file)

    return result
  } catch (error) {
    console.error("[v0] Server action error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
