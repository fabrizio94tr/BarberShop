'use client'

import { useState } from 'react'

const GALLERY_IMAGES = [
  '/shop_1.png',
  '/shop_2.png',
  '/shop_3.png',
  '/hero_bg.png',
  '/barber1.png', // Fallback se esistono
]

export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GALLERY_IMAGES.map((img, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedImage(img)}
            className="aspect-square rounded-3xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
          >
            <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Lightbox Simple */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-5xl w-full aspect-video rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl">
            <img src={selectedImage} alt="Fullscreen" className="w-full h-full object-cover" />
          </div>
          <button className="absolute top-8 right-8 text-white text-4xl font-light">&times;</button>
        </div>
      )}
    </div>
  )
}
