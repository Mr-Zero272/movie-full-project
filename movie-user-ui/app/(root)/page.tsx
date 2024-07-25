'use client';

import TextSlide from '@/components/shared/TextSlide';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export default function Home() {
    const [activeSlide, setActiveSlide] = useState(0);

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        beforeChange: (current: number, next: number) => setActiveSlide(next),
    };

    const slides = [
        {
            title: 'Slide 1',
            description: 'This is the first slide',
            imageBg: 'https://get.wallhere.com/photo/anime-anime-girls-blue-archive-2268408.jpg',
        },
        {
            title: 'Slide 2',
            description: 'This is the second slide',
            imageBg:
                'https://get.wallhere.com/photo/Omagari-Hare-Blue-Archive-blue-archive-anime-games-anime-anime-girls-gray-hair-green-eyes-2304886.jpg',
        },
        {
            title: 'Slide 3',
            description: 'This is the third slide',
            imageBg:
                'https://get.wallhere.com/photo/Honkai-Star-Rail-artwork-Robin-Honkai-Star-Rail-anime-anime-girls-gray-hair-green-eyes-flowers-dress-barefoot-earring-2301280.jpg',
        },
    ];

    return (
        <main className="mx-auto mt-20">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index}>
                        {/* <Image
                            src={slide.imageBg}
                            alt={slide.title}
                            width={500}
                            height={500}
                            loading="eager"
                            quality={100}
                        /> */}
                        <div style={{ padding: '20px', background: '#ddd' }}>
                            <AnimatePresence>
                                {activeSlide === index && (
                                    <>
                                        <TextSlide key={`title-${index}`} text={slide.title} delay={0.5} />
                                        <TextSlide key={`desc-${index}`} text={slide.description} delay={0.5} />
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </Slider>
        </main>
    );
}
