import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import categories from "../../data/Categories.json";
import { useVideoStore } from "../../store/videoStore";

const Categories: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { currentCategory, setCategory } = useVideoStore();

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };

  return (
    <div className="bg-black fixed z-20 left-0 top-[60px] w-screen py-3 px-8">
      <div className="relative flex items-center">
        {canScrollLeft && (
          <button
            aria-label="scroll-left"
            className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-black hover:bg-zinc-500 rounded-full"
            onClick={scrollLeft}
          >
            <FaChevronLeft className="text-white text-md" />
          </button>
        )}

        {canScrollRight && (
          <button
            aria-label="scroll-right"
            className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-black hover:bg-zinc-500 rounded-full z-10"
            onClick={scrollRight}
          >
            <FaChevronRight className="text-white text-md" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex flex-nowrap gap-3 overflow-x-auto no-scrollbar w-full"
          onScroll={updateScrollButtons}
        >
          {categories.map((cat: { id: number; name: string }) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.name)}
              className={`whitespace-nowrap cursor-pointer px-4 py-2 text-sm rounded-lg transition-all
                ${
                  currentCategory.toLowerCase() === cat.name.toLowerCase()
                    ? "bg-white text-black font-semibold"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-600"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
