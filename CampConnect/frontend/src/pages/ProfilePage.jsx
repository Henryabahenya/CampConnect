import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useMockAuth } from "../context/MockAuthContext";
import { mockAlerts } from "../utils/mockData";
import ImageLightbox from "../components/ImageLightbox";
import Sidebar from "../components/Sidebar";
import CenterColumnFooter from "../components/CenterColumnFooter";

/**
 * CampConnect — Profile Portal
 * 3-Column Layout: Left sidebar + Center profile form + Right panel
 */
const ProfilePage = ({ alerts: externalAlerts }) => {
  const alerts = externalAlerts || mockAlerts;
  const { user, updateProfile } = useMockAuth();
  const fileInputRef = useRef(null);

  const [bio, setBio] = useState(user?.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [successBanner, setSuccessBanner] = useState(false);
  const [bannerOpacity, setBannerOpacity] = useState(0);

  // Camp location state — initialized from current user profile
  const [campSystem, setCampSystem] = useState(
    user?.location?.campSystem || "Kakuma",
  );
  const [sector, setSector] = useState(user?.location?.sector || "Kakuma 1");
  const [zone, setZone] = useState(
    user?.location?.specificLocation?.zone || "",
  );
  const [block, setBlock] = useState(
    user?.location?.specificLocation?.block || "",
  );
  const [neighborhood, setNeighborhood] = useState(
    user?.location?.specificLocation?.neighborhood || "",
  );
  const [compound, setCompound] = useState(
    user?.location?.specificLocation?.compound || "",
  );
  const [houseNumber, setHouseNumber] = useState(
    user?.location?.specificLocation?.houseNumber || "",
  );
  const [outsideLocation, setOutsideLocation] = useState(
    user?.location?.specificLocation?.zone || "",
  );
  const [activeZoomImage, setActiveZoomImage] = useState(null);

  // Rate-limit lock: max 3 edits per 30 days
  const [isEditLocked, setIsEditLocked] = useState(false);
  useEffect(() => {
    const timestamps = user?.profileEditTimestamps || [];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentEdits = timestamps.filter((ts) => new Date(ts) > thirtyDaysAgo);
    setIsEditLocked(recentEdits.length >= 3);
  }, [user?.profileEditTimestamps]);

  // Auto-dismiss success banner
  useEffect(() => {
    if (!successBanner) return;
    setBannerOpacity(1);
    const fadeTimer = setTimeout(() => setBannerOpacity(0), 2500);
    const removeTimer = setTimeout(() => setSuccessBanner(false), 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [successBanner]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build FormData — only pack file if explicitly selected
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("campSystem", campSystem);
    formData.append("sector", sector);
    if (campSystem === "Kakuma") {
      formData.append("zone", zone);
      formData.append("block", block);
    } else if (campSystem === "Kalobeyei") {
      formData.append("neighborhood", neighborhood);
      formData.append("compound", compound);
      formData.append("houseNumber", houseNumber);
    } else if (campSystem === "Outside Camp") {
      formData.append("zone", outsideLocation);
    }
    if (avatarFile) {
      formData.append("profilePicture", avatarFile);
    }

    try {
      // Production: sends to backend
      // const token = localStorage.getItem("campconnect_token");
      // const res = await axios.put("/api/auth/profile", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // Mock mode: update context directly
      const updates = { bio };
      if (avatarPreview) updates.profilePicture = avatarPreview;
      updates.location = {
        campSystem,
        sector,
        specificLocation: {
          zone:
            campSystem === "Kakuma"
              ? zone
              : campSystem === "Outside Camp"
                ? outsideLocation
                : "",
          block: campSystem === "Kakuma" ? block : "",
          neighborhood: campSystem === "Kalobeyei" ? neighborhood : "",
          compound: campSystem === "Kalobeyei" ? compound : "",
          houseNumber: campSystem === "Kalobeyei" ? houseNumber : "",
        },
      };
      updateProfile(updates);

      setSuccessBanner(true);
      setAvatarFile(null);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const displayAvatar = avatarPreview || user?.profilePicture || null;
  const initial = (user?.username || "?")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans flex text-slate-900">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Center Column */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-lg">
          {/* Auto-dismiss Success Banner */}
          {successBanner && (
            <div
              className="mb-6 rounded-lg bg-blue-600 px-5 py-3 text-center transition-opacity duration-500"
              style={{ opacity: bannerOpacity }}
            >
              <p className="text-sm font-medium text-white">
                Profile saved successfully.
              </p>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Profile Settings
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage your public identity and biography.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ═══ Rate-Limit Warning Banner ═══ */}
            {isEditLocked && (
              <div className="rounded-lg border border-amber-300 bg-slate-50 px-5 py-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-semibold text-amber-700">Notice:</span>{" "}
                  Profile modifications are limited to 3 times per month to
                  protect community data integrity. Your layout editing options
                  are locked until your 30-day window resets.
                </p>
              </div>
            )}

            {/* ═══ Avatar Section ═══ */}
            <section className="bg-white border border-[#E2E8F0] rounded-lg p-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
                Profile Photograph
              </h2>

              <div className="flex items-center gap-5">
                {/* 96×96 Circular Avatar Preview */}
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={user?.username}
                    className="w-24 h-24 rounded-full object-cover ring-1 ring-slate-200 shrink-0 cursor-pointer"
                    onClick={() => setActiveZoomImage(displayAvatar)}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 shrink-0">
                    {initial}
                  </div>
                )}

                {/* File Picker */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className={`inline-flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800 transition rounded border border-slate-300 px-3 py-2 ${isEditLocked ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    Change Photo (Optional)
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isEditLocked}
                    />
                  </label>
                  {avatarFile ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 truncate max-w-[160px]">
                        {avatarFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-xs text-slate-600 hover:text-blue-700 bg-transparent border-none cursor-pointer transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-blue-400">
                      PNG or JPG — max 10 MB
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* ═══ Biography Section ═══ */}
            <section className="bg-white border border-[#E2E8F0] rounded-lg p-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
                About Me / Biography
              </h2>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Tell the community about yourself
                  </label>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {bio.length}/150
                  </span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={150}
                  rows={4}
                  placeholder="Share your role, background, or interests..."
                  className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isEditLocked}
                />
              </div>
            </section>

            {/* ═══ Camp Assignment (read-only) ═══ */}
            <section className="bg-white border border-[#E2E8F0] rounded-lg p-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
                Update My Camp Location
              </h2>

              <div className="space-y-4">
                {/* Camp System */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Camp System
                  </label>
                  <select
                    value={campSystem}
                    onChange={(e) => {
                      setCampSystem(e.target.value);
                      // Reset dependent fields on system change
                      if (e.target.value === "Kakuma") {
                        setSector("Kakuma 1");
                        setNeighborhood("");
                        setCompound("");
                        setHouseNumber("");
                        setOutsideLocation("");
                      } else if (e.target.value === "Kalobeyei") {
                        setSector("Village 1");
                        setZone("");
                        setBlock("");
                        setOutsideLocation("");
                      } else {
                        setSector("None");
                        setZone("");
                        setBlock("");
                        setNeighborhood("");
                        setCompound("");
                        setHouseNumber("");
                        setOutsideLocation("");
                      }
                    }}
                    className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isEditLocked}
                  >
                    <option value="Kakuma">Kakuma Resettlement</option>
                    <option value="Kalobeyei">Kalobeyei Settlement</option>
                    <option value="Outside Camp">Outside Camp</option>
                  </select>
                </div>

                {/* Kakuma → Sector + Zone + Block */}
                {campSystem === "Kakuma" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Sector
                      </label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isEditLocked}
                      >
                        <option value="Kakuma 1">Kakuma 1</option>
                        <option value="Kakuma 2">Kakuma 2</option>
                        <option value="Kakuma 3">Kakuma 3</option>
                        <option value="Kakuma 4">Kakuma 4</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Zone
                        </label>
                        <select
                          name="zone"
                          value={zone}
                          onChange={(e) => setZone(e.target.value)}
                          className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isEditLocked}
                        >
                          <option value="Zone 1">Zone 1</option>
                          <option value="Zone 2">Zone 2</option>
                          <option value="Zone 3">Zone 3</option>
                          <option value="Zone 4">Zone 4</option>
                          <option value="Zone 5">Zone 5</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Block
                        </label>
                        <input
                          type="text"
                          value={block}
                          onChange={(e) => setBlock(e.target.value)}
                          placeholder="e.g., Block B"
                          className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isEditLocked}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Kalobeyei → Village + Neighborhood + Compound + House */}
                {campSystem === "Kalobeyei" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Village
                      </label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isEditLocked}
                      >
                        <option value="Village 1">Village 1</option>
                        <option value="Village 2">Village 2</option>
                        <option value="Village 3">Village 3</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Neighborhood
                        </label>
                        <input
                          type="text"
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          placeholder="e.g., Nbhd 2"
                          className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isEditLocked}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Compound
                        </label>
                        <input
                          type="text"
                          value={compound}
                          onChange={(e) => setCompound(e.target.value)}
                          placeholder="e.g., C-7"
                          className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isEditLocked}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          House No.
                        </label>
                        <input
                          type="text"
                          value={houseNumber}
                          onChange={(e) => setHouseNumber(e.target.value)}
                          placeholder="e.g., 14"
                          className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isEditLocked}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Outside Camp → Free-text location */}
                {campSystem === "Outside Camp" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Specify Location
                    </label>
                    <input
                      type="text"
                      value={outsideLocation}
                      onChange={(e) => setOutsideLocation(e.target.value)}
                      placeholder="e.g., Kakuma Town, Kalobeyei Town, Lodwar"
                      className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isEditLocked}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Submit */}
            {!isEditLocked && (
              <button
                type="submit"
                className="w-full rounded bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition cursor-pointer"
              >
                Save Changes
              </button>
            )}

            <span className="text-slate-600 text-xs md:text-sm mt-2 block text-center italic">
              Notice: To maintain accurate community records, profile
              modifications are limited to a maximum of 3 times per month.
              Please ensure your information is correct before saving.
            </span>
          </form>
        </div>

        {/* ═══ Avatar Lightbox ═══ */}
        <ImageLightbox
          src={activeZoomImage}
          alt={user?.username}
          onClose={() => setActiveZoomImage(null)}
        />

        {/* Center Column Footer */}
        <CenterColumnFooter />
      </main>
    </div>
  );
};

function formatLocation(loc) {
  if (!loc) return "—";
  const parts = [
    loc.zone,
    loc.block,
    loc.neighborhood,
    loc.compound,
    loc.houseNumber,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

export default ProfilePage;
