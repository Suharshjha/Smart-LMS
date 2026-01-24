// const API_BASE = "http://localhost:8080";
//
// export async function apiFetch(
//     endpoint: string,
//     options: RequestInit = {}
// ) {
//     // Read logged-in user from localStorage
//     const userStr = localStorage.getItem("lms_user");
//     const user = userStr ? JSON.parse(userStr) : null;
//
//     // FIX: The token is saved as user.jwtToken (NOT user.token)
//     const token = user?.jwtToken || user?.token || null;
//
//     const headers: HeadersInit = {
//         "Content-Type": "application/json",
//         ...(options.headers || {}),
//     };
//
//     // Attach Bearer token if exists
//     if (token) {
//         headers["Authorization"] = `Bearer ${token}`;
//     }
//
//     const response = await fetch(`${API_BASE}${endpoint}`, {
//         ...options,
//         headers,
//     });
//
//     // ❗ Handle Unauthorized
//     if (response.status === 401) {
//         console.error("❌ Unauthorized — Invalid or missing JWT");
//         localStorage.removeItem("lms_user"); // clear corrupted token
//         return Promise.reject({ error: "Unauthorized", status: 401 });
//     }
//
//     // ❗ Handle all non-OK responses
//     if (!response.ok) {
//         let err: any = {};
//         try {
//             err = await response.json();
//         } catch {
//             err = { error: "Unknown server error", status: response.status };
//         }
//         console.error("❌ API Error:", err);
//         return Promise.reject(err);
//     }
//
//     // Return JSON if possible, or empty object
//     try {
//         return await response.json();
//     } catch {
//         return {};
//     }
// }
//


// ✅ Read API base URL from environment
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
) {
    // Read logged-in user from localStorage
    const userStr = localStorage.getItem("lms_user");
    const user = userStr ? JSON.parse(userStr) : null;

    // JWT token (supports both keys)
    const token = user?.jwtToken || user?.token || null;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    // Attach Bearer token if exists
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    // ❗ Unauthorized
    if (response.status === 401) {
        console.error("❌ Unauthorized — Invalid or missing JWT");
        localStorage.removeItem("lms_user");
        return Promise.reject({ error: "Unauthorized", status: 401 });
    }

    // ❗ Any other error
    if (!response.ok) {
        let err: any = {};
        try {
            err = await response.json();
        } catch {
            err = { error: "Unknown server error", status: response.status };
        }
        console.error("❌ API Error:", err);
        return Promise.reject(err);
    }

    // ✅ Return JSON safely
    try {
        return await response.json();
    } catch {
        return {};
    }
}
