import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PostCard — Elegant minimalist card for the community feed grid.
 * Props: { alert } where alert matches the mockAlerts shape.
 */

const categoryColors = {
  Water: "bg-blue-50 text-blue-800",
  Infrastructure: "bg-blue-50 text-blue-800",
  Health: "bg-emerald-50 text-emerald-800",
  Clinic: "bg-emerald-50 text-emerald-800",
  Security: "bg-amber-50 text-amber-800",
  Emergency: "bg-amber-50 text-amber-800",
  Education: "bg-violet-50 text-violet-800",
  Food: "bg-orange-50 text-orange-800",
  Power: "bg-yellow-50 text-yellow-800",
  Shelter: "bg-teal-50 text-teal-800",
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const PostCard = ({ alert }) => {
  const navigate = useNavigate();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [localComments, setLocalComments] = useState(
    (alert.comments || []).map((c) => ({
      ...c,
      likesCount: c.likesCount || 0,
      isLikedByCurrentUser: false,
      replies: c.replies || [],
    })),
  );
  const [zoomedAvatar, setZoomedAvatar] = useState(null);
  const [activeReplyFormId, setActiveReplyFormId] = useState(null);
  const [activeMediaLightbox, setActiveMediaLightbox] = useState(null);
  const [activeViewerListPost, setActiveViewerListPost] = useState(null);

  const poster =
    typeof alert.postedBy === "object"
      ? alert.postedBy
      : { username: alert.postedBy, profilePicture: null };

  const locationString = [alert.targetSector, alert.locationDetails]
    .filter(Boolean)
    .join(" · ");

  const catColor =
    categoryColors[alert.category] || "bg-slate-50 text-slate-600";

  const isUrgent =
    alert.category === "Security" || alert.category === "Emergency";

  // Resolve the image URL from any of the common property names
  const imageUrl = alert.imageUrl || alert.image || alert.mediaUrl || null;

  // Handle new comment submission
  const handleCommentSubmit = (postId, text) => {
    if (!text?.trim()) return;
    const newComment = {
      id: `local-${Date.now()}`,
      postedBy: { username: "You", profilePicture: null },
      text: text.trim(),
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLikedByCurrentUser: false,
      replies: [],
    };
    setLocalComments((prev) => [...prev, newComment]);
    // TODO: Wire to backend API endpoint — POST /api/alerts/:postId/comments
  };

  // Handle comment like toggle
  const handleCommentLike = (postId, commentId) => {
    setLocalComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isLikedByCurrentUser: !c.isLikedByCurrentUser,
              likesCount: c.isLikedByCurrentUser
                ? c.likesCount - 1
                : c.likesCount + 1,
            }
          : c,
      ),
    );
    // TODO: Wire to backend — POST /api/alerts/:postId/comments/:commentId/like
  };

  // Toggle reply input form visibility
  const toggleReplyInput = (commentId) => {
    setActiveReplyFormId((prev) => (prev === commentId ? null : commentId));
  };

  // Handle nested reply submission
  const handleReplySubmit = (postId, commentId, replyText) => {
    if (!replyText?.trim()) return;
    const newReply = {
      id: `reply-${Date.now()}`,
      authorName: "You",
      text: replyText.trim(),
      timeAgo: "Just now",
    };
    setLocalComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...(c.replies || []), newReply] }
          : c,
      ),
    );
    setActiveReplyFormId(null);
    // TODO: Wire to backend — POST /api/alerts/:postId/comments/:commentId/replies
  };

  return (
    <article
      data-priority={isUrgent ? "urgent" : undefined}
      className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
    >
      {/* ── Header: Author + Location Breadcrumbs ── */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-50 text-left">
        {/* User Avatar */}
        {poster.profilePicture ? (
          <img
            src={poster.profilePicture}
            alt={poster.username}
            className="w-10 h-10 rounded-full object-cover border border-slate-100 cursor-pointer hover:scale-105 transition-transform shrink-0"
            onClick={() => setZoomedAvatar(poster.profilePicture)}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0 cursor-pointer hover:scale-105 transition-transform"
            onClick={() =>
              navigate(`/profile/${alert.postedBy?.id || alert.id}`)
            }
          >
            {poster.username?.[0]?.toUpperCase() || "?"}
          </div>
        )}

        {/* Vertical Meta Stack */}
        <div className="flex flex-col gap-1 min-w-0">
          {/* Author Name */}
          <span
            className="text-slate-900 font-bold text-sm hover:underline cursor-pointer truncate"
            onClick={() =>
              navigate(`/profile/${alert.postedBy?.id || alert.id}`)
            }
          >
            {poster.username}
          </span>

          {/* Location Breadcrumb Row */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-semibold">
              {alert.targetSector || "Kakuma 1"}
            </span>
            <span className="text-slate-300">•</span>
            <span className="bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded-md">
              {alert.locationDetails?.split(",")[0]?.trim() || "Zone 3"}
            </span>
            {alert.locationDetails?.split(",")[1] && (
              <>
                <span className="text-slate-300">•</span>
                <span className="bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded-md">
                  {alert.locationDetails.split(",")[1].trim()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Content Section ── */}
      <div>
        {/* Category Badge */}
        <div className="flex items-center gap-2 flex-wrap mt-3">
          {alert.category && (
            <span
              className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg ${catColor}`}
            >
              {alert.category}
            </span>
          )}
        </div>

        {/* ── Title ── */}
        <h3 className="text-base font-bold text-slate-900 line-clamp-2 mt-3 mb-2">
          {alert.title}
        </h3>

        {/* ── Body Copy ── */}
        <p className="text-slate-600 text-xs md:text-sm line-clamp-3 leading-relaxed mb-2">
          {alert.description}
        </p>

        {/* ── Media / Image Banner ── */}
        {imageUrl && (
          <div className="my-4 overflow-hidden rounded-xl border border-slate-100 max-h-72 bg-slate-50 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={alert.title}
              className="w-full h-full object-cover cursor-zoom-in hover:opacity-95 transition-opacity duration-300 ease-out"
              onClick={() => setActiveMediaLightbox(imageUrl)}
            />
          </div>
        )}

        {/* ── Views & Comments Metrics Row ── */}
        <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-100 text-xs text-slate-500 font-medium">
          <button
            type="button"
            onClick={() => setActiveViewerListPost(alert)}
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-slate-500 font-medium"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-slate-400"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{alert.viewCount || 0} views</span>
          </button>
          <span>{localComments.length || 0} comments</span>
        </div>

        {/* ── Action Button ── */}
        <div className="p-1 text-slate-600 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setCommentsOpen((o) => !o)}
            className="w-full flex items-center justify-center gap-2 py-2 hover:bg-slate-50 rounded-lg transition-all cursor-pointer bg-transparent border-none"
          >
            💬 Comment
          </button>
        </div>

        {/* ── Comments Drawer ── */}
        {commentsOpen && (
          <div className="mt-4 pt-3 border-t border-slate-50 text-left">
            {/* New Comment Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCommentSubmit(alert.id, e.target.commentText.value);
                e.target.reset();
              }}
              className="flex gap-2 mb-4"
            >
              <input
                name="commentText"
                type="text"
                placeholder="Write a supportive comment..."
                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-sm border-none cursor-pointer"
              >
                Comment
              </button>
            </form>

            {/* Comments Stream */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {localComments.map((comment) => {
                const commenter =
                  typeof comment.postedBy === "object"
                    ? comment.postedBy
                    : {
                        username: comment.postedBy || "Resident User",
                        profilePicture: null,
                      };
                const avatarUrl =
                  commenter.profilePicture || comment.authorAvatarUrl || null;
                return (
                  <div key={comment.id}>
                    <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 text-xs leading-relaxed">
                      <div className="flex items-start gap-2">
                        {/* Commenter Avatar */}
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={commenter.username}
                            className="w-7 h-7 rounded-full object-cover cursor-zoom-in border border-slate-100 hover:scale-105 transition-transform shrink-0"
                            onClick={() => setZoomedAvatar(avatarUrl)}
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-500 shrink-0">
                            {commenter.username?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1 text-slate-400 font-medium">
                            <span
                              className="cursor-pointer hover:underline text-slate-900 font-bold text-sm"
                              onClick={() =>
                                navigate(
                                  `/profile/${comment.postedBy?.id || comment.id}`,
                                )
                              }
                            >
                              {commenter.username || "Resident User"}
                            </span>
                            <span>
                              {timeAgo(comment.createdAt) || "Just now"}
                            </span>
                          </div>
                          <p className="text-slate-600">{comment.text}</p>
                        </div>
                      </div>
                    </div>

                    {/* Comment Actions: Like & Reply */}
                    <div className="flex flex-col gap-2 mt-1.5 text-xs text-slate-500 font-medium pl-9">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleCommentLike(alert.id, comment.id)
                          }
                          className={`hover:underline cursor-pointer flex items-center gap-1 transition-colors bg-transparent border-none p-0 text-xs font-medium ${comment.isLikedByCurrentUser ? "text-blue-600 font-bold" : "text-slate-500"}`}
                        >
                          {comment.isLikedByCurrentUser
                            ? "❤️ Liked"
                            : "🤍 Like"}
                          <span className="text-slate-400 font-normal">
                            ({comment.likesCount || 0})
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleReplyInput(comment.id)}
                          className="hover:underline cursor-pointer text-slate-500 bg-transparent border-none p-0 text-xs font-medium"
                        >
                          💬 Comment
                        </button>
                      </div>

                      {/* Nested Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2 space-y-2 border-l-2 border-slate-100 pl-4">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="bg-slate-50/60 p-2 rounded-xl border border-slate-100/80"
                            >
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-slate-700 text-[11px]">
                                  {reply.authorName}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {reply.timeAgo || timeAgo(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-slate-600 text-xs">
                                {reply.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {activeReplyFormId === comment.id && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleReplySubmit(
                              alert.id,
                              comment.id,
                              e.target.replyText.value,
                            );
                            e.target.reset();
                          }}
                          className="flex gap-2 mt-2 w-full animate-fade-in"
                        >
                          <input
                            name="replyText"
                            type="text"
                            placeholder={`Comment on ${commenter.username}'s post...`}
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 transition-all"
                          />
                          <button
                            type="submit"
                            className="bg-blue-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all border-none cursor-pointer"
                          >
                            Comment
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}
              {localComments.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-3">
                  No comments yet — be the first to respond.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer: Timestamp ── */}
      <div>
        <div className="border-t border-slate-100 pt-3 mt-auto flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            {timeAgo(alert.createdAt)}
          </span>
        </div>
      </div>

      {/* ── Zoomed Avatar Overlay ── */}
      {zoomedAvatar && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomedAvatar(null)}
        >
          <div
            className="relative max-w-[20vw] max-h-[25vh] bg-white rounded-xl overflow-hidden shadow-lg p-1 animate-scale-up-30"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedAvatar}
              alt="Zoomed User Profile"
              className="w-24 h-24 object-cover rounded-lg mx-auto"
            />
            <button
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all border-none cursor-pointer"
              onClick={() => setZoomedAvatar(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Full-Screen Media Lightbox ── */}
      {activeMediaLightbox && (
        <div
          className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setActiveMediaLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-slate-500 hover:text-slate-800 bg-white/80 hover:bg-white p-2 rounded-full text-lg transition-all border-none cursor-pointer shadow-sm"
            onClick={() => setActiveMediaLightbox(null)}
          >
            ✕
          </button>
          <img
            src={activeMediaLightbox}
            alt="Enlarged community report attachment"
            className="max-w-[30vw] max-h-[30vh] object-contain rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl animate-scale-up-30"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ── Viewers List Modal ── */}
      {activeViewerListPost && (
        <div
          className="fixed inset-0 z-[120] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveViewerListPost(null)}
        >
          <div
            className="bg-white border border-slate-100 rounded-2xl p-5 max-w-[30vw] w-full shadow-2xl animate-scale-up-30 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>👁️</span> Post Impressions (
                {activeViewerListPost.viewCount || 0})
              </h4>
              <button
                className="text-slate-400 hover:text-slate-600 text-xs font-bold bg-transparent border-none cursor-pointer"
                onClick={() => setActiveViewerListPost(null)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
              {(
                activeViewerListPost.viewers || [
                  {
                    id: "u1",
                    name: "David R.",
                    avatar:
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                  },
                  {
                    id: "u2",
                    name: "Dr. Lena W.",
                    avatar:
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
                  },
                  {
                    id: "u3",
                    name: "Henry Abahenya",
                    avatar:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                  },
                  {
                    id: "u4",
                    name: "Alpha Diallo",
                    avatar:
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
                  },
                ]
              ).map((viewer) => (
                <div
                  key={viewer.id}
                  onClick={() => {
                    setActiveViewerListPost(null);
                    if (typeof navigate === "function") {
                      navigate(`/profile/${viewer.id}`);
                    }
                  }}
                  className="flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                >
                  <img
                    src={viewer.avatar}
                    alt={viewer.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {viewer.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Viewed post
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;
