import { useUserStore } from "../../store/userStore";
import { avatars } from "../../data/avatars";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { updateUserProfile } from "../../services/userService";

const MyProfile: React.FC = () => {
  const {
    user,
    profile,
    setProfile,
    isLoading: isUserLoading,
  } = useUserStore();

  const [fullName, setFullName] = useState("");
  const [profilePicture, setProfilePicture] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setProfilePicture(profile.profile_picture ?? 0);
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    const toastId = toast.loading("Updating profile...");
    setIsSaving(true);

    try {
      const { data, error } = await updateUserProfile(
        user.id,
        user.email,
        fullName,
        profilePicture,
      );

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setProfile(data[0]);
        toast.success("Profile updated successfully!", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.", {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading) {
    return <div className="text-white mt-[200px] text-center">Loading...</div>;
  }

  return (
    <div className="text-white mt-[200px] max-w-md mx-auto px-4">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <h1 className="text-2xl font-semibold text-center ">My Profile</h1>
      <p className="text-center text-gray-500">{user.email}</p>
      <div className="my-6">
        <label className="block text-sm mb-2 text-gray-300">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-8">
        <p className="text-sm mb-3 text-gray-300">Choose Avatar</p>

        <div className="flex flex-wrap gap-4">
          {avatars.map((av) => {
            const isSelected = av.id === profilePicture;
            return (
              <div
                key={av.id}
                onClick={() => setProfilePicture(av.id)}
                className={`rounded-full hover:outline-2 cursor-pointer
                  ${
                    isSelected
                      ? "border-4 border-blue-500"
                      : "border-4 border-transparent"
                  }
                `}
              >
                <img
                  src={av.url}
                  alt={`Avatar ${av.id}`}
                  className="h-20 aspect-square rounded-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

            <button
        onClick={handleUpdateProfile}
        disabled={isSaving}
        className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-700
                   disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isSaving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
};

export default MyProfile;
