/**
 * CampConnect - Mock Alert Data Store
 * Realistic community alert objects matching the backend Alert + User schemas.
 */

/** All available sectors for filter tabs */
export const ALL_SECTORS = [
  "Kakuma 1",
  "Kakuma 2",
  "Kakuma 3",
  "Kakuma 4",
  "Village 1",
  "Village 2",
  "Village 3",
];

export const mockAlerts = [
  {
    id: "1",
    title: "Water Point Breakdown at Block C",
    description:
      "The main water point serving Block C has been non-functional since 6 AM. Over 200 households are affected. Maintenance crew has been contacted but no ETA provided yet.",
    category: "Water",
    urgency: "High",
    targetSector: "Kakuma 1",
    locationDetails: "Zone 3, Block C",
    image:
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=300&fit=crop",
    postedBy: {
      username: "Ahmed K.",
      profilePicture:
        "https://ui-avatars.com/api/?name=Ahmed+K&background=1e3a5f&color=fff&size=80",
      sector: "Kakuma 1",
      bio: "Community water coordinator, Zone 3 resident since 2019.",
    },
    upvotes: 14,
    viewCount: 42,
    status: "Active",
    createdAt: "2026-06-18T06:30:00Z",
    comments: [
      {
        id: "c1",
        postedBy: {
          username: "Fatima N.",
          profilePicture:
            "https://ui-avatars.com/api/?name=Fatima+N&background=d97706&color=fff&size=80",
          sector: "Kakuma 1",
          bio: "Mother of four, food distribution volunteer.",
        },
        text: "This is affecting our entire row. We have small children who need water urgently.",
        createdAt: "2026-06-18T08:12:00Z",
      },
      {
        id: "c2",
        postedBy: {
          username: "David R.",
          profilePicture:
            "https://ui-avatars.com/api/?name=David+R&background=059669&color=fff&size=80",
          sector: "Kakuma 1",
          bio: "Block representative, father of three.",
        },
        text: "Maintenance confirmed they are sourcing a replacement pump. Possibly fixed by evening.",
        createdAt: "2026-06-18T10:45:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Broken Streetlight Near Main Gate",
    description:
      "The streetlight at the main entrance has been out for 3 consecutive nights. The area is dangerously dark and poses a security risk for residents returning late.",
    category: "Power",
    urgency: "Medium",
    targetSector: "Kakuma 2",
    locationDetails: "Zone 1, Block A — Main Gate Corridor",
    image: null,
    postedBy: {
      username: "Sarah M.",
      profilePicture:
        "https://ui-avatars.com/api/?name=Sarah+M&background=6366f1&color=fff&size=80",
      sector: "Kakuma 2",
      bio: "Evening patrol volunteer, Zone 1.",
    },
    upvotes: 8,
    viewCount: 23,
    status: "Active",
    createdAt: "2026-06-16T19:45:00Z",
  },
  {
    id: "3",
    title: "Suspicious Activity Behind Storage Units",
    description:
      "Unknown individuals were seen loitering behind the storage units after midnight on two consecutive nights. Requesting increased patrol and lighting.",
    category: "Security",
    urgency: "High",
    targetSector: "Kakuma 1",
    locationDetails: "Zone 2, Block D — North Perimeter",
    image: null,
    postedBy: {
      username: "David R.",
      profilePicture:
        "https://ui-avatars.com/api/?name=David+R&background=059669&color=fff&size=80",
      sector: "Kakuma 1",
      bio: "Block representative, father of three.",
    },
    upvotes: 22,
    viewCount: 67,
    status: "Active",
    createdAt: "2026-06-17T01:15:00Z",
    comments: [
      {
        id: "c3",
        postedBy: {
          username: "Grace A.",
          profilePicture:
            "https://ui-avatars.com/api/?name=Grace+A&background=be185d&color=fff&size=80",
          sector: "Kakuma 1",
          bio: "WASH committee member, Block E.",
        },
        text: "I saw the same group last Tuesday. They seem to arrive after the patrol leaves at 11 PM.",
        createdAt: "2026-06-17T06:30:00Z",
      },
    ],
  },
  {
    id: "4",
    title: "Food Distribution Delayed by 2 Hours",
    description:
      "Morning food distribution was delayed significantly today. Families with young children and elderly members were disproportionately affected.",
    category: "Food",
    urgency: "Medium",
    targetSector: "Village 1",
    locationDetails: "Distribution Center A, Compound 7",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=300&fit=crop",
    postedBy: {
      username: "Fatima N.",
      profilePicture:
        "https://ui-avatars.com/api/?name=Fatima+N&background=d97706&color=fff&size=80",
      sector: "Village 1",
      bio: "Mother of four, food distribution volunteer.",
    },
    upvotes: 11,
    viewCount: 35,
    status: "Resolved",
    createdAt: "2026-06-15T08:00:00Z",
  },
  {
    id: "5",
    title: "Flooding in Tent Row 7",
    description:
      "Heavy overnight rain caused serious flooding across Row 7. At least 12 tents are waterlogged and families urgently need relocation or drainage support.",
    category: "Shelter",
    urgency: "High",
    targetSector: "Kakuma 3",
    locationDetails: "Zone 4, Block B — Row 7",
    image:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&h=300&fit=crop",
    postedBy: {
      username: "James O.",
      profilePicture:
        "https://ui-avatars.com/api/?name=James+O&background=dc2626&color=fff&size=80",
      sector: "Kakuma 3",
      bio: "Shelter maintenance team lead.",
    },
    upvotes: 19,
    viewCount: 54,
    status: "Active",
    createdAt: "2026-06-18T22:00:00Z",
  },
  {
    id: "6",
    title: "Medical Clinic Overcrowded",
    description:
      "Wait times exceeding 4 hours at the camp clinic. Additional medical staff and triage capacity needed urgently to handle the patient volume.",
    category: "Health",
    urgency: "High",
    targetSector: "Kakuma 1",
    locationDetails: "Zone 1, Block A — Camp Medical Center",
    image: null,
    postedBy: {
      username: "Dr. Lena W.",
      profilePicture:
        "https://ui-avatars.com/api/?name=Lena+W&background=7c3aed&color=fff&size=80",
      sector: "Kakuma 1",
      bio: "Camp medical officer, internal medicine.",
    },
    upvotes: 27,
    viewCount: 91,
    status: "Active",
    createdAt: "2026-06-19T09:00:00Z",
    comments: [
      {
        id: "c4",
        postedBy: {
          username: "Ahmed K.",
          profilePicture:
            "https://ui-avatars.com/api/?name=Ahmed+K&background=1e3a5f&color=fff&size=80",
          sector: "Kakuma 1",
          bio: "Community water coordinator, Zone 3 resident since 2019.",
        },
        text: "My mother waited 5 hours yesterday. Please escalate this to UNHCR health team.",
        createdAt: "2026-06-19T10:20:00Z",
      },
      {
        id: "c5",
        postedBy: {
          username: "Sarah M.",
          profilePicture:
            "https://ui-avatars.com/api/?name=Sarah+M&background=6366f1&color=fff&size=80",
          sector: "Kakuma 2",
          bio: "Evening patrol volunteer, Zone 1.",
        },
        text: "They should open the secondary clinic in Zone 4 for overflow patients.",
        createdAt: "2026-06-19T11:05:00Z",
      },
      {
        id: "c6",
        postedBy: {
          username: "Dr. Lena W.",
          profilePicture:
            "https://ui-avatars.com/api/?name=Lena+W&background=7c3aed&color=fff&size=80",
          sector: "Kakuma 1",
          bio: "Camp medical officer, internal medicine.",
        },
        text: "Update: We've requested two additional nurses for tomorrow's shift. Thank you for your patience.",
        createdAt: "2026-06-19T13:00:00Z",
      },
    ],
  },
  {
    id: "7",
    title: "Wi-Fi Down in Community Hall",
    description:
      "Internet connection in the Community Hall has been unavailable since yesterday morning. Students are unable to attend scheduled online classes.",
    category: "Power",
    urgency: "Low",
    targetSector: "Village 2",
    locationDetails: "Neighborhood 3, Compound 12",
    image: null,
    postedBy: {
      username: "Mika T.",
      profilePicture:
        "https://ui-avatars.com/api/?name=Mika+T&background=0891b2&color=fff&size=80",
      sector: "Village 2",
      bio: "Student, aspiring software engineer.",
    },
    upvotes: 5,
    viewCount: 12,
    status: "Active",
    createdAt: "2026-06-18T14:30:00Z",
  },
  {
    id: "8",
    title: "Latrine Block Needs Urgent Repair",
    description:
      "Three of the six latrine stalls in Block E are completely non-functional. The remaining stalls are overwhelmed and unsanitary conditions are worsening.",
    category: "Water",
    urgency: "High",
    targetSector: "Kakuma 4",
    locationDetails: "Zone 2, Block E",
    image: null,
    postedBy: {
      username: "Grace A.",
      profilePicture:
        "https://ui-avatars.com/api/?name=Grace+A&background=be185d&color=fff&size=80",
      sector: "Kakuma 4",
      bio: "WASH committee member, Block E.",
    },
    upvotes: 16,
    viewCount: 38,
    status: "Active",
    createdAt: "2026-06-19T07:15:00Z",
  },
  {
    id: "9",
    title: "Solar Panel Theft at Village 2 School",
    description:
      "Two solar panels were stolen from the school roof overnight. The school is now without power for lighting and device charging.",
    category: "Security",
    urgency: "High",
    targetSector: "Village 2",
    locationDetails: "Neighborhood 1, Compound 4 — Primary School",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=300&fit=crop",
    postedBy: {
      username: "Samuel K.",
      profilePicture:
        "https://ui-avatars.com/api/?name=Samuel+K&background=1e3a5f&color=fff&size=80",
      sector: "Village 2",
      bio: "School administrator and community leader.",
    },
    upvotes: 31,
    viewCount: 78,
    status: "Active",
    createdAt: "2026-06-19T05:45:00Z",
  },
];

export default mockAlerts;
