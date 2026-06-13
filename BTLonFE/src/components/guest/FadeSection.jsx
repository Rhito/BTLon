import { useFadeIn } from "@/hooks/useFadeIn";
export default function FadeSection({ children, className = "" }) {
  const { ref, visible } = useFadeIn();
  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </section>
  );
}
