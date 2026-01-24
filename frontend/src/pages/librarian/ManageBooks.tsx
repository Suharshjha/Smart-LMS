// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { useAuth } from "@/contexts/AuthContext";
//
// const ManageBooks = () => {
//   const { user } = useAuth();
//
//   const [bookId, setBookId] = useState("");
//   const [bookName, setBookName] = useState("");
//   const [authorName, setAuthorName] = useState("");
//   const [numberOfCopies, setNumberOfCopies] = useState(1);
//   const [bookCategory, setBookCategory] = useState("");
//
//   const handleAddBook = async () => {
//     if (!user?.token) {
//       toast.error("You are not authenticated. Please login again.");
//       return;
//     }
//
//     if (!bookName || !authorName || !bookCategory) {
//       toast.error("All fields are required!");
//       return;
//     }
//
//     const payload = {
//       bookId: bookId.trim() !== "" ? bookId : `BOOK-${Date.now()}`,
//       bookName,
//       authorName,
//       numberOfCopies,
//       bookCategory,
//     };
//
//     try {
//       const response = await fetch("http://localhost:8080/librarian/add-book", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: JSON.stringify(payload),
//       });
//
//       if (!response.ok) {
//         const errText = await response.text();
//         throw new Error(errText || "Failed to add book");
//       }
//
//       toast.success("Book added successfully!");
//
//       setBookId("");
//       setBookName("");
//       setAuthorName("");
//       setNumberOfCopies(1);
//       setBookCategory("");
//     } catch (error: any) {
//       toast.error(error.message || "Something went wrong");
//     }
//   };
//
//   return (
//       <div className="p-6 space-y-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>Add New Book</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <Input
//                 placeholder="Book ID (optional)"
//                 value={bookId}
//                 onChange={(e) => setBookId(e.target.value)}
//             />
//             <Input
//                 placeholder="Book Name"
//                 value={bookName}
//                 onChange={(e) => setBookName(e.target.value)}
//             />
//             <Input
//                 placeholder="Author Name"
//                 value={authorName}
//                 onChange={(e) => setAuthorName(e.target.value)}
//             />
//             <Input
//                 type="number"
//                 min={1}
//                 placeholder="Number of Copies"
//                 value={numberOfCopies}
//                 onChange={(e) => setNumberOfCopies(Number(e.target.value))}
//             />
//             <Input
//                 placeholder="Category"
//                 value={bookCategory}
//                 onChange={(e) => setBookCategory(e.target.value)}
//             />
//
//             <Button className="w-full" onClick={handleAddBook}>
//               Add Book
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//   );
// };
//
// export default ManageBooks;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const ManageBooks = () => {
  const { user } = useAuth();

  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [numberOfCopies, setNumberOfCopies] = useState(1);
  const [bookCategory, setBookCategory] = useState("");

  const handleAddBook = async () => {
    if (!user?.token) {
      toast.error("You are not authenticated. Please login again.");
      return;
    }

    if (!bookName || !authorName || !bookCategory) {
      toast.error("All fields are required!");
      return;
    }

    const payload = {
      bookName,
      authorName,
      numberOfCopies,
      bookCategory,
    };

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(`${API_BASE}/librarian/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add book");
      }

      toast.success("Book added successfully!");

      // reset form
      setBookName("");
      setAuthorName("");
      setNumberOfCopies(1);
      setBookCategory("");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
      <div className="p-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <Input
                placeholder="Book Name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
            />

            <Input
                placeholder="Author Name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
            />

            <Input
                type="number"
                min={1}
                placeholder="Number of Copies"
                value={numberOfCopies}
                onChange={(e) => setNumberOfCopies(Number(e.target.value))}
            />

            <Input
                placeholder="Category (e.g. Programming, DSA, Web Dev)"
                value={bookCategory}
                onChange={(e) => setBookCategory(e.target.value)}
            />

            <Button className="w-full" onClick={handleAddBook}>
              Add Book
            </Button>
          </CardContent>
        </Card>
      </div>
  );
};

export default ManageBooks;
