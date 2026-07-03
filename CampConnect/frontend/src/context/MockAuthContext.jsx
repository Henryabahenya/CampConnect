import { createContext, useContext, useState, useEffect } from "react";

/**
 * CampConnect - Mock Authentication Context
 * Simulates authentication state using localStorage (no backend required).
 */

const MockAuthContext = createContext(null);

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error("useMockAuth must be used within a MockAuthProvider");
  }
  return context;
};

export const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("campconnect_user");
    const parsed = stored ? JSON.parse(stored) : null;
    console.log("[AuthContext] Initialized user from localStorage:", parsed);
    return parsed;
  });

  // Sync user state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("campconnect_user", JSON.stringify(user));
      console.log("[AuthContext] User saved to localStorage:", user);
    } else {
      localStorage.removeItem("campconnect_user");
      console.log("[AuthContext] User cleared from localStorage");
    }
  }, [user]);

  /**
   * Simulated login - accepts any non-empty username/password.
   * Returns a mock user object.
   */
  const login = (username, password) => {
    if (!username || !password) {
      console.warn(
        "[AuthContext] Login failed: username and password required",
      );
      return { success: false, message: "Username and password are required." };
    }

    const mockUser = {
      id: "1",
      username,
      role: "Resident",
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=1e3a5f&color=fff&size=80`,
      location: {
        campSystem: "Kakuma",
        sector: "Kakuma 1",
        specificLocation: { zone: "Zone 3", block: "Block 1" },
      },
      joinedAt: new Date().toISOString(),
    };

    setUser(mockUser);
    console.log("[AuthContext] Login successful:", mockUser);
    return { success: true, user: mockUser };
  };

  /**
   * Simulated registration - accepts any userData with username/password.
   */
  const register = (userData) => {
    if (!userData?.username || !userData?.password) {
      console.warn("[AuthContext] Registration failed: missing fields");
      return { success: false, message: "Username and password are required." };
    }

    const mockUser = {
      id: Date.now().toString(),
      username: userData.username,
      role: userData.role || "Resident",
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=1e3a5f&color=fff&size=80`,
      location: userData.location || {
        campSystem: "Kakuma",
        sector: "Kakuma 1",
        specificLocation: { zone: "Zone 3", block: "Block 1" },
      },
      joinedAt: new Date().toISOString(),
    };

    setUser(mockUser);
    console.log("[AuthContext] Registration successful:", mockUser);
    return { success: true, user: mockUser };
  };

  /**
   * Logout - wipes user state and localStorage.
   */
  const logout = () => {
    setUser(null);
    console.log("[AuthContext] User logged out");
  };

  /**
   * Update profile - merges partial updates into the current user.
   * Only overwrites profilePicture if explicitly provided.
   */
  const updateProfile = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev };
      if (updates.username) merged.username = updates.username;
      if (updates.bio !== undefined) merged.bio = updates.bio;
      if (updates.profilePicture)
        merged.profilePicture = updates.profilePicture;
      if (updates.location)
        merged.location = { ...prev.location, ...updates.location };

      // Track profile edit timestamps for rate limiting
      const timestamps = [
        ...(prev.profileEditTimestamps || []),
        new Date().toISOString(),
      ];
      merged.profileEditTimestamps = timestamps;

      return merged;
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};

export default MockAuthContext;
