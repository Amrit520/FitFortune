import React from 'react';
import { Skeleton } from '../components/ui/skeleton'

export function MealPlanSkeleton() {
  return (
    <ul className="relative flex mx-auto flex-wrap justify-center p-5">
      {/* Only render 3 skeleton cards */}
      {[1, 2, 3].map((item) => (
        <li key={item} className="w-full max-h-[35vh] md:max-w-[25vw] rounded overflow-hidden m-5 shadow-lg bg-white">
          {/* Image skeleton */}
          <div className="w-full h-[45%]">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Title skeleton */}
          <div className="px-6 py-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
          </div>

          {/* Tags skeleton */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex flex-wrap">
              <Skeleton className="h-8 w-24 rounded-full mr-2 mb-2" />
              <Skeleton className="h-8 w-28 rounded-full mr-2 mb-2" />
              <Skeleton className="h-8 w-20 rounded-full mr-2 mb-2" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

