import { Star } from 'lucide-react'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

type Review = {
  id: string
  rating: number
  comment: string
  created_at: string
  customer: {
    full_name: string
  }
}

export default function ReviewList({ reviews }: { reviews: any[] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-gray-500">
        Non ci sono ancora recensioni per questa sede.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="p-8 bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800 rounded-[2rem] space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`w-4 h-4 ${s <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {format(new Date(review.created_at), 'd MMMM yyyy', { locale: it })}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 italic">"{review.comment}"</p>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold text-xs">
              {review.profiles?.full_name?.[0] || 'U'}
            </div>
            <span className="font-bold text-sm">{review.profiles?.full_name || 'Cliente Verificato'}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
