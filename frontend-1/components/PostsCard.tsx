"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Flag,
  Link2
} from "lucide-react"
import { Post } from "@/types/posts.type"
import { useRouter } from "next/navigation"
import { usePostAction } from "@/hooks/postsAction"
import ReportModal from "@/components/modals/ReportModal";
import { formatCount } from "@/lib/formatCount"
import { timeAgo } from "@/lib/timeAgo"
import LoginRequiredModal from "./modals/LoginRequiredModal"
import { User } from "@/types/user.type"
import { useAuth } from "@/hooks/auth"

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  isLoggedIn: boolean;
  isActive: boolean; // Add this
  onPlay: () => void; // Add this
}

export default function PostCard({
  post,
  currentUser,
  isLoggedIn,
  isActive,
  onPlay,
}: PostCardProps) {
  const router = useRouter();
  const { like, dislike, save, loading, error } = usePostAction();
  const { checkAuth, showLoginModal, setShowLoginModal } = useAuth();
  // const [showLoginModal, setShowLoginModal] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [dislikeCount, setDislikeCount] = useState(post.dislike_count);

  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [isDisliked, setIsDisliked] = useState(post.is_disliked);

  const [animateLike, setAnimateLike] = useState(false);
  const [isSaved, setIsSaved] = useState(post.is_saved);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwnProfile = currentUser?.user_id === post.created_by.user_id;

  const [isModalOpen, setIsModalOpen] = useState(false);

  /** close menu on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ================= LIKE =================
  const handleLike = async () => {
    checkAuth(async () => {
      if (loading) return;

      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 250);

      // optimistic UI
      if (isLiked) {
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      } else {
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
        if (isDisliked) {
          setDislikeCount((prev) => prev - 1);
          setIsDisliked(false);
        }
      }
      await like(post.post_id);
    });
  };

  // ================= DISLIKE =================
  const handleDislike = async () => {
    checkAuth(async () => {
      if (loading) return;

      if (isDisliked) {
        setDislikeCount((prev) => prev - 1);
        setIsDisliked(false);
      } else {
        setDislikeCount((prev) => prev + 1);
        setIsDisliked(true);
        if (isLiked) {
          setLikeCount((prev) => prev - 1);
          setIsLiked(false);
        }
      }
      await dislike(post.post_id);
    });
  };

  // ================= SAVE / BOOKMARK =================
  const handleSave = async () => {
    checkAuth(async () => {
      if (loading) return;

      setIsSaved((prev) => !prev); // optimistic
      await save(post.post_id);
    });
  };

  // ================= REPORT =================
  const handleReportClick = () => {
    checkAuth(() => {
      setIsModalOpen(true);
      setMenuOpen(false);
    });
  };

  // handleUserProfile function (already done by you)
  const handleUserProfile = () => {
    router.push(`/profile/${post.created_by.user_id}`);
  };
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Handle External Pause (Jab koi dusra video play ho)
  useEffect(() => {
    if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  // 2. Handle Scroll Out (Jab video screen se bahar chala jaye)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || post.media_type !== "video") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !videoElement.paused) {
          videoElement.pause();
        }
        if (entry.isIntersecting) {
          // Browsers auto-play bina mute ke allow nahi karte
          videoElement.play().catch((err) => console.log("Autoplay blocked"));
          onPlay();
        }
      },
      { threshold: 0.3, rootMargin: "0px" },
    );

    observer.observe(videoElement);
    return () => observer.disconnect();
  }, [post.media_type]);
  const [showShare, setShowShare] = useState(false);
  const shareUrl = `https://www.meemhub.in/posts/${post.post_id}`;
const encodedUrl = encodeURIComponent(shareUrl);
const encodedText = encodeURIComponent(post.caption);

const shareLinks = {
  whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
  twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
};
  const handleShare = async () => {
  const url = `https://www.meemhub.in/posts/${post.post_id}`;
  const text = `${post.caption}\n\n${url}`;

  if (navigator.share) {
    await navigator.share({
      text,
    });
  } else {
    await navigator.clipboard.writeText(text);
  }
};
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl mb-4 shadow-sm">
      {/* ================= HEADER ================= */}
      {showShare && (
  <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
    <div className="bg-white w-full sm:w-80 rounded-t-2xl sm:rounded-2xl p-4">

      <h3 className="font-semibold mb-3">Share</h3>

      <div className="flex justify-around text-center">

        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
          <div className="p-3 bg-green-100 rounded-xl">WA</div>
          <p className="text-xs mt-1">WhatsApp</p>
        </a>

        <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer">
          <div className="p-3 bg-sky-100 rounded-xl">TG</div>
          <p className="text-xs mt-1">Telegram</p>
        </a>

        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
          <div className="p-3 bg-blue-100 rounded-xl">X</div>
          <p className="text-xs mt-1">X</p>
        </a>

      </div>

      {/* Copy */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(shareUrl);
          setShowShare(false);
        }}
        className="mt-4 w-full py-2 bg-gray-100 rounded-lg"
      >
        Copy Link
      </button>

      <button
        onClick={() => setShowShare(false)}
        className="mt-2 w-full py-2 bg-gray-200 rounded-lg"
      >
        Close
      </button>

    </div>
  </div>
)}
      <div className="flex items-center justify-between px-4 py-3">
        {/* user info */}
        <LoginRequiredModal
          open={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
        <div
          onClick={handleUserProfile}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="relative h-10 w-10">
            <Image
              src={post.created_by.profile_pic}
              alt="profile"
              fill
              className="rounded-full object-cover border"
            />
          </div>

          <div>
            <p className="text-sm font-semibold hover:underline">
              {post.created_by.user_name}
            </p>
            <p className="text-xs text-gray-500">{timeAgo(post.created_at)}</p>
          </div>
        </div>

        {/* right actions */}
        {!isOwnProfile && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <MoreVertical size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 w-44 bg-white  rounded-b-xl shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/posts/${post.post_id}`,
                    );
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 text-sm"
                >
                  <Link2 size={16} />
                  Copy link
                </button>

                <button
                  onClick={handleReportClick}
                  className="w-full px-4 py-3 flex items-center gap-2 text-red-600 hover:bg-red-50 text-sm"
                >
                  <Flag size={16} />
                  Report
                </button>
              </div>
            )}
            <ReportModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              targetType="Post"
              id={post.post_id}
            />
          </div>
        )}
      </div>

      {/* ================= CAPTION ================= */}
      <div className="px-4 pb-3">
        <p className="font-semibold text-gray-800 break-words">
          {post.caption}
        </p>
      </div>

      {/* ================= MEDIA ================= */}
      <div className="bg-black/5 flex justify-center">
        {post.media_type === "image" && (
          <Image
            src={post.media_url}
            alt="post"
            width={900}
            height={600}
            className="w-full max-h-130 object-contain"
          />
        )}

        {post.media_type === "video" && (
          // <CustomVideoPlayer
          //   src={post.media_url}
          //   className="w-full max-h-[520px]"
          // />
          <video
            ref={videoRef} // Ref zaroori hai
            src={post.media_url}
            controls
            playsInline
            onPlay={onPlay} // Jab user play click karega, parent ko pata chal jayega
            className="w-full max-h-130 object-contain"
          />
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex gap-1">
          {/* like */}
          <button
            disabled={loading}
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition hover:bg-gray-100
              ${isLiked ? "text-purple-600" : ""}

              ${animateLike ? "scale-125" : "scale-100"}
            `}
          >
            <ThumbsUp size={20} fill={isLiked ? "currentColor" : "none"} />
            <span className="text-xs font-bold">{formatCount(likeCount)}</span>
          </button>

          {/* dislike */}
          <button
            disabled={loading}
            onClick={handleDislike}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition hover:bg-gray-100 
              ${isDisliked ? "text-gray-650" : ""}`}
          >
            <ThumbsDown size={20} fill={isDisliked ? "currentColor" : "none"} />
            <span className="text-xs font-bold">
              {formatCount(dislikeCount)}
            </span>
          </button>

          {/* comment */}
          <button
            onClick={() => router.push(`/posts/${post.post_id}`)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <MessageCircle size={20} />
            <span className="text-xs font-bold">Comment</span>
          </button>
        </div>

        <div className="flex gap-1">
          {/* bookmark */}
          <button
            onClick={handleSave}
            className={`p-2 transition rounded-lg hover:bg-gray-100
            ${isSaved ? "text-purple-600 bg-purple-100" : "text-gray-600"}
          `}
          >
            <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
          </button>

          {/* share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
