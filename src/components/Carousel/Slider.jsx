import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const Slider = ({ slides, classes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={`relative w-full h-full ${classes}`}>
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000 }}
        navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next" }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="h-full w-full">
            {slide.content || (
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation */}
      <div className="custom-prev absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow rounded-full p-2 cursor-pointer">
        <FaChevronLeft className="text-gray-700" />
      </div>
      <div className="custom-next absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow rounded-full p-2 cursor-pointer">
        <FaChevronRight className="text-gray-700" />
      </div>
    </div>
  );
};

export default Slider;
