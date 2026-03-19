export const routes = {
    host:
        process.env.NODE_ENV !== "production"
            ? "http://localhost:8000"
            : `http://${window.location.hostname}:${process.env.NEXT_PUBLIC_WEB_API_PORT}`,
    signIn: "/api/sign-in",
    signOut: "/sign-out",
    signUp: "/sign-up",
    verification: "/verification",
    posts: "/api/posts",
    myPosts: "/api/posts/my",
    likedPosts: "/api/posts/liked",
    toggleLike: (postId: number) => `/api/posts/${postId}/like`,
};

export const messageRoutes = {
    conversations: "/api/messages/conversations",
    conversation: (userId: number) => `/api/messages/${userId}`,
    markAsRead: (userId: number) => `/api/messages/${userId}/read`,
    onlineStatus: (userId: number) => `/api/users/${userId}/online`,
};
