import { loadToken } from "../../auth/token.js";
import { API_MY_PROFILE, API_KEY } from "../../../index.js";

export async function updateProfileImage(userName, profileImgUrl) {
  try {
    const token = loadToken();

    const response = await fetch(`${API_MY_PROFILE(userName)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        avatar: {
          url: profileImgUrl,
          alt: "Profile Image",
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile image");
    }

    // Profile image updated successfully
    console.log("Profile image updated successfully");
  } catch (error) {
    console.error("Error updating profile image:", error.message);
  }
}
