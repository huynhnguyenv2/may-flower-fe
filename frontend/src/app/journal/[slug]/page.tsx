import { notFound } from "next/navigation";

const content: Record<string, { title: string; body: string }> = {
  "y-nghia-hoa-hong": {
    title: "Hoa hồng không chỉ là tình yêu",
    body: "Sắc cam coral gợi sự ấm áp; hồng pastel nhẹ như lời cảm ơn. May Flower chọn hoa theo câu chuyện của bạn.",
  },
  "cham-hoa-tuoi": {
    title: "Giữ hoa tươi lâu hơn ở nhà",
    body: "Thay nước mỗi ngày, cắt gốc chéo nhẹ, tránh ánh nắng trực tiếp. Studio luôn gửi kèm hướng dẫn chăm sóc.",
  },
};

type Props = { params: Promise<{ slug: string }> };

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = content[slug];
  if (!post) notFound();

  return (
    <article className="prose prose-neutral max-w-2xl">
      <h1 className="font-display text-4xl">{post.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/80">{post.body}</p>
    </article>
  );
}
