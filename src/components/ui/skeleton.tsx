import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700", className)} {...props} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-20 h-3 mb-2" />
      <Skeleton className="w-32 h-7" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === 0 ? "w-48" : i === cols - 1 ? "w-16 ml-auto" : "w-24"}`} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="p-4">
      <Skeleton className="w-full h-8 mb-4" />
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {Array.from({ length: rows }).map((_, i) => (<TableRowSkeleton key={i} cols={cols} />))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (<CardSkeleton key={i} />))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <Skeleton className="w-40 h-5 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1"><Skeleton className="w-32 h-4 mb-1" /><Skeleton className="w-24 h-3" /></div>
              <Skeleton className="w-20 h-4" />
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <Skeleton className="w-24 h-5 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 mb-4">
              <Skeleton className="w-5 h-5 rounded" />
              <div><Skeleton className="w-28 h-4 mb-1" /><Skeleton className="w-20 h-3" /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1"><Skeleton className="w-40 h-4 mb-1" /><Skeleton className="w-24 h-3" /></div>
          <Skeleton className="w-16 h-5 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="p-6">
      <Skeleton className="w-48 h-8 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"><Skeleton className="w-32 h-5 mb-4" /><Skeleton className="w-48 h-8 mb-2" /><Skeleton className="w-24 h-4" /></div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"><Skeleton className="w-32 h-5 mb-4" /><Skeleton className="w-48 h-8 mb-2" /><Skeleton className="w-24 h-4" /></div>
      </div>
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div className="p-6">
      <div className="flex justify-between mb-8">
        <div><Skeleton className="w-48 h-8 mb-2" /><Skeleton className="w-32 h-4" /></div>
        <Skeleton className="w-36 h-10 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (<CardSkeleton key={i} />))}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        <TableSkeleton rows={5} cols={4} />
      </div>
    </div>
  );
}
