import { permanentRedirect } from "next/navigation";

export default function MyBlogPage() {
  permanentRedirect("/blog");
}
