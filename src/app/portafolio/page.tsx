import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortfolioGallery, type PortfolioItem } from "@/components/portfolio/PortfolioGallery";
import { getPublicBarbers } from "@/lib/public-data";
import { WORK_IMAGES } from "@/lib/gallery";

export const metadata = { title: "Portafolio" };

const TYPES = ["Fade", "Corte clásico", "Barba", "Diseño", "Color"];
const TRENDS = ["Clásico", "Moderno", "Urbano"];

export default async function PortafolioPage() {
  const barbers = await getPublicBarbers();
  const names = barbers.length > 0 ? barbers.map((b) => `${b.user.firstName} ${b.user.lastName}`) : ["Equipo Imperio"];

  // Conjunto de muestra combinando las fotos con barbero/tipo/tendencia. Cuando
  // exista contenido real, se reemplaza por un modelo Portfolio en la base.
  const items: PortfolioItem[] = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    image: WORK_IMAGES[i % WORK_IMAGES.length],
    barber: names[i % names.length],
    type: TYPES[i % TYPES.length],
    trend: TRENDS[i % TRENDS.length],
  }));

  return (
    <div className="container-app pb-24 pt-28 md:pt-36">
      <SectionHeading
        eyebrow="Portafolio"
        title="Cortes realizados"
        subtitle="Explora nuestros trabajos y filtra por barbero, tipo de corte o tendencia."
      />
      <div className="mt-12">
        <PortfolioGallery items={items} barbers={names} types={TYPES} trends={TRENDS} />
      </div>
    </div>
  );
}
