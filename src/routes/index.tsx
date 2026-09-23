import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/public-pages";
import { getPortfolio } from "@/lib/portfolio.functions";

export const Route = createFileRoute("/")({
  loader: () => getPortfolio(),
  head: () => ({ meta: [
    { title: "Bouissa Mohamed — Full-Stack Developer & Technical Lead" },
    { name: "description", content: "Full-Stack Developer and Technical Lead building web, mobile, SaaS, AI, Unity, and interactive products." },
    { property: "og:title", content: "Bouissa Mohamed — Full-Stack Developer & Technical Lead" },
    { property: "og:description", content: "Engineering ambitious digital products from architecture to launch." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://i.ibb.co/Fb6MCxtC/91e3fcbe-6255-454c-a984-bbf0505652e4.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: "https://i.ibb.co/Fb6MCxtC/91e3fcbe-6255-454c-a984-bbf0505652e4.jpg" },
  ] }),
  component: Index,
});

function Index() {
  return <HomePage data={Route.useLoaderData()} />;
}
